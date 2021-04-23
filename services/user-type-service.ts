import {LogError, UserTypeModel} from "../models";

export interface UserTypeService {

    getUserTypeById(userTypeId: number): Promise<UserTypeModel | LogError>;

}