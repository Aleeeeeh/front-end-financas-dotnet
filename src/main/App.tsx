import React from 'react'
import Rotas from './rotas'
import Navbar from '../components/navbar'
import 'toastr/build/toastr.min.js'
import AuthService from '../app/service/authService'

import 'bootswatch/dist/flatly/bootstrap.css'
import '../custom.css'
import 'toastr/build/toastr.css'
import 'primereact/resources/themes/saga-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'

import ProvedorAutenticacao from './provedorAutenticacao'

export default function App(){

  return(
      <>
      <ProvedorAutenticacao>
        <Navbar />
        <Rotas />
      </ProvedorAutenticacao>
      </>
  )
  
}
