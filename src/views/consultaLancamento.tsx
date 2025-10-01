import React, { useEffect, useState } from 'react'
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

import Card from '../components/Card'
import FormGroup from '../components/Form-Group'
import SelectMenu from '../components/SelectMenu'
import LancamentosTable from '../components/LancamentosTable'
import LancamentoService from '../app/service/lancamentoService'
import localStorageService from '../app/service/localStorageService'
import * as mensagem from '../components/toastr'
import { objetoLancamento } from '../components/typesLancamentos'
import { useHistory } from 'react-router-dom';

export default function ConsultaLancamento() {

    const [ano, setAno] = useState('');
    const [mes, setMes] = useState('');
    const [tipo, setTipo] = useState('');
    const [status, setStatus] = useState('');
    const [descricao, setDescricao] = useState('');
    const [lancamentos, setLancamentos] = useState([]);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [lancamentoDeletar, setLancamentoDeletar] = useState([] as any)

    const history = useHistory();

    const service = new LancamentoService();

    const buscar = (exibeMensagem: number) => {
        if (!ano) {
            mensagem.mensagemErro("O preenchimento do campo ano é obrigatório.");
            return false;
        }

        const idUsuarioSessao = localStorageService.obterItem('_usuario_logado');

        const lancamentoFiltro = {
            ano: ano,
            mes: mes,
            tipo: tipo,
            status: status,
            descricao: descricao,
            usuario: idUsuarioSessao.id
        }

        service.consultar(lancamentoFiltro)
            .then(response => {
                if ((response.data == "") && (exibeMensagem == 0)) {
                    mensagem.mensagemAlerta("Nenhum registro encontrado.");
                    return false;
                }

                setLancamentos(response.data);

                if (exibeMensagem == 0) {
                    mensagem.mensagemSucesso("Consulta realizada com sucesso !");
                }
            })
            .catch(error => {
                mensagem.mensagemErro(error.response.data);
            })
    }

    const editar = (idLancamento: objetoLancamento) => {
        history.push(`/cadastro-lancamentos/${idLancamento}`);
    }

    const deletar = () => {
        service.deletar(lancamentoDeletar.id)
            .then(response => {
                buscar(1);
                setShowConfirmDialog(false);
                mensagem.mensagemSucesso("Lançamento deletado com sucesso !");
            }).catch(error => {
                mensagem.mensagemErro("Ocorreu um erro ao tentar deletar o lançamento.");
            })
    }

    const abrirConfirmacao = (Lancamento: objetoLancamento) => {
        setShowConfirmDialog(true);
        setLancamentoDeletar(Lancamento);
    }

    const cancelaDelecao = () => {
        setShowConfirmDialog(false);
        setLancamentoDeletar([]);
    }

    const confirmaDialogFooter = (
        <div>
            <Button label="Confirmar" icon="pi pi-check" onClick={deletar} />
            <Button label="Cancelar" icon="pi pi-times" onClick={cancelaDelecao} />
        </div>
    )

    const cadastrar = () => {
        history.push('/cadastro-lancamentos')
    }

    const alterarStatus = (Lancamento: any, status: number) => {
        service.alterarStatus(Lancamento.id, status)
            .then(response => {
                buscar(1);
                mensagem.mensagemSucesso("Status atualizado com sucesso.");
            })
    }

    const meses = service.obterListaMeses();

    const tipos = service.obterListaTipos();

    return (
        <Card title="Lançamentos">
            <div className="row">
                <div className="col-lg-6">
                    <FormGroup label="Ano: *" htmlFor="InputAno">
                        <input type="text"
                            className="form-control"
                            id="InputAno"
                            value={ano}
                            onChange={(e: any) => setAno(e.target.value)}
                            placeholder="Digite o Ano" />
                    </FormGroup>
                    <FormGroup label="Mês: *" htmlFor="InputMes">
                        <SelectMenu id="inputMes"
                            value={mes}
                            onChange={(e: any) => setMes(e.target.value)}
                            className="form-control"
                            lista={meses} />
                    </FormGroup>
                </div>
                <div className="col-lg-6">
                    {/* Colocando só a primeira letra no filtro descrição ele já traz, isso foi criado no 
                            método de filtrar na API do Java */}
                    <FormGroup label="Descrição: " htmlFor="InputDesc">
                        <input type="text"
                            id="InputDesc"
                            value={descricao}
                            onChange={(e: any) => setDescricao(e.target.value)}
                            className="form-control"
                            placeholder="Digite a descrição" />
                    </FormGroup>
                    <FormGroup label="Tipo de Lançamento:" htmlFor="InputTipos">
                        <SelectMenu id="InputTipos"
                            value={tipo}
                            onChange={(e: any) => setTipo(e.target.value)}
                            className="form-control"
                            lista={tipos} />
                    </FormGroup>
                </div>
            </div>
            <fieldset>
                <button onClick={() => { buscar(0) }}
                    type="button"
                    className="btn btn-success">
                    <i className="pi pi-search"></i> Buscar
                </button>
                <button type="button"
                    onClick={cadastrar}
                    className="btn btn-danger">
                    <i className="pi pi-plus"></i> Cadastrar
                </button>
            </fieldset>
            <br />
            <div className="row">
                <div className="col-lg-12">
                    <div className="bs-component">
                        <LancamentosTable lancamentos={lancamentos}
                            editarLancamento={editar}
                            deletarLancamento={abrirConfirmacao}
                            alteraStatusLancamento={alterarStatus}
                        />
                    </div>
                </div>
            </div>
            <div>
                <Dialog header="Confirmação"
                    visible={showConfirmDialog} // Se o modal está visível ou não 
                    style={{ width: '50vw' }}
                    footer={confirmaDialogFooter} // Botões que aparecem na parte debaixo do modal
                    modal={true} // Modal visivel
                    onHide={() => setShowConfirmDialog(false)}> {/* Aqui muda o state para false e true do modal */}
                    <p>Deseja realmente deletar esse lançamento ?</p>
                </Dialog>
            </div>
        </Card>
    )

}