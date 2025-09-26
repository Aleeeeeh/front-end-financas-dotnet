import React, { useEffect, useState, useContext } from 'react'
import UsuarioService from '../app/service/usuarioService';
import localStorageService from '../app/service/localStorageService'
import { AuthContext } from '../main/provedorAutenticacao'
import { USUARIO_LOGADO } from '../app/service/authService';
import { mensagemAlerta } from '../components/toastr'

type usuarioLogado = string;

export default function Home(){

    const [saldo, setSaldo] = useState(0);
    //const usuarioLogado = localStorageService.obterItem('_usuario_logado');
    const { usuarioAutenticado }:any = useContext(AuthContext);

    //Carrega dados do servidor
    useEffect(() => {

        const service = new UsuarioService();
        
        service.obterSaldoPorUsuario(usuarioAutenticado.id)
        .then( response => {
            setSaldo( response.data );
        }).catch( error => {
            console.log( error.response );
        })

    });

    const alerta = () =>{
        mensagemAlerta("Em desenvolvimento ...");
    }

    return(
        <div className="jumbotron">
            <h1 className="display-3">Bem vindo {usuarioAutenticado.nome} </h1>
            <p className="lead">Esse é seu sistema de finanças.</p>
            <p className="lead">Seu saldo para o mês atual é de R$ {saldo}</p>
            <hr className="my-4" />
            <p>E essa é sua área administrativa, utilize um dos menus ou botões abaixo para navegar pelo sistema.</p>
            <p className="lead">
            <a className="btn btn-primary btn-lg" 
                href="relatorioLancamentos"
                role="button">
                <i className="pi pi-book"></i> Gerar relatório</a>
            <a className="btn btn-danger btn-lg" 
                href="cadastro-lancamentos" 
                role="button">
                <i className="pi pi-money-bill"></i> Cadastrar Lançamento</a>
            </p>
      </div>
    )

}