export interface User {
    id: number;
    cpf: string;
    nome: string;
    telefone: JSON;
    endereco: {
        estado: string,
        cep: string,
        municipio: string,
        logradouro: string,
        numero: number,
        complemento: string,
        bairro: string
    };
}
