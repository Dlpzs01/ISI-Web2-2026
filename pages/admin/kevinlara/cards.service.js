import HttpService from "../../../shared/services/http.service.js";
import Card from "../../../shared/models/cards.model.js"; 

export default class CardsService extends HttpService {

    async getAll(teamId) {
        //obtenemos los datos crudos de la Api
        const data = await super.get(`/Teams/${teamId}/cards`);
        // Aqui es donde se realiza el mapeo 
        return data.map(item => Card.fromJson(item));
    }

    async getById(teamId, id) {
        const data = await super.get(`/Teams/${teamId}/cards/${id}`);
        return Card.fromJson(data);
    }

    async create(teamId, cardData) {
        const data = await super.post(`/Teams/${teamId}/cards`, cardData);
        return Card.fromJson(data);
    }

    async update(teamId, id, cardData, etag) {
        const data = await super.put(`/Teams/${teamId}/cards/${id}`, cardData);
        return Card.fromJson(data);
    }

    async delete(teamId, id) {
        return await super.delete(`/Teams/${teamId}/cards/${id}`);
    }
}