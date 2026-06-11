export default class Card {
    constructor(id, name, description, teamId) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.teamId = teamId;
    }
//Metodo para mapear el JSON  
    static fromJson(json) {
        return new Card(
            json.id, 
            json.title, 
            json.description,
            json.teamId
        );
    }
}