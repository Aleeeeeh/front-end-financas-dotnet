import React from 'react'

export default (props: any) => {

    // Pega lista recebida e percorre com map. A key é usada para identificar cada linha.
    const options = props.lista.map( (option: any, index: any) =>{
        return(
            <option key={index} value={option.value}>{option.label}</option>
        )
    })

    return(
        <select {...props}>
            {options}
        </select>
    )

}