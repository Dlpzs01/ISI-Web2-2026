import HttpService from "../../../../../shared/services/http.service.js";
import CardRequest from "../request/card.request.js";

export default class CardsService extends HttpService {

    endpoint = "/Teams";

    async get(teamId) {
        return await super.get(
            `${this.endpoint}/${teamId}/cards`
        );
    }

    async create(teamId, cardRequest) {

        if (!(cardRequest instanceof CardRequest)) {
            throw new Error("Invalid Card Request");
        }

        return await super.post(
            `${this.endpoint}/${teamId}/cards`,
            cardRequest.toJson()
        );
    }

    async update(teamId, cardId, cardRequest) {

        return await super.patch(
            `${this.endpoint}/${teamId}/cards/${cardId}`,
            cardRequest.toJson()
        );
    }

    async delete(teamId, cardId) {

        return await super.delete(
            `${this.endpoint}/${teamId}/cards/${cardId}`
        );
    }
}