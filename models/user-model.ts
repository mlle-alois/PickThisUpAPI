import {MediaModel} from "./media-model";
import {UserTypeModel} from "./user-type-model";

export interface IUserProps {
    mail?: string;
    password?: string;
    name?: string;
    firstname?: string;
    phoneNumber?: string;
    profilePictureId?: number;
    profilePicture?: MediaModel;
    typeId?: number;
    type?: UserTypeModel;
}

export class UserModel implements IUserProps {
    mail?: string;
    password?: string;
    name?: string;
    firstname?: string;
    phoneNumber?: string;
    profilePictureId?: number;
    profilePicture?: MediaModel;
    typeId?: number;
    type?: UserTypeModel;

    constructor(properties: IUserProps) {
        this.mail = properties?.mail;
        this.password = properties?.password;
        this.name = properties?.name;
        this.firstname = properties?.firstname;
        this.phoneNumber = properties?.phoneNumber;
        this.profilePictureId = properties?.profilePictureId;
        this.profilePicture = properties.profilePicture;
        this.typeId = properties?.typeId;
        this.type = properties.type;
    }
}