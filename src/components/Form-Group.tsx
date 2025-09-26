import React,{ReactElement} from 'react'
import types from './types'

export default function FormGroup(props: types){

    return(
        <div className="form-group">
            <label htmlFor={props.htmlFor}>{props.label}</label>
            {props.children}
        </div>
    )

}