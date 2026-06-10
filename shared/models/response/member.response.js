export class MemberResponse {
    constructor(teamId, userId, displayName, email, role, joinedAt) {
        this.teamId = teamId;
        this.userId = userId;
        this.displayName = displayName;
        this.email = email;
        this.role = role;
        this.joinedAt = joinedAt;
    }

    static fromJson(json) {
        return new MemberResponse(
            json.teamId,
            json.userId,
            json.displayName,
            json.email,
            json.role,
            json.joinedAt
        );
    }
}