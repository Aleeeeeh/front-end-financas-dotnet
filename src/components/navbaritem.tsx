import React from 'react'

type props ={
    href: string;
    label: string;
    render: JSX.Element;
    onClick?: ()=>void; //Indica que o parâmetro é opcional
}

export default function NavBarItem({render, href, label, onClick}: props){

    if(render)
    {
        return(
            <li className="nav-item">
                <a onClick={onClick} className="nav-link" href={href}>{label}</a>
            </li>
        )
    }
    else
    {
        return (
            <li></li>
        )
    }
    

}