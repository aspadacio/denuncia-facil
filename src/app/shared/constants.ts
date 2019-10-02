import { Injectable } from '@angular/core';

export class Constants {
    static readonly DATE_FORMAT = 'dd/MM/yy';
    static readonly DATE_TIME_FORMAT = `${Constants.DATE_FORMAT} hh:mm`;
    static readonly DATE_TIME_TS_FORMAT = 'yyyy-LL-dd hh:mm:ss'; //Padrão do banco de dados
}

@Injectable({
    providedIn: 'root',
  })
export class GlobalConstants {
    static COMPANY_CONTEXT = null;
    static COMPANY_ID = null;
    static USER_LOGGED_NAME = null;
    static USER_LOGGED_CPF = null;
}