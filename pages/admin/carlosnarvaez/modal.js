export class Member {
    constructor(data = {}) {
        this.id = data.id || '';
        this.firstName = data.firstName || 'Sin nombre';
        this.lastName = data.lastName || '';
        this.role = data.role || 'Miembro';
    }

    // Propiedad calculada para simplificar el nombre en la interfaz
    get fullName() {
        return `${this.firstName} ${this.lastName}`.trim();
    }
}