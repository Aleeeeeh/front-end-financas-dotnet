import React,{ReactElement} from 'react'

//Em projetos onde cada pasta é um componente, o ideal seria em cada pasta ter um arquivo de tipagem, como este.
type props = {
    label: string;
    children: ReactElement;
    htmlFor: string;
}

export default props