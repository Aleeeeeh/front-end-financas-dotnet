import ApiService from "../apiservice";
import ErroValidacao from "../service/exception/erroValidacao"

type objetoLogin = {
    email: string;
    senha: string;
}

type objetoCadUsuario = {
    nomeAcesso: string,
    email: string,
    senha: string,
}

class UsuarioService extends ApiService {

    constructor() {
        super('/usuario')
    }

    autenticar(credenciais: objetoLogin) {
        return this.post(`/autentica?email=${credenciais.email}&senha=${credenciais.senha}`, {});
    }

    salvar(usuario: objetoCadUsuario) {
        return this.post('', usuario)
    }

    validar(usuario: any) {
        const erros = [];

        if (!usuario.nomeAcesso) {
            erros.push("O campo nome é obrigatório.");
        }

        if (!usuario.email) {
            erros.push("O campo e-mail é obrigatório.");
        } else if (!usuario.email.match(/^[a-z0-9.]+@[a-z0-9]+\.[a-z]/)) {
            erros.push("Informe um e-mail válido.");
        }

        if (!usuario.senha) {
            erros.push("Digite a senha.");
        } else if (usuario.senha !== usuario.senhaRepeticao) {
            erros.push("As senhas não conferem.");
        }

        if (erros && erros.length > 0) {
            //@ts-ignore
            throw new ErroValidacao(erros);
        }
    }

    consultaUsuarios() {
        return this.get("")
    }

    gravaDataEHoraUltimoLogout(id: number) {
        return this.put(`/${id}/ultimoLogout`, "");
    }

}

export default UsuarioService