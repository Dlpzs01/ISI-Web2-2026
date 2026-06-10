export default class MemberRequest {
    userId = 0;
    role = '';

    constructor(userId, role) {
        this.userId = userId;
        this.role = role;
    }

    toJson() {
        return {
            userId: this.userId,
            role: this.role
        };
    }
}