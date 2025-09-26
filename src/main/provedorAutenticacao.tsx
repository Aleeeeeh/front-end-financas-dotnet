import React, { createContext, useEffect, useState } from 'react'
import AuthService from '../app/service/authService';
//import jwt from 'jsonwebtoken';
import jwt_decode from "jwt-decode";
import ApiService from '../app/apiservice';

export const AuthContext = createContext(null);
export const AuthConsumer = AuthContext.Consumer;
const AuthProvider = AuthContext.Provider;

type props = {
    children: any;
}

export default function ProvedorAutenticacao({ children }: props) {

    const [usuarioAutenticado, setUsuarioAutenticado] = useState({});
    const [isAutenticado, setIsAutenticado] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Loga no sistema e seta estado de login true e passa as credenciais do usuário que está logado
    const iniciarSessao = (autenticacao: any) => {
        const token = autenticacao.token;
        const claims = jwt_decode(token);

        const usuario = {
            //@ts-ignore
            id: autenticacao.usuarioId,
            //@ts-ignore
            nome: autenticacao.nomeAcesso
        }
        console.log(claims);
        AuthService.logar(usuario, token);
        setIsAutenticado(true);
        setUsuarioAutenticado(usuario);
    }

    // Encerra sessão setando como false na autenticação e nulo na variável de estado do usuário
    const encerrarSessao = () => {
        AuthService.removerUsuarioAutenticado();
        setIsAutenticado(false);
        setUsuarioAutenticado({});
    }

    const contexto = {
        usuarioAutenticado: usuarioAutenticado,
        isAutenticado: isAutenticado,
        iniciarSessao: iniciarSessao,
        encerrarSessao: encerrarSessao
    }

    useEffect(() => {
        const isUsuarioAutenticado = AuthService.isUsuarioAutenticado();

        if (isUsuarioAutenticado) {
            const usuario = AuthService.refreshSession();
            setIsAutenticado(true);
            setUsuarioAutenticado(usuario);
        }
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return null;
    }

    return (
        //@ts-ignore
        <AuthProvider value={contexto}>
            {children}
        </AuthProvider>
    )

}
