export default class CardsResponse {

    constructor(
        id,
        title,
        description,
        order,
        boardColumnId,
        teamId,
        boardId,
        ownerId,
        ownerName,
        eTag,
        createdAt,
        updatedAt,
        createdBy,
        updatedBy,
        labels
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.order = order;
        this.boardColumnId = boardColumnId;
        this.teamId = teamId;
        this.boardId = boardId;
        this.ownerId = ownerId;
        this.ownerName = ownerName;
        this.eTag = eTag;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
        this.labels = labels;
    }

    static fromJson(json) {

        if (!json) return null;

        return new CardsResponse(
            json.id,
            json.title,
            json.description,
            json.order,
            json.boardColumnId,
            json.teamId,
            json.boardId,
            json.ownerId,
            json.ownerName,
            json.eTag,
            json.createdAt,
            json.updatedAt,
            json.createdBy,
            json.updatedBy,
            json.labels
        );

    }

}