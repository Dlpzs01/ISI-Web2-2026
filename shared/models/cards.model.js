export default class Card {
    constructor(id, title, description, teamId) {
        this.id = id;
        this.title = title;
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