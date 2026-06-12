export class MemberRequest {
    constructor(userId = 0, firstName = '', lastName = '', role = 'Miembro') {
        this.UserId = userId;
        this.FirstName = firstName;
        this.LastName = lastName;
        this.Role = role;
    }

    toJson() {
        return {
            UserId: this.UserId,
            FirstName: this.FirstName,
            LastName: this.LastName,
            Role: this.Role
        };
    }
}