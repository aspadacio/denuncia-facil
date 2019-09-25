export interface Delatation {
    id: number,
    protocolo: string,
    idEmpresa: number,
    idUsuario: number,
    dsTitulo: string,
    dsHistoria: [
        {
            id: number,
            dsHistoria: string,
            dsNomeAnexo: string[],
            tsHistoria: number,
        }
    ],
    dsResposta: [
        {
            id: number,
            dsResposta: string,
            dsNomeAnexo: string[],
            tsResposta: number
        }
    ],
    tsReclamacao: number,

    //Transients
    dsEmpresa: string,
    dsUsuario: string
}