import HttpService from "../../../shared/services/http.service.js";
import Card from "../../../shared/models/cards.model.js";

export default class CardsService extends HttpService {
  endpoint = "/teams";

  async getAll(teamId) {
    // Obtenemos los datos crudos de la API
    const data = await super.get(`${this.endpoint}/${teamId}/cards`);
    if (data === null) return [];
    if (!Array.isArray(data)) return [];
    // Aquí es donde se realiza el mapeo
    return data.map((item) => Card.fromJson(item));
  }

  async getById(teamId, id) {
    const data = await super.get(`${this.endpoint}/${teamId}/cards/${id}`);
    if (data === null) return null;
    return Card.fromJson(data);
  }

  async create(teamId, cardData) {
    const data = await super.post(`${this.endpoint}/${teamId}/cards`, cardData);
    return Card.fromJson(data);
  }

  async update(teamId, id, cardData) {
    const data = await super.put(
      `${this.endpoint}/${teamId}/cards/${id}`,
      cardData,
    );
    return Card.fromJson(data);
  }

  async delete(teamId, id) {
    try {
      return await super.delete(`${this.endpoint}/${teamId}/cards/${id}`);
    } catch (error) {
      return null;
    }
  }
}
