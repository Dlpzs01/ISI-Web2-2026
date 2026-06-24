import TeamRequest from "../../models/request/EMILIO_request/teams.request.js";
import { TeamResponse } from "../../models/response/EMILIO_response/teams.response.js";
import HttpService from "./https.services.js";

export default class TeamsService extends HttpService {
    endpoint = '/Teams';
    

    //GET all
    async get() {
        const json = await super.get(this.endpoint);
        
        if (!Array.isArray(json)) return [];

        return json.map(item => TeamResponse.fromJson(item));
        
    }

    //GET by ID
    async getById(id) {
        const json = await super.get(`${this.endpoint}/${id}`);
    
        return TeamResponse.fromJson(json);
        
    }

    //POST (crear)
    async create(teamRequest) {
       if (!(teamRequest instanceof TeamRequest)) throw new Error('Invalid team request.');

        const json = await super.post(this.endpoint, teamRequest.toJson());

        return TeamResponse.fromJson(json);

    }
    
    //PUT (o patch, actualizacion parcial)
    async put(id, teamRequest) {
        if (!(teamRequest instanceof TeamRequest)) { throw new Error('Invalid team request.') };

        const json = await super.put(`${this.endpoint}/${id}`, teamRequest.toJson());
        return TeamResponse.fromJson(json);
    }

    //DELETE
    async delete(id) {
        //El DELETE puede no devolver contenido, pero lo manejamos

        await super.delete(`${this.endpoint}/${id}`);

        return { success: true, id };

    }
    
}