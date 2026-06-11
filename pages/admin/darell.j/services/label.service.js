import LabelRequest from "../models/Request/label.request.js";
import { LabelResponse } from "../models//Response/label.response.js";
import HttpService from "../../../../shared/services/http.service.js";

export default class LabelsService extends HttpService {

    endpoint = "/teams";


    async get(teamId) {

     const json = await super.get(
     `${this.endpoint}/${teamId}/labels`
     );

        if (!Array.isArray(json))
            return [];

        return json.map(
            item => LabelResponse.fromJson(item)
        );
    }


    async create(teamId, labelRequest) {

        if (!(labelRequest instanceof LabelRequest))
            throw new Error("Invalid Label Request");

        const json = await super.post(
            `${this.endpoint}/${teamId}/labels`,
            labelRequest.toJson()
        );
    return json;
    }

    async update(teamId, id, labelRequest) {

        if (!(labelRequest instanceof LabelRequest))
            throw new Error("Invalid Label Request");

        const json = await super.put(
            `${this.endpoint}/${teamId}/labels/${id}`,
            labelRequest.toJson()
        );
    return json;
    }

    async delete(teamId, id) {

        const json = await super.delete(
            `${this.endpoint}/${teamId}/labels/${id}`
        );
    return json;
    }
}