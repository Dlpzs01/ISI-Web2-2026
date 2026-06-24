export default class Team_LabelRequest {

    constructor(name, color) {
        this.name = name;
        this.color = color;
        
    }

    //Metodo para convertir a JSON plano (para enviar)
    toJson() {
        return {
            name: this.name,
            color: this.color

        };

    }

}