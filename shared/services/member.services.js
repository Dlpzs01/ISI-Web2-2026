import MemberRequest from "../models/request/member.request.js";
import { MemberResponse } from "../models/response/member.response.js";
import HttpService from "./http.service.js";

export default class MembersService extends HttpService {

    endpoint(teamId) {
        return `/teams/${teamId}/members`;
    }

    async getByTeam(teamId) {
        const json = await super.get(this.endpoint(teamId));
        if (json === null) return [];
        if (!Array.isArray(json)) return [];
        return json.map(j => MemberResponse.fromJson(j));
    }

    async add(teamId, memberRequest) {
        if (!memberRequest) throw new Error('Member request is required.');
        if (!(memberRequest instanceof MemberRequest)) throw new Error('Invalid member request.');
        const json = await super.post(this.endpoint(teamId), memberRequest.toJson());
        return json;
    }

    async remove(teamId, userId) {
        return await super.delete(`${this.endpoint(teamId)}/${userId}`);
    }
}