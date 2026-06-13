 import HttpService from "../../../shared/services/http.service.js";

export default class TeamsService extends HttpService {
    constructor() {
        super(); 
    }
 
    // GET: Obtener todos los equipos usando la clase base
    async getAllTeams() {
        try {
            return await super.get('/teams'); 
        } catch (error) {
            console.error("Error al traer los equipos mediante HttpService:", error);
            throw error;
        }
    }

    // GET por ID: Obtiene un solo equipo usando su identificador
    async getTeamById(id) {
        try {
            return await super.get(`/teams/${id}`); 
        } catch (error) {
            console.error(`Error en getTeamById para el ID ${id}:`, error);
            throw error;
        }
    }

    //post para crear un equipo.
    async createTeam(TeamData) {
        try{
            return await super.post('/teams', TeamData);
        }catch(error){
            console.error("Error al crear un teams",error);
           throw error;
        }
    }

    //put para actualizar un equipo por id (/api/teams/{id})
    async updateTeam(id, TeamData) {
        try{
            return await super.put(`/teams/${id}`, TeamData);
        }catch(error){
            console.error(`Error al actualizar el equipo con ID ${id}:`, error);
            throw error;
        }
    }
   
    //delete eliminar un equipo usando id (api/Teams/{id})
    async deleteTeam(id){
        try{
            return await super.delete(`/teams/${id}`);
        }catch(error){
            console.error(`Error al eliminar el equipo con id ${id}`,error);
            throw error;
        }
    }
}