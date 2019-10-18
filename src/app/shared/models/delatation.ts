export interface Delatation {
    _id: string,
    PROTOCOLO: string,
    EMPRESA_ID: string,
    USUARIO_ID: string,
    DS_TITULO: string,
    DS_HISTORIA: [
        {
            id: number,
            DS_HISTORIA: string,
            DS_NOME_ANEXO: string[],
            TS_HISTORIA: string,
        }
    ],
    DS_RESPOSTA: [
        {
            id: number,
            DS_RESPOSTA: string,
            DS_NOME_ANEXO: string[],
            TS_RESPOSTA: string
        }
    ],
    TS_DENUNCIA: string,
    TS_VISIVEL: number
}