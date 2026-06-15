import HttpService from '../../../shared/services/http.service.js';
import CardsResponse from './CardsResponse.js';

export default class CardsService extends HttpService {

    endpoint = '/cards';

    async getById(id) {

        if (!id)
            throw new Error('El ID de la card es obligatorio.');

        const json = await super.get(
            `${this.endpoint}/${id}`
        );

        return CardsResponse.fromJson(json);
    }

    async getLabels(id) {

        if (!id)
            throw new Error('El ID de la card es obligatorio.');

        return await super.get(
            `${this.endpoint}/${id}/labels`
        );
    }

    async addLabels(id, request) {

        if (!id)
            throw new Error('El ID de la card es obligatorio.');

        return await super.post(
            `${this.endpoint}/${id}/labels`,
            request.toJson()
        );
    }

    async removeLabel(id, labelId) {

        if (!id)
            throw new Error('El ID de la card es obligatorio.');

        if (!labelId)
            throw new Error('El ID de la etiqueta es obligatorio.');

        return await super.delete(
            `${this.endpoint}/${id}/labels/${labelId}`
        );
    }

}