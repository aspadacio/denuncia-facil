
export interface Delation {
    id: number,
    protocolo: string,
    idEmpresa: number,
    idUsuario: number,
    dsTitulo: string,
    dsHistoria: [
        {
            idHistoria: number,
            dsHistoria: string,
            tsHistoria: string
        }
    ],
    dsResposta: [
        {
            idResposta: number,
            dsResposta: string,
            tsResposta: string
        }
    ],
    tsReclamacao: string,

    //Transients
    dsEmpresa: string,
    dsUsuario: string
}