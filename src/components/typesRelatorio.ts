import { StatusLancamento, TipoLancamento } from "./typesLancamentos";

export type objetoRelatorio = {
    id: number,
    descricao: string,
    tipoLancamento: TipoLancamento,
    valor: number,
    mes: number,
    ano: number;
    statusLancamento: StatusLancamento
}