export class Member {
    constructor(id = '', firstName = 'Sin nombre', lastName = '', role = 'Miembro') {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
    }

    
    static fromJson(data = {}) {
        return new Member(
            data.id || '',
            data.firstName || 'Sin nombre',
            data.lastName || '',
            data.role || 'Miembro'
        );
    }

    get fullName() {
        return `${this.firstName} ${this.lastName}`.trim();
    }
}