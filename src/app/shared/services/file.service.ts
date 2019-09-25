import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private url: string = `${environment.SERVER}denuncia`;

  constructor( private http: HttpClient ) { }

  /**
   * Sent file(s) to back-end
   * @param files 
   */
  public uploadDenunciaAnexos( files: Set<File> ) {
    const formData = new FormData();
    files.forEach(file => formData.append('file', file, file.name));
    return this.http.post(this.url, formData, {
      //responseType: 'blob' as 'json'
    });
  }
}
