import {LogError, UserModel} from "../models";
import {UserGetAllOptions} from "../controllers";

export interface UserService {

    getAllUsers(options?: UserGetAllOptions): Promise<UserModel[]>;

    getUserByMail(userId: string): Promise<UserModel | LogError>;

    getUserByMailAndPassword(mail: string, password: string): Promise<UserModel | LogError>;

    //TODO à activer/implémenter au besoin
    /*createUser(options: UserModel): Promise<UserModel | LogError>;

    deleteUserByMail(mail: string): Promise<boolean>;

    updateUser(options: UserModel): Promise<UserModel | LogError>;*/
}