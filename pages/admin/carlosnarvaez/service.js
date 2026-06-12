import HttpService from "../../../shared/services/http.service.js"; 
import { Member } from "./modal.js"; 

class MembersService extends HttpService {
    endpoint = '/Teams/1000/members';

    async getAll() {
        const respuesta = await super.get(this.endpoint);
        
        if (!respuesta || !Array.isArray(respuesta)) {
            return [];
        }
        
        return respuesta;
    }

    async create(payload) { 
        const resultado = await super.post(this.endpoint, payload); 
        return resultado;
    }
    
    async update(userId, payload) { 
        const urlDestino = `${this.endpoint}/${userId}`; 
        const resultado = await super.put(urlDestino, payload); 
        return resultado;
    }
    
    async delete(userId) { 
        const urlDestino = `${this.endpoint}/${userId}`;
        const resultado = await super.delete(urlDestino); 
        return resultado;
    }
}

export const membersService = new MembersService();