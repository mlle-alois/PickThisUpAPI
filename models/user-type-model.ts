export interface UserTypeModelProps {
    userTypeId: number;
    userTypeLibelle: string;
}

export class UserTypeModel implements UserTypeModelProps {
    userTypeId: number;
    userTypeLibelle: string;

    constructor(properties: UserTypeModelProps) {
        this.userTypeId = properties.userTypeId;
        this.userTypeLibelle = properties.userTypeLibelle;
    }
}