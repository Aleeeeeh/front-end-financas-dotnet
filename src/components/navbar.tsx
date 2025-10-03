import { useContext, useState } from 'react'
import NavBarItem from './navbaritem'
import { AuthContext } from '../main/provedorAutenticacao'
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import localStorage from '../app/service/localStorageService'
import UsuarioService from '../app/service/usuarioService';

export default function Navbar() {
    const { isAutenticado, encerrarSessao }: any = useContext(AuthContext);
    const [showConfirmDialog, setShowConfirmDialog] = useState(localStorage.obterItem("exibeModal"));
    const [diretorio, setDiretorio] = useState('');

    const usuarioService = new UsuarioService();

    var dadosUsuarioLogado = localStorage.obterItem("_usuario_logado")

    const abreModal = () => {
        localStorage.adicionarItem("exibeModal", JSON.stringify("true"));
    }

    const deslogar = () => {
        localStorage.removerItem("exibeModal")
        setShowConfirmDialog(false);
        encerrarSessao();
        usuarioService.gravaDataEHoraUltimoLogout(dadosUsuarioLogado.id);
    }

    const manterLogado = () => {
        setShowConfirmDialog(false);
        localStorage.removerItem("exibeModal");
    }

    const confirmaDialogFooter = (
        <div>
            <Button label="Confirmar" icon="pi pi-check" onClick={deslogar} />
            <Button label="Cancelar" icon="pi pi-times" onClick={manterLogado} />
        </div>
    )

    return (
        <div className="navbar navbar-expand-lg fixed-top navbar-dark bg-primary">
            <div className="container">
                <a href="/home" className="navbar-brand">Minhas Finanças</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarResponsive">
                    <ul className="navbar-nav">
                        <NavBarItem render={isAutenticado} href="/home" label="Home" />
                        <NavBarItem render={isAutenticado} href="/listagemUsuarios" label="Usuários" />
                        <NavBarItem render={isAutenticado} href="/consulta-lancamentos" label="Lançamentos" />
                        <NavBarItem render={isAutenticado} onClick={abreModal} href={diretorio} label="Sair" />
                    </ul>
                </div>
            </div>
            <div>
                <Dialog header="Confirmação"
                    visible={showConfirmDialog}
                    style={{ width: '50vw' }}
                    footer={confirmaDialogFooter}
                    modal={true}
                    onHide={() => setShowConfirmDialog(false)}>
                    <p>Deseja realmente sair do sistema ?</p>
                </Dialog>
            </div>
        </div>
    )

}
