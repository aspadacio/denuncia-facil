import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private url: string = `${environment.BACKEND_SERVER}`;

  constructor( private http: HttpClient ) { }

  /**
   * Sent file(s) to back-end
   * @param files 
   */
  public uploadDenunciaAnexos( files: Set<File> ) {
    const formData = new FormData();
    files.forEach(file => formData.append('file', file, file.name));
    return this.http.post(`${this.url}denuncia/anexo`, formData, {
      //responseType: 'blob' as 'json'
    });
  }

  //Se não passar as options no GET, por padrão o Angular retorna um JSON.
  //Nosso caso, queremos arquivos
  downloadAttachment(name: string) {
    return this.http.get(`${this.url}denuncia/download`, {
      params: { name: name },
      responseType: 'blob' as 'json'
    });
  }

  /**
   * Método que irá se preocupar de realizar o download automático do arquivo
   * e tratar caso-a-caso para cada browser
   * @param res 
   * @param fileName 
   */
  handleFile(res: any, fileName: string) {
    const file = new Blob([res], {
      type: res.type
    });

    //IE
    if( window.navigator && window.navigator.msSaveOrOpenBlob ) {
      window.navigator.msSaveOrOpenBlob(file);
      return;
    }

    const blob = window.URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = blob;
    link.download = fileName;
    
    //link.click(); doesnt works on Firefox
    link.dispatchEvent(new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    }));

    //Mozilla Firefox - precisa do delay na hora de remover o botão
    setTimeout(() => { 
      window.URL.revokeObjectURL(blob);
      link.remove();
    }, 100);
  }
}
