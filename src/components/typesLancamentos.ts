export type objetoLancamento = {
    id: string,
    descricao: string,
    valor: number,
    tipoLancamento: TipoLancamento,
    mes: string,
    statusLancamento: StatusLancamento
}

export enum TipoLancamento {
    RECEITA = 1,
    DESPESA = 2
}

export enum StatusLancamento {
    PENDENTE = 1,
    CANCELADO = 2,
    EFETIVADO = 3
}