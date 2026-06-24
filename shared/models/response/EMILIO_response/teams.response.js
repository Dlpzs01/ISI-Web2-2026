export class TeamResponse {
    constructor(id, name, description, memberCount) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.memberCount = memberCount;
        
    }

    static fromJson(json) {
        if(!json) return null;

        return new TeamResponse(
            json.id,
            json.name,
            json.description,
            json.memberCount

        )

    }
    
}