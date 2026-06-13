export default class TeamService {

    endpoint = "/teams";

    async create(team) {

        const response = await fetch(this.endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(team)
        });

        return await response.json();
    }
}