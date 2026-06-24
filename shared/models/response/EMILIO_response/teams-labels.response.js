export class Team_LabelResponse {
    constructor(id, name, normalizedName, color, createdAt, updatedAt) {
        this.id = id;
        this.name = name;
        this.normalizedName = normalizedName;
        this.color = color;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        
    }

    static fromJson(json) {
        if(!json) return null;

        return new Team_LabelResponse(
            json.id,
            json.name,
            json.normalizedName,
            json.color,
            json.createdAt,
            json.updatedAt

        )

    }
    
}