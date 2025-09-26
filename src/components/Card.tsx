import React,{ReactElement} from 'react'

type props = {
    title: string;
    children: any;
}

export default function Card({title, children} : props){

    return(
        <div className="card md-3">
            <h3 className="card-header">{title}</h3>
            <div className="card-body">{children}</div>
        </div>
    )

}

