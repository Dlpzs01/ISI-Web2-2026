import HttpService from '../../../services/http.service.js';

export default class TeamsService {

    constructor() {
        this.http = new HttpService();
        this.endpoint = '/Teams';
    }

    /*
    Crear Team
    POST /api/Teams
    */
    async createTeam(teamData) {

        return await this.http.post(
            this.endpoint,
            teamData
        );
    }
    /*
    Obtener Teams
    GET /api/Teams
    */
    async getTeams() {

        return await this.http.get(
            this.endpoint
        );
    }
    
    /*
    Obtener Team por Id
    GET /api/Teams/{id}
    */
    async getTeamById(id) {

        return await this.http.get(
            `${this.endpoint}/${id}`
        );
    }

    /*
    Actualizar Team
    PUT /api/Teams/{id}
    */
    async updateTeam(id, teamData) {

        return await this.http.put(
            `${this.endpoint}/${id}`,
            teamData
        );
    }

    /*
    Eliminar Team
    DELETE /api/Teams/{id}
    */
    async deleteTeam(id) {

        return await this.http.delete(
            `${this.endpoint}/${id}`
        );
    }
}