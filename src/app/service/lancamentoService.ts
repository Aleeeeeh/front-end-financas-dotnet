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

export default class LancamentoService extends ApiService{

    constructor(){
        super('/api/lancamentos');
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
            { label: 'Despesa', value: 'DESPESA' } ,
            { label: 'Receita', value: 'RECEITA' }
        ]
    }

    retornaNomeMes = (numeroMes:number) =>{
        switch(numeroMes){
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

    obterPorId(id: number){
        return this.get(`/${id}`);
    }
    
    alterarStatus(id: string, status:string){
        //@ts-ignore
        return this.put(`/${id}/atualiza-status`, { status })
    }

    validacao(Lancamento: any){
        const erros = [];

        if(!Lancamento.ano){
            erros.push("Informe o ano.");
        }

        if(!Lancamento.mes){
            erros.push("Informe o mês.");
        }

        if(!Lancamento.descricao){
            erros.push("Informe a descrição.");
        }

        if(!Lancamento.valor){
            erros.push("Informe o valor.");
        }

        if(!Lancamento.tipo){
            erros.push("Informe o tipo.");
        }

        if(erros && erros.length > 0){
            //@ts-ignore
            throw new ErroValidacao(erros);
        }
    }

    salvar(Lancamento: object){
        return this.post('/', Lancamento)
    }

    atualizar(Lancamento: any){
        return this.put(`/${Lancamento.id}`, Lancamento)
    }

    consultar(lancamentoFiltro: objetoFiltroLanc){
        let params = `?ano=${lancamentoFiltro.ano}`

        if(lancamentoFiltro.mes){
            params = `${params}&mes=${lancamentoFiltro.mes}`
        }

        if(lancamentoFiltro.tipo){
            params = `${params}&tipo=${lancamentoFiltro.tipo}`
        }

        if(lancamentoFiltro.status){
            params = `${params}&status=${lancamentoFiltro.status}`
        }

        if(lancamentoFiltro.usuario){
            params = `${params}&usuario=${lancamentoFiltro.usuario}`
        }

        if(lancamentoFiltro.descricao){
            params = `${params}&descricao=${lancamentoFiltro.descricao}`
        }

        return this.get(params)
    }

    deletar(id: string){
        return this.delete(`/${id}`)
    }

    consultaLancamentosPorPeriodo(mesInicial:number,mesFinal:number,anoInicial:string,anoFinal:string,usuarioID:string){
        let params = `/peridoLancamento?usuarioId=${usuarioID}&anoAtual=${anoInicial}&anoFinal=${anoFinal}&mesAtual=${mesInicial}&mesFinal=${mesFinal}`

        console.log(params);

        return this.get(params);
    }

}