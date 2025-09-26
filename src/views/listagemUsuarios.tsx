import React, { useEffect, useState } from 'react'
import Card from '../components/Card'
import UsuarioService from '../app/service/usuarioService';
import {objetoUsuario} from '../components/typesUsuario'

export default function telaUsuarios(){

    const [usuario, setUsuario] = useState<objetoUsuario[]>([]);

    const service = new UsuarioService;

     useEffect(() => {
        service.consultaUsuarios()
        .then(response=>{
            setUsuario(response.data);
        })
        
    },[]);
    
    return(
        <Card title="Listagem de usuários">
            <div className='row'>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Nome</th>
                            <th scope="col">Email</th>
                            <th scope="col">Visto por último</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            usuario.map(info => {
                                var vistoPorUltimo = "";
                                if(info.ultimoLogin == null){
                                    vistoPorUltimo = "Ainda não foi feito logout nesse conta";
                                }else{
                                    var arrayVistoPorUltimo = info.ultimoLogin.split(" ");
                                    
                                    var data = arrayVistoPorUltimo[0];
                                    var hora = arrayVistoPorUltimo[1];
                                    vistoPorUltimo = `${data} - ${hora}`
                                }

                                return(
                                    <tr key={info.id}>
                                        <td>{info.nome}</td>
                                        <td>{info.email}</td>
                                        <td>{vistoPorUltimo}</td>
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