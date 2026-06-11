import HttpService from './http.service.js';

export default class CardsService {

    constructor() {
        this.http = new HttpService();
        this.endpoint = '/teams';
    }

    async get(teamId) {

        try {

            return await this.http.get(
                `${this.endpoint}/${teamId}/cards`
            );

        } catch (error) {

            console.error(
                '[CardsService] Error obteniendo cards:',
                error
            );

            return [];
        }
    }
}