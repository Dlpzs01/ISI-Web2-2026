export default class LabelRequest {
    name = '';
    color = '';
    
    constructor(name, color){
        this.name = name;
        this.color = color;
    }
    toJson(){
        return {
            name: this.name,
            color: this.color
        };
    }
}