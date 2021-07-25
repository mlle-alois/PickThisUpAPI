import {LogError, UserModel} from "../models";
import {TaskGetAllOptions, UserGetAllOptions} from "../controllers";
import {UserUpdateProps} from "./impl";

export interface UserService {

    getAllUsers(options?: UserGetAllOptions): Promise<UserModel[]>;

    getUserByMail(userId: string): Promise<UserModel | LogError>;

    getUserByMailAndPassword(mail: string, password: string): Promise<UserModel | LogError>;

    getAllDevelopers(options?: TaskGetAllOptions): Promise<UserModel[]>;

    getUserByToken(token: string): Promise<UserModel | LogError>;

    updateUser(options: UserUpdateProps): Promise<UserModel | LogError>;

    updateUserStatus(mail: string, status: number): Promise<UserModel | LogError>;

    deleteUserByMail(mail:string): Promise<Boolean>;

    /*createUser(options: UserModel): Promise<UserModel | LogError>;

    deleteUserByMail(mail: string): Promise<boolean>;*/
}
