
import HttpService from "../../../shared/services/teams.service";

export default class TeamsService extends HttpService {

    endpoint = "/teams";

    /*
     * GET ALL leer todo lo esra ya registrado
     */
    async get() {

        const json =
            await super.get(
                this.endpoint
            );

        if (json === null) {
            return [];
        }

        if (!Array.isArray(json)) {
            return [];
        }

        return json.map(
            team =>
                new TeamResponse(team)
        );
    }

    /*
     * GET BY ID 
     */
    async getById(id) {

        const json =
            await super.get(
                `${this.endpoint}/${id}`
            );

        if (json === null) {
            return null;
        }

        return new TeamResponse(
            json
        );
    }

    /*
     * CREATE crear un nuevo equipo
     */
    async create(teamRequest) {

        if (!teamRequest) {
            throw new Error(
                "Team request is required."
            );
        }

        if (
            !(teamRequest instanceof TeamRequest)
        ) {
            throw new Error(
                "Invalid team request."
            );
        }

        const json =
            await super.post(
                this.endpoint,
                teamRequest.toJson()
            );

        if (json === null) {
            return null;
        }

        return new TeamResponse(
            json
        );
    }

    /*
     * UPDATE actualizar los registro del equipo
     */
    async update(
        id,
        teamRequest
    ) {

        if (!teamRequest) {
            throw new Error(
                "Team request is required."
            );
        }

        if (
            !(teamRequest instanceof TeamRequest)
        ) {
            throw new Error(
                "Invalid team request."
            );
        }

        const json =
            await super.put(
                `${this.endpoint}/${id}`,
                teamRequest.toJson()
            );

        if (json === null) {
            return null;
        }

        return new TeamResponse(
            json
        );
    }

    /*
     * DELETE por Id
     */
    async delete(id) {

        await super.delete(
            `${this.endpoint}/${id}`
        );

        return true;
    }
}