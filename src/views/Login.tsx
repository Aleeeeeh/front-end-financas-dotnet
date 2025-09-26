import { useContext, useState } from 'react'
import Card from '../components/Card'
import FormGroup from '../components/Form-Group'
import { useHistory } from 'react-router-dom'
import UsuarioService from '../app/service/usuarioService'
import { AuthContext } from '../main/provedorAutenticacao'
import { mensagemErro } from '../components/toastr'

export default function Login() {

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const history = useHistory();

    const service = new UsuarioService();
    const { iniciarSessao }: any = useContext(AuthContext);

    const entrar = () => {
        service.autenticar({
            email: email,
            senha: senha
        })
            .then(response => {
                iniciarSessao(response.data);

                history.push("/home");
            }).catch(erro => {
                mensagemErro(erro.response.data.mensagem)
            })
    }

    const redirecionaCadastro = () => {
        history.push("/cadastro-usuarios");
    }

    return (
        <div className="row">
            <div className="col-md-6 offset-md-3">
                <div className="bs-docs-section">
                    <Card title="Login">
                        {/* Para receber o HTML dentro do children, o mesmo em TSX deve ser do tipo ReactElement,
                        ReactNode ou jsxElement. Isso também vale para o componente FormGroup que recebe inputs */}
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="bs-component">
                                    <fieldset>
                                        <FormGroup label="Email: *" htmlFor="exampleInputEmail1">
                                            <input type="email"
                                                value={email}
                                                onChange={(e) => { setEmail(e.target.value) }}
                                                className="form-control"
                                                id="exampleInputEmail1"
                                                aria-describedby="emailHelp"
                                                placeholder="Digite o Email" />
                                        </FormGroup>
                                        <FormGroup label="Senha: *" htmlFor="exampleInputPassword1">
                                            <input type="password"
                                                value={senha}
                                                onChange={(e) => { setSenha(e.target.value) }}
                                                className="form-control"
                                                id="exampleInputPassword1"
                                                placeholder="Password" />
                                        </FormGroup>
                                        <button onClick={entrar}
                                            className="btn btn-success">
                                            <i className="pi pi-sign-in"></i> Entrar
                                        </button>
                                        <button onClick={redirecionaCadastro}
                                            className="btn btn-danger">
                                            <i className="pi pi-plus"></i> Cadastrar
                                        </button>
                                    </fieldset>
                                </div>
                            </div>
                        </div>
                        <div></div>
                    </Card>
                </div>
            </div>
        </div>
    )

}