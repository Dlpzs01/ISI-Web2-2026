import CardsService from "./models/services/cards.services.js";

const service = new CardsService();

export async function eliminarCard(
    teamId,
    cardId
) {

    return await service.delete(
        teamId,
        cardId
    );
}