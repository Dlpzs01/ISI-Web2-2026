
import HttpService from "../../../shared/services/http.service.js"; 
import { Member } from "./modal.js"; 

class MembersService extends HttpService {
    endpoint = '/Teams/1/members';

    async getAll() {
        const json = await super.get(this.endpoint);
        if (!json || !Array.isArray(json)) return [];
        
        
        return json.map(item => new Member(item));
    }

    async create(payload) { 
        return await super.post(this.endpoint, payload); 
    }
    
    async update(userId, payload) { 
        return await super.put(`${this.endpoint}/${userId}`, payload); 
    }
    
    async delete(userId) { 
        return await super.delete(`${this.endpoint}/${userId}`); 
    }
}

export const membersService = new MembersService();