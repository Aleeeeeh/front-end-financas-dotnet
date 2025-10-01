import React, { useEffect, useState } from 'react'
import Card from '../components/Card'
import UsuarioService from '../app/service/usuarioService';
import { objetoUsuario } from '../components/typesUsuario'

export default function telaUsuarios() {

    const [usuario, setUsuario] = useState<objetoUsuario[]>([]);

    const service = new UsuarioService;

    useEffect(() => {
        service.consultaUsuarios()
            .then(response => {
                setUsuario(response.data);
            })

    }, []);

    return (
        <Card title="Listagem de usuários">
            <div className='row'>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Id</th>
                            <th scope="col">Nome</th>
                            <th scope="col">Email</th>
                            <th scope="col">Visto por último</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            usuario.map(info => {
                                let date = new Date(info.ultimoAcesso);

                                // Formatar data
                                const pad = (n: any) => n.toString().padStart(2, "0");

                                const dataHoraFormatado =
                                    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
                                    `às ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;

                                return (
                                    <tr key={info.id}>
                                        <td>{info.id}</td>
                                        <td>{info.nomeAcesso}</td>
                                        <td>{info.email}</td>
                                        <td>{dataHoraFormatado}</td>
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