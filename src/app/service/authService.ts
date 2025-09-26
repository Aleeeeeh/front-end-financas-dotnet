import localStorageService from "./localStorageService";
import jwt_decode from "jwt-decode";
import ApiService from "../apiservice";

// Constante a ser usada no sistema TODO, pois se caso precise alterar a chave já reflita pra todos.
export const USUARIO_LOGADO = "_usuario_logado"
export const TOKEN = "access_token"

export default class AuthService{

    static isUsuarioAutenticado(){
        const token = localStorageService.obterItem(TOKEN);
        if(!token){
            return false;
        }
        const decodedToken = jwt_decode(token);
        //@ts-ignore
        const expiration = decodedToken.exp;
        const isTokenInvalido = Date.now() >= (expiration * 1000)

        return !isTokenInvalido
    }

    static removerUsuarioAutenticado(){
        localStorageService.removerItem(USUARIO_LOGADO);
        localStorageService.removerItem(TOKEN);
    }

    static logar(usuario:any,token:any){
        localStorageService.adicionarItem(USUARIO_LOGADO, usuario);
        localStorageService.adicionarItem(TOKEN, token);
        ApiService.registrarToken(token);
    }

    static obterUsuarioAutenticado(){
        return localStorageService.obterItem(USUARIO_LOGADO);
    }
    //Para quando o usuário der f5 na página mantenha logado
    static refreshSession(){
        const token = localStorageService.obterItem(TOKEN);
        const usuario = AuthService.obterUsuarioAutenticado();
        AuthService.logar(usuario,token);

        return usuario;
    }

}