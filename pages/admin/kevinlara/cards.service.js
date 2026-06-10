import HttpService from "../../../shared/services/http.service.js";

export default class CardsService extends HttpService {

    async getAll(teamId) {
        return await super.get(`/Teams/${teamId}/cards`);
    }

    async getById(teamId, id) {
        return await super.get(`/Teams/${teamId}/cards/${id}`);
    }

    async create(teamId, cardData) {
        return await super.post(`/Teams/${teamId}/cards`, cardData);
    }

    async update(teamId, id, cardData, etag) {
        return await super.patch(`/Teams/${teamId}/cards/${id}`, cardData, {
    
        });
    }

    async delete(teamId, id) {
        const response = await fetch(`https://localhost:7286/api/Teams/${teamId}/cards/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('token')).token,
                'Content-Type': 'application/json'
            }
        });

        
        if (response.status === 204) {
            return null;
        }

        // Si hay un error distinto, lanzamos excepción
        if (!response.ok) {
            throw new Error('No se pudo eliminar el recurso');
        }

        return await response.json();
    }
}