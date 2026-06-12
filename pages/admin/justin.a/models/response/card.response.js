export class CardResponse {

    constructor(
        id,
        title,
        description,
        order,
        boardColumnId,
        teamId,
        boardId,
        ownerId,
        ownerName
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
    }

    static fromJson(json) {

        return new CardResponse(
            json.id,
            json.title,
            json.description,
            json.order,
            json.boardColumnId,
            json.teamId,
            json.boardId,
            json.ownerId,
            json.ownerName
        );
    }
}