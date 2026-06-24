import Team_LabelRequest from "../../models/request/EMILIO_request/teams-labels.request.js";
import { Team_LabelResponse } from "../../models/response/EMILIO_response/teams-labels.response.js";
import HttpService from "./https.services.js";
import TokenResponse from "../../models/response/EMILIO_response/token.response.js";

export default class Teams_LabelsService extends HttpService {
    endpoint = '/Teams';

    
    // GET
    async getById(teamId) {
        const json = await super.get(`${this.endpoint}/${teamId}/labels`);
        
        if (!Array.isArray(json)) return [];
        return json.map(item => Team_LabelResponse.fromJson(item));

    }


    // POST (crear)
    async create(teamId, team_labelRequest) {
        if (!(team_labelRequest instanceof Team_LabelRequest)) throw new Error('Invalid team label request.');
        
        const json = await super.post(`${this.endpoint}/${teamId}/labels`, [team_labelRequest.toJson()]);
        return Team_LabelResponse.fromJson(json);

    }
    

    // PUT (actualizar)
    async put(teamId, id, team_labelRequest) {
        if (!(team_labelRequest instanceof Team_LabelRequest)) throw new Error('Invalid team label request.');
        
        const json = await super.put(`${this.endpoint}/${teamId}/labels/${id}`, team_labelRequest.toJson());
        return Team_LabelResponse.fromJson(json);

    }


    // DELETE (sobreescrito para manejar 204)
    async delete(teamId, id) {
        const token = TokenResponse.loadFromLocalStorage();
        const headers = { 'Content-Type': 'application/json' };

        if (token && token.isValid()) {
            headers['Authorization'] = `Bearer ${token.token}`;

        }

        const response = await fetch(`${this.baseUrl}${this.endpoint}/${teamId}/labels/${id}`, {
            method: 'DELETE',
            headers
        });

        if (!response.ok) {
            let errorMsg = `Error ${response.status}`;

            try {
                const errorData = await response.json();
                errorMsg = errorData.message || errorMsg;

            } catch (e) {}
            throw new Error(errorMsg);

        }
        return { success: true, teamId, id };

    }

}