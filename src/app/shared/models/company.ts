export interface Company {
    atividade_principal: JSON;
    atividades_secundarias: JSON;
    billing: JSON;
    extra: JSON;
    qsa: JSON;

    id: number;
    cnpj: string;
    nome: string;
    fantasia: string;
    situacao: string;
    data_situacao: string;
    uf: string;
    bairro: string;
    logradouro: string;
    complemento: string;
    cep: string;
    municipio: string;
    natureza_juridica: string;
    tipo: string;
    numero: string;
    porte: string;
    status: string;
    ultima_atualizacao: string;
    telefone: string;
    email: string;
}
