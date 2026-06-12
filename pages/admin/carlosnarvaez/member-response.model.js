export class MemberResponse {
    constructor(id = 0, firstName = '', lastName = '', role = 'Miembro') {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
    }

    static fromJson(data = {}) {
        return new MemberResponse(
            data.userId || data.UserId || data.id || 0,
            data.firstName || data.FirstName || 'Sin nombre',
            data.lastName || data.LastName || '',
            data.role || data.Role || 'Miembro'
        );
    }

    get fullName() {
        if (!this.lastName) return this.firstName;
        return `${this.firstName} ${this.lastName}`.trim();
    }
}