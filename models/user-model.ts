export interface IUserProps {
    mail?: string;
    password?: string;
    name?: string;
    firstname?: string;
    phoneNumber?: string;
    profilePictureId?: number;
    typeId?: number;
}

export class UserModel implements IUserProps {
    mail?: string;
    password?: string;
    name?: string;
    firstname?: string;
    phoneNumber?: string;
    profilePictureId?: number;
    typeId?: number;

    constructor(properties: IUserProps) {
        this.mail = properties?.mail;
        this.password = properties?.password;
        this.name = properties?.name;
        this.firstname = properties?.firstname;
        this.phoneNumber = properties?.phoneNumber;
        this.profilePictureId = properties?.profilePictureId;
        this.typeId = properties?.typeId;
    }
}