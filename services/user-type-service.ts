import {LogError, UserModel, UserTypeModel} from "../models";
import {UserGetAllOptions} from "../controllers";

export interface UserTypeService {

    getUserTypeById(userTypeId: number): Promise<UserTypeModel | LogError>;

    getAllUsersTypes(options?: UserGetAllOptions): Promise<UserTypeModel[]>;

}
