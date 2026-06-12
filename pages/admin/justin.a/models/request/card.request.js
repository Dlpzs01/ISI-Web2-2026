export default class CardRequest {
    constructor(
        title,
        description,
        order,
        boardColumnId,
        boardId,
        ownerId
    ) {
        this.title = title;
        this.description = description;
        this.order = order;
        this.boardColumnId = boardColumnId;
        this.boardId = boardId;
        this.ownerId = ownerId;
    }

    toJson() {
        return {
            title: this.title,
            description: this.description,
            order: this.order,
            boardColumnId: this.boardColumnId,
            boardId: this.boardId,
            ownerId: this.ownerId
        };
    }
}