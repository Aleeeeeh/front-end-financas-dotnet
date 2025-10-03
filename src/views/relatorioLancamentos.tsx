import { useState } from 'react'
import Card from '../components/Card';
import { objetoRelatorio } from '../components/typesRelatorio'
import { Calendar } from 'primereact/calendar';
import * as mensagem from '../components/toastr'
import localStorageService from '../app/service/localStorageService';
import LancamentoService from '../app/service/lancamentoService';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'
import { StatusLancamento, TipoLancamento } from '../components/typesLancamentos';

// Mapas de de/para
const TipoLancamentoMap: Record<TipoLancamento, string> = {
    [TipoLancamento.RECEITA]: "Receita",
    [TipoLancamento.DESPESA]: "Despesa",
};

const StatusLancamentoMap: Record<StatusLancamento, string> = {
    [StatusLancamento.PENDENTE]: "Pendente",
    [StatusLancamento.CANCELADO]: "Cancelado",
    [StatusLancamento.EFETIVADO]: "Efetivado",
};

export default function relatorioLancamentos() {
    const [dataInicialCompleta, setdataInicialCompleta] = useState<any>('');
    const [dataFinalCompleta, setdataFinalCompleta] = useState<any>('');
    const [lancamentoFiltrados, setLancamentosFiltrados] = useState<objetoRelatorio[]>([]);

    const service = new LancamentoService();

    const dadosDeUsuario = localStorageService.obterItem("_usuario_logado");

    const converterObjetoEmString = (objeto: object) => {
        var objetoConvertidoEmString = objeto.toString();

        return objetoConvertidoEmString;
    }

    const converterStringEmObjetoFormatado = (dataEmString: string) => {
        var objetoFormatado = dataEmString.split(" ");

        return objetoFormatado;
    }

    const retornarNumeroDoMes = (nomeMes: string) => {
        switch (nomeMes) {
            case "Jan":
                return 1;
            case "Feb":
                return 2;
            case "Mar":
                return 3;
            case "Apr":
                return 4;
            case "May":
                return 5;
            case "Jun":
                return 6;
            case "Jul":
                return 7;
            case "Aug":
                return 8;
            case "Sep":
                return 9;
            case "Oct":
                return 10;
            case "Nov":
                return 11;
            case "Dec":
                return 12;
            default:
                return null;
        }
    }

    const exibirElementos = () => {
        document.querySelector("#tabela")?.classList.remove("visually-hidden");
        document.querySelector("#botaoGeraPDF")?.classList.remove("visually-hidden");
        document.querySelector("#botaoGeraExcel")?.classList.remove("visually-hidden");
    }

    const esconderElementos = () => {
        document.querySelector("#tabela")?.classList.add("visually-hidden");
        document.querySelector("#botaoGeraPDF")?.classList.add("visually-hidden");
        document.querySelector("#botaoGeraExcel")?.classList.add("visually-hidden");
    }

    const validaSePeriodoFoiInformado = () => {
        if ((dataInicialCompleta !== "" && dataFinalCompleta !== "") && (dataInicialCompleta !== null && dataFinalCompleta !== null)) {
            exibirElementos();
        } else {
            mensagem.mensagemAlerta("Favor informe período completo");
            esconderElementos();
            return "PeriodoIncompleto";
        }
    }

    const validaSeGravouOPeridoNaVariavelDeLancamentos = () => {
        if (lancamentoFiltrados.length == 0) {
            mensagem.mensagemAlerta("Não existem dados para o periodo informado");
            esconderElementos();
            return lancamentoFiltrados.length;
        }
    }

    const gerarPDF = () => {
        if (validaSePeriodoFoiInformado() == "PeriodoIncompleto") {
            return false;
        }
        if (validaSeGravouOPeridoNaVariavelDeLancamentos() == 0) {
            return false;
        }

        // Calcula saldo final
        const saldoFinal = lancamentoFiltrados.reduce((total, lanc) => {
            if (lanc.tipoLancamento === TipoLancamento.RECEITA) {
                return total + lanc.valor;
            } else if (lanc.tipoLancamento === TipoLancamento.DESPESA) {
                return total - lanc.valor;
            }
            return total;
        }, 0);

        var doc = new jsPDF({
            orientation: 'landscape',
            format: 'letter'
        })

        autoTable(doc, {
            html: "#tabela",
            didDrawPage: (data) => {
                // Título centralizado no topo
                doc.setFontSize(18);
                doc.setFont("helvetica", "bold");
                doc.text(
                    "Relatório de Finanças",
                    doc.internal.pageSize.getWidth() / 2,
                    20,
                    { align: "center" }
                );

                // Saldo final calculado dinamicamente
                doc.setFontSize(12);
                doc.setFont("helvetica", "normal");
                doc.text(
                    `Saldo final: ${saldoFinal.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL"
                    })}`,
                    data.settings.margin.left,
                    30
                );
            },
            margin: { top: 40 }
        });

        doc.save("Relatorio-lancamentos-mensal.pdf");

    }

    const gerarExcel = () => {
        if (validaSePeriodoFoiInformado() == "PeriodoIncompleto") {
            return false;
        }
        if (validaSeGravouOPeridoNaVariavelDeLancamentos() == 0) {
            return false;
        }

        mensagem.mensagemAlerta("Em desevolvimento ...");
    }

    const consultaLancamentos = () => {

        if (validaSePeriodoFoiInformado() == "PeriodoIncompleto") {
            return false;
        }

        const dataInicialCompletaEmString = converterObjetoEmString(dataInicialCompleta);
        const objDataInicial = converterStringEmObjetoFormatado(dataInicialCompletaEmString);

        const dataFinalCompletaEmString = converterObjetoEmString(dataFinalCompleta);
        const objDataFinal = converterStringEmObjetoFormatado(dataFinalCompletaEmString);

        const mesIni = retornarNumeroDoMes(objDataInicial[1]);
        const anoIni = objDataInicial[3];
        const mesFim = retornarNumeroDoMes(objDataFinal[1]);
        const anoFim = objDataFinal[3];

        service.consultaLancamentosPorPeriodo(mesIni, mesFim, anoIni, anoFim, dadosDeUsuario.id)
            .then(response => {
                if (response.data.length === 0) {
                    mensagem.mensagemAlerta("Não existem dados para o período informado");
                    esconderElementos();
                } else {
                    setLancamentosFiltrados(response.data);
                    exibirElementos();
                }
            });
    }

    return (
        <Card title="Exportar relatório de lançamentos">
            <div className='row'>
                <div className='col-md-8'>
                    <label>Data inicial &nbsp;</label>
                    <Calendar value={dataInicialCompleta} onChange={(e) => setdataInicialCompleta(e.target.value)} view="month" dateFormat="mm/yy" showButtonBar showIcon />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <label>Data Final &nbsp;</label>
                    <Calendar value={dataFinalCompleta} onChange={(e) => setdataFinalCompleta(e.target.value)} view="month" dateFormat="mm/yy" showButtonBar showIcon />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                </div>
                <div className='col-md-4 d-flex justify-content-end'>
                    <button id="botaoGeraPDF"
                        className="btn btn-danger visually-hidden"
                        onClick={gerarPDF}>
                        <i className="pi pi-file-pdf" title='Gerar PDF'></i>
                    </button>
                    <button id="botaoGeraExcel"
                        className="btn btn-success visually-hidden"
                        onClick={gerarExcel}>
                        <i className="pi pi-file-excel" title='Gerar Excel'></i>
                    </button>
                </div>
            </div>
            <div className='row mt-4'>
                <div className='col-md-4'>
                    <button className='btn btn-info' onClick={consultaLancamentos}>Consultar</button>
                </div>
            </div>
            <div className='pt-4'>
                <table id='tabela' className="table table-hover visually-hidden">
                    <thead>
                        <tr>
                            <th scope="col">Descrição</th>
                            <th scope="col">Valor</th>
                            <th scope="col">Mês</th>
                            <th scope="col">Ano</th>
                            <th scope="col">Tipo</th>
                            <th scope="col">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            lancamentoFiltrados.map(response => {
                                return (
                                    <tr key={response.id}>
                                        <td>{response.descricao}</td>
                                        <td>{response.valor.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</td>
                                        <td>{service.retornaNomeMes(response.mes)}</td>
                                        <td>{response.ano}</td>
                                        <td>{TipoLancamentoMap[response.tipoLancamento]}</td>
                                        <td>{StatusLancamentoMap[response.statusLancamento]}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
            <div></div>
        </Card>
    )
}