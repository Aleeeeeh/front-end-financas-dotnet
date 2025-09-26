import axios from 'axios'
import { BASE_URL } from '../utils/request';

const httpClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: true //Permite mandar credenciais pelo cabeçalho
})

class ApiService{
    apiUrl: string;
    
    constructor(apiUrl: string){
        this.apiUrl = apiUrl;
    }

    static registrarToken(token:string){
        if(token){
            httpClient.defaults.headers.common['Authorization'] = `Bearer ${token}` 
        }
    }

    post(url: string, objeto: object){
        const requestURL = `${this.apiUrl}${url}`
        return httpClient.post(requestURL, objeto);
    }

    put(url: string, objeto: string){
        const requestURL = `${this.apiUrl}${url}`
        return httpClient.put(requestURL, objeto);
    }

    delete(url: string){
        const requestURL = `${this.apiUrl}${url}`
        return httpClient.delete(requestURL);
    }

    get(url: string){
        const requestURL = `${this.apiUrl}${url}`
        return httpClient.get(requestURL);
    }

}

export default ApiService