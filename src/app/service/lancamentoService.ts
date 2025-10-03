import ApiService from "../apiservice";
import ErroValidacao from "../service/exception/erroValidacao"

type objetoFiltroLanc = {
    ano: string,
    mes: string,
    tipo: string,
    descricao: string,
    status: string,
    usuario: string
}

export default class LancamentoService extends ApiService {

    constructor() {
        super('/lancamento');
    }

    obterListaMeses = () => {
        return [
            { label: 'Selecione...', value: '' },
            { label: 'Janeiro', value: 1 },
            { label: 'Fevereiro', value: 2 },
            { label: 'Março', value: 3 },
            { label: 'Abril', value: 4 },
            { label: 'Maio', value: 5 },
            { label: 'Junho', value: 6 },
            { label: 'Julho', value: 7 },
            { label: 'Agosto', value: 8 },
            { label: 'Setembro', value: 9 },
            { label: 'Outubro', value: 10 },
            { label: 'Novembro', value: 11 },
            { label: 'Dezembro', value: 12 }
        ]
    }

    obterListaTipos = () => {
        return [
            { label: 'Selecione...', value: '' },
            { label: 'Receita', value: 1 },
            { label: 'Despesa', value: 2 }
        ]
    }

    retornaNomeMes = (numeroMes: number) => {
        switch (numeroMes) {
            case 1:
                return "JANEIRO";
            case 2:
                return "FEVEREIRO"
            case 3:
                return "MARÇO"
            case 4:
                return "ABRIL"
            case 5:
                return "MAIO"
            case 6:
                return "JUNHO"
            case 7:
                return "JULHO"
            case 8:
                return "AGOSTO"
            case 9:
                return "SETEMBRO"
            case 10:
                return "OUTUBRO"
            case 11:
                return "NOVEMBRO"
            default:
                return "DEZEMBRO"
        }
    }

    obterPorId(id: number) {
        return this.get(`/${id}`);
    }

    alterarStatus(id: number, status: number) {
        //@ts-ignore
        return this.put(`/atualiza-status-lancamento/${id}?statusLancamentoId=${status}`, {})
    }

    validacao(Lancamento: any) {
        const erros = [];

        if (!Lancamento.ano) {
            erros.push("Informe o ano.");
        }

        if (!Lancamento.mes) {
            erros.push("Informe o mês.");
        }

        if (!Lancamento.descricao) {
            erros.push("Informe a descrição.");
        }

        if (!Lancamento.valor) {
            erros.push("Informe o valor.");
        }

        if (!Lancamento.tipoLancamento) {
            erros.push("Informe o tipo.");
        }

        if (erros && erros.length > 0) {
            //@ts-ignore
            throw new ErroValidacao(erros);
        }
    }

    salvar(Lancamento: object) {
        console.log(Lancamento)
        return this.post('', Lancamento)
    }

    atualizar(id: any, Lancamento: any) {
        return this.put(`/${id}`, Lancamento)
    }

    consultar(lancamentoFiltro: objetoFiltroLanc) {
        let params = `/por-filtro?ano=${lancamentoFiltro.ano}`

        if (lancamentoFiltro.mes) {
            params = `${params}&mes=${lancamentoFiltro.mes}`
        }

        if (lancamentoFiltro.tipo) {
            params = `${params}&tipoLancamento=${lancamentoFiltro.tipo}`
        }

        if (lancamentoFiltro.usuario) {
            params = `${params}&usuarioId=${lancamentoFiltro.usuario}`
        }

        if (lancamentoFiltro.descricao) {
            params = `${params}&descricao=${lancamentoFiltro.descricao}`
        }

        return this.get(params)
    }

    deletar(id: string) {
        return this.delete(`/${id}`)
    }

    consultaLancamentosPorPeriodo(mesInicial: any, mesFinal: any, anoInicial: any, anoFinal: any, usuarioID: number) {
        let params = `/por-perido?mesInicial=${mesInicial}&anoInicial=${anoInicial}&mesFinal=${mesFinal}&anoFinal=${anoFinal}&usuarioId=${usuarioID}`;

        console.log(params);

        return this.get(params);
    }

    obterSaldoPorUsuario(usuarioId: string) {
        return this.get(`/saldo-por-usuario?usuarioId=${usuarioId}`)
    }
}