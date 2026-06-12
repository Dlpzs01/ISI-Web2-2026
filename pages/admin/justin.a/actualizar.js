import CardsService from "./models/services/cards.services.js";
import CardRequest from "./models/request/card.request.js";

const service = new CardsService();

export async function actualizarCard(
    teamId,
    cardId,
    title,
    description
) {

    const card = new CardRequest(
        title,
        description,
        1,
        1,
        1,
        1
    );

    return await service.update(
        teamId,
        cardId,
        card
    );
}