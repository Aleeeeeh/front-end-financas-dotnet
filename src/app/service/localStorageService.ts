export default class localStorageService{
    //Por se tratar de método estático não precisamos instanciar depois, a chamada é direta
    static adicionarItem(chave: string, valor: string){
        localStorage.setItem(chave, JSON.stringify(valor));
    }

    static obterItem(chave: string){
        const item = localStorage.getItem(chave);

        if(typeof(item) == "string"){
            return JSON.parse(item);
        }
    }

    static removerItem(chave:string){
        localStorage.removeItem(chave);
    }

}