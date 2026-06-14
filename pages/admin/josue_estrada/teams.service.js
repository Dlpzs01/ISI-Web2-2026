import HttpService
from "../../../shared/services/http.service.js";

import TeamResponse
from "../../../shared/models/response/team.response.js";

export default class TeamsService {

    constructor() {

        this.http =
            new HttpService();

        this.endpoint =
            "/Teams";
    }

    async getTeams() {

        const response =
            await this.http.get(
                this.endpoint
            );

        return response.map(
            team =>
                new TeamResponse(team)
        );
    }

    async getTeamById(id) {

        const response =
            await this.http.get(
                `${this.endpoint}/${id}`
            );

        return new TeamResponse(
            response
        );
    }

    async createTeam(teamRequest) {

        return await this.http.post(
            this.endpoint,
            teamRequest.toJson()
        );
    }

    async updateTeam(
        id,
        teamRequest
    ) {

        return await this.http.put(
            `${this.endpoint}/${id}`,
            teamRequest.toJson()
        );
    }

    async deleteTeam(id) {

        return await this.http.delete(
            `${this.endpoint}/${id}`
        );
    }
}