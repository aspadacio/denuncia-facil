import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, take, delay, tap } from 'rxjs/operators';
import { SisUtil } from '../sis-util';


@Injectable({
    providedIn: 'root'
})
export class ConsultaCnpjService {
    constructor(
        private http: HttpClient
    ){ }

    consultaCNPJ(cnpj: string): Observable<Object> {
        cnpj = SisUtil.replaceStr(cnpj.toString()); //Por causa do Auto-Complete do Browser
        //Complete with left ZERO(s)
        if(cnpj !== null && cnpj !== '') {
            let cnpjStr = cnpj.toString();
            if(cnpjStr.length < 14){
                const qtdZeros = 14 - cnpjStr.length;
                for( let i=0; i<qtdZeros; i++ ){
                    cnpjStr = "0".concat(cnpjStr);
                }
            }
            //console.log(`CNPJ Formatado ${cnpjStr.replace(/^(\d{2})(\d{3})?(\d{3})?(\d{4})?(\d{2})?/, "$1.$2.$3/$4-$5")}`);
            //return this.http.get(`${environment.RECEITA_CNPJ_API}${cnpj}`).pipe(delay(1500),take(1));
            return this.http.jsonp(`${environment.RECEITA_CNPJ_API}${cnpj}`, 'callback').pipe(delay(1500),take(1));
        }
        return of({});
    }
}