import React from 'react'
import currencyFormatter from 'currency-formatter'
import { objetoLancamento } from './typesLancamentos'
import LancamentoService from '../app/service/lancamentoService'

export default (props: any) => {

    const service = new LancamentoService();

    const rows = props.lancamentos.map( (Lancamento: objetoLancamento) => {
        return(
            <tr key={Lancamento.id}>
                <td>{Lancamento.descricao}</td>
                <td>{currencyFormatter.format(Lancamento.valor, {locale: 'pt-BR'})}</td>
                <td>{Lancamento.tipo}</td>
                <td>{service.retornaNomeMes(parseInt(Lancamento.mes))}</td>
                <td>{Lancamento.status}</td>
                <td>
                    <button className="btn btn-success"
                            disabled={ Lancamento.status !== "PENDENTE" }
                            onClick={e => props.alteraStatusLancamento(Lancamento, "EFETIVADO")}
                            title="Efetivar"
                            type="button">
                            <i className="pi pi-check"></i>
                    </button>
                    <button className="btn btn-warning"
                            disabled={ Lancamento.status !== "PENDENTE" }
                            onClick={e => props.alteraStatusLancamento(Lancamento, "CANCELADO")}
                            title="Cancelar"
                            type="button">
                            <i className="pi pi-times"></i>
                    </button>
                    <button type="button" 
                            className="btn btn-primary"
                            onClick={e => props.editarLancamento(Lancamento.id)}
                            title="Editar">                          
                            <i className="pi pi-pencil"></i>
                    </button>
                    <button type="button" 
                            className="btn btn-danger"
                            onClick={e => props.deletarLancamento(Lancamento)}
                            title="Excluir">                          
                            <i className="pi pi-trash"></i>
                    </button>
                </td>
            </tr>
        )
    })

    return(
        <table className="table table-hover">
            <thead>
                <tr>
                    <th scope="col">Descrição</th>
                    <th scope="col">Valor</th>
                    <th scope="col">Tipo</th>
                    <th scope="col">Mês</th>
                    <th scope="col">Situação</th>
                    <th scope="col">Ações</th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
    )

}