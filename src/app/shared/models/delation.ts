
export interface Delation {
    id: number,
    idEmpresa: number,
    idUsuario: number,
    dsTitulo: string,
    dsHistoria: [
        {
            idHistoria: number,
            dsHistoria: string,
            tsHistoria: Date
        }
    ],
    dsResposta: [
        {
            idResposta: number,
            dsResposta: string,
            tsResposta: Date
        }
    ],
    tsReclamacao: Date,

    //Transients
    dsEmpresa: string,
    dsUsuario: string
}