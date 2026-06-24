export default class TeamRequest {

    constructor(name, description) {
        this.name = name;
        this.description = description;

    }

    //Metodo para convertir a JSON plano (para enviar)
    toJson() {
        return {
            name: this.name,
            description: this.description

        };
        
    }

}