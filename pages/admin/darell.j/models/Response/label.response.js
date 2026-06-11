export class LabelResponse {
    constructor(
        id,
        name,
        normalizedName,
        color,
        createdAt,
        updatedAt
    ){
        this.id = id;
        this.name = name;
        this.normalizedName = normalizedName;
        this.color = color;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    static fromJson(json){
        return new LabelResponse(
        json.id,
        json.name,
        json.normalizedName,
        json.color,
        json.createdAt,
        json.updatedAt
        );
    }
}