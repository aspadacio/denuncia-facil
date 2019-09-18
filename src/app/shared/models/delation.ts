
export interface Delation {
    id: number,
    protocolo: string,
    idEmpresa: number,
    idUsuario: number,
    dsTitulo: string,
    dsHistoria: [
        {
            dsHistoria: string,
            tsHistoria: number
        }
    ],
    dsResposta: [
        {
            dsResposta: string,
            tsResposta: number
        }
    ],
    tsReclamacao: number,

    //Transients
    dsEmpresa: string,
    dsUsuario: string
}