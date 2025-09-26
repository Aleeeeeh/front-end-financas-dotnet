import React, { useEffect, useState } from 'react'
import Card from '../components/Card';
import {objetoRelatorio} from '../components/typesRelatorio'
import { Calendar } from 'primereact/calendar';
import * as mensagem from '../components/toastr'
import localStorageService from '../app/service/localStorageService';
import LancamentoService from '../app/service/lancamentoService';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'

export default function relatorioLancamentos(){

    const [lancamentos, setLancamentos] = useState<objetoRelatorio[]>([]);
    const [dataInicialCompleta, setdataInicialCompleta] = useState<any>('');
    const [dataFinalCompleta, setdataFinalCompleta] = useState<any>('');
    const [mesInicial, setMesInicial] = useState<any>('');
    const [anoInicial, setAnoInicial] = useState<any>('');
    const [mesFinal, setMesFinal] = useState<any>('');
    const [anoFinal, setAnoFinal] = useState<any>('');
    const [lancamentoFiltrados, setLancamentosFiltrados] = useState<objetoRelatorio[]>([]);

    const service = new LancamentoService();

    const dadosDeUsuario = localStorageService.obterItem("_usuario_logado");

    const converterObjetoEmString = (objeto: object) =>{
        var objetoConvertidoEmString = objeto.toString();

        return objetoConvertidoEmString;
    }

    const converterStringEmObjetoFormatado = (dataEmString: string) =>{
        var objetoFormatado = dataEmString.split(" ");

        return objetoFormatado;
    }

    const retornarNumeroDoMes = (nomeMes:string) =>{
        switch(nomeMes){
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

    const exibirElementos = () =>{
        document.querySelector("#tabela")?.classList.remove("visually-hidden");
        document.querySelector("#botaoGeraPDF")?.classList.remove("visually-hidden");
        document.querySelector("#botaoGeraExcel")?.classList.remove("visually-hidden");
    }

    const esconderElementos = () =>{
        document.querySelector("#tabela")?.classList.add("visually-hidden");
        document.querySelector("#botaoGeraPDF")?.classList.add("visually-hidden");
        document.querySelector("#botaoGeraExcel")?.classList.add("visually-hidden");
    }

    const validaSePeriodoFoiInformado = () =>{
        if((dataInicialCompleta !== "" && dataFinalCompleta !== "")&&(dataInicialCompleta !== null && dataFinalCompleta !== null)){
            exibirElementos();
        }else{
            mensagem.mensagemAlerta("Favor informe período completo");
            esconderElementos();
            return "PeriodoIncompleto";
        }
    }

    const validaSeGravouOPeridoNaVariavelDeLancamentos = () =>{
        if(lancamentoFiltrados.length == 0){
            mensagem.mensagemAlerta("Não existem dados para o periodo informado");
            esconderElementos();
            return lancamentoFiltrados.length;
        }
    }

    const gravaPeridoDeDatas = () =>{
        var dataInicialCompletaEmString = converterObjetoEmString(dataInicialCompleta);
        var objetodataInicialCompletaFormatadoEmPosicoes = converterStringEmObjetoFormatado(dataInicialCompletaEmString);
        var dataFinalCompletaEmString = converterObjetoEmString(dataFinalCompleta);
        var objetodataFinalCompletaFormatadoEmPosicoes = converterStringEmObjetoFormatado(dataFinalCompletaEmString);
        setMesFinal(retornarNumeroDoMes(objetodataFinalCompletaFormatadoEmPosicoes[1]));
        setAnoFinal(objetodataFinalCompletaFormatadoEmPosicoes[3]);
        setMesInicial(retornarNumeroDoMes(objetodataInicialCompletaFormatadoEmPosicoes[1]));
        setAnoInicial(objetodataInicialCompletaFormatadoEmPosicoes[3]);
        validaSeGravouOPeridoNaVariavelDeLancamentos();
    }

    const gerarPDF = () =>{
        if(validaSePeriodoFoiInformado() == "PeriodoIncompleto"){
            return false;
        }
        if(validaSeGravouOPeridoNaVariavelDeLancamentos() == 0){
            return false;
        }

        var doc = new jsPDF({
            orientation: 'landscape',
            format: 'letter'
        })
        autoTable(doc,{html: "#tabela"});
        doc.save("Relatorio-lancamentos-mensal.pdf");
        
    }

    const gerarExcel = () =>{
        if(validaSePeriodoFoiInformado() == "PeriodoIncompleto"){
            return false;
        }
        if(validaSeGravouOPeridoNaVariavelDeLancamentos() == 0){
            return false;
        }

        mensagem.mensagemAlerta("Em desevolvimento ...");
    }

    const consultaLancamentos = () =>{
        if(validaSePeriodoFoiInformado() == "PeriodoIncompleto"){
            return false;
        }
        gravaPeridoDeDatas();
        
        service.consultaLancamentosPorPeriodo(mesInicial,mesFinal,anoFinal,anoFinal,dadosDeUsuario.id)
        .then(Response =>{
            setLancamentosFiltrados(Response.data);
        })
    }
    
    console.log(lancamentoFiltrados);

    return(
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
                            <th scope="col">Tipo</th>
                            <th scope="col">Valor</th>
                            <th scope="col">Mês</th>
                            <th scope="col">Ano</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            lancamentoFiltrados.map(response =>{
                                return(
                                    <tr>
                                        <td>{response.descricao}</td>
                                        <td>{response.tipo}</td>
                                        <td>{response.valor.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</td>
                                        <td>{service.retornaNomeMes(parseInt(response.mes))}</td>
                                        <td>{response.ano}</td>
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