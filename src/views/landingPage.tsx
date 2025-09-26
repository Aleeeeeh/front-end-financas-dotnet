import React from "react";
import { useHistory } from "react-router-dom";
import '../css/styles.css'

export default function LandingPage(){

   const history = useHistory();

   const goToHome = () =>{
      history.push("/home");
   }

   return(
      <header className="masthead fixed-top">
            <div className="container px-4 px-lg-5 h-100">
                <div className="row gx-4 gx-lg-5 h-100 align-items-center justify-content-center text-center">
                    <div className="col-lg-8 align-self-end">
                        <h1 className="text-white font-weight-bold">Minhas finanças</h1>
                        <hr className="divider" />
                    </div>
                    <div className="col-lg-8 align-self-baseline">
                        <p className="text-white-75 mb-5">
                            Este é seu sistema para controle de finanças pessoais, 
                            clique no botão abaixo para acessar
                        </p>
                        <button className="btn-xl" 
                            title="Clique para acessar o sistema" 
                            onClick={goToHome}>
                            Acessar
                        </button>
                    </div>
                </div>
            </div>
        </header>
   )
    
}