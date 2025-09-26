import React, { useState, useEffect } from 'react'
import Card from '../components/Card'
import FormGroup from '../components/Form-Group'
import SelectMenu from '../components/SelectMenu'
import * as mensagem from '../components/toastr'

import { useHistory, useParams } from 'react-router-dom'
import LancamentoService from '../app/service/lancamentoService'
import localStorageService from '../app/service/localStorageService'

export default function CadastroLancamento(){

    const [id, setId] = useState(null);
    const [descricao, setDescricao] = useState('');
    const [valor, setValor] = useState('');
    const [mes, setMes] = useState('');
    const [ano, setAno] = useState('');
    const [tipo, setTipo] = useState('');
    const [status, setStatus] = useState('');
    const [atualizacao, setAtualizacao] = useState(false);
    
    const service = new LancamentoService();

    // Pega id do parâmetro da URL, colocar nome da variável como sendo a mesma que passamos em rotas.tsx
    const { idLancamento }:{idLancamento:any} = useParams();
    
    useEffect(() => {
        if(idLancamento){
            service.obterPorId(idLancamento)
            .then( response => {
                const objLancamento = response.data;
                
                setId(idLancamento)
                setDescricao(objLancamento.descricao);
                setAno(objLancamento.ano);
                setMes(objLancamento.mes);
                setValor(objLancamento.valor);
                setTipo(objLancamento.tipo);
                setStatus(objLancamento.status);
                setAtualizacao(true)
            })
            .catch(error =>{
                mensagem.mensagemErro(error.response.data);
            }) 
        }
    },[]) //Esse array vazio faz com que o useEffect seja executado apenas uma vez

    const tipos = service.obterListaTipos();
    const meses = service.obterListaMeses();
    const history = useHistory();

    const cadastraLancamento = () =>{
        const usuarioLogado = localStorageService.obterItem("_usuario_logado")
        const objLancamento = {
            descricao: descricao,
            valor: valor,
            mes: mes,
            ano: ano,
            tipo: tipo,
            usuario: usuarioLogado.id
        }

        try{
            service.validacao(objLancamento)
        }catch(error: any){
            const mensagens = error.mensagens; //Mensagens vem da nossa função de excessão
            mensagens.forEach((msg: string) => mensagem.mensagemErro(msg));
            return false;
        }

        service.salvar(objLancamento)
                .then(response =>{
                    mensagem.mensagemSucesso("Lançamento cadastrado com sucesso.");
                    setTimeout(() => {
                        history.push("/consulta-lancamentos");
                    }, 2000)     
                }).catch(error =>{
                    mensagem.mensagemErro(error.response.data);
                })
    }

    const atualizarLancamento = () =>{
        const usuarioLogado = localStorageService.obterItem("_usuario_logado")

        const objLancamento = {
            id: id,
            descricao: descricao,
            valor: valor,
            mes: mes,
            ano: ano,
            tipo: tipo,
            status: status,
            usuario: usuarioLogado.id
        }

        service.atualizar(objLancamento)
                .then(response =>{
                    mensagem.mensagemSucesso("Lançamento atualizado com sucesso.");
                    setTimeout(() => {
                        history.push("/consulta-lancamentos");
                    }, 2000)     
                }).catch(error =>{
                    mensagem.mensagemErro(error.response.data);
                })
    }

    return(
        <Card title={atualizacao ? 'Atualização de lançamento' : 'Cadastro de lançamento'}>
            <div className="row">
                <div className="col-md-12">
                    <FormGroup htmlFor="inputDescricao" label="Descrição: *">
                        <input type="text" 
                                id="inputDescricao" 
                                className="form-control"
                                name="descricao"
                                value={descricao}
                                onChange={(e:any) => setDescricao(e.target.value)} />
                    </FormGroup>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <FormGroup htmlFor="inputAno" label="Ano: *">
                        <input type="text" 
                                id="inputAno" 
                                className="form-control"
                                name="ano"
                                value={ano}
                                onChange={(e:any) => setAno(e.target.value)} />
                    </FormGroup>
                </div>
                <div className="col-md-6">
                    <FormGroup htmlFor="inputMes" label="Mês: *">
                    <SelectMenu id="inputMes" 
                                lista={meses} 
                                className="form-control"
                                name="mes"
                                value={mes}
                                onChange={(e:any) => setMes(e.target.value)} />
                    </FormGroup>
                </div>
            </div>
            <div className="row">
                <div className="col-md-4">
                    <FormGroup htmlFor="inputValor" label="Valor: *">
                        <input type="text" 
                                id="inputValor" 
                                className="form-control"
                                name="valor"
                                value={valor}
                                onChange={(e:any) => setValor(e.target.value)} />
                    </FormGroup>
                </div>
                <div className="col-md-4">
                    <FormGroup htmlFor="inputTipo" label="Tipo: *">
                        <SelectMenu id="inputTipo" 
                                    lista={tipos} 
                                    className="form-control"
                                    name="tipo"
                                    value={tipo}
                                    onChange={(e:any) => setTipo(e.target.value)} />
                    </FormGroup>
                </div>
                <div className="col-md-4">
                    <FormGroup htmlFor="inputStatus" label="Status: *">
                        <input type="text" 
                                className="form-control" 
                                name="status"
                                value={status}
                                disabled />
                    </FormGroup>
                </div>
            </div>
            <div className="row">
                <div className="col-md-4">
                    {/* Renderização condicional */}
                    {
                        atualizacao ? 
                        (
                            <button onClick={atualizarLancamento} 
                                    className="btn btn-success">
                                    <i className="pi pi-refresh"></i> Atualizar
                            </button>
                        ):(
                            <button onClick={cadastraLancamento} 
                                    className="btn btn-success">
                                    <i className="pi pi-save"></i> Cadastrar
                            </button>
                        )
                    }               
                    <button onClick={e => history.push('/consulta-lancamentos')} 
                            className="btn btn-danger">
                            Cancelar
                    </button>
                </div>
            </div>
        </Card> 
    )

}