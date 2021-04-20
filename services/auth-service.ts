import {LogError, SessionModel, UserModel} from "../models";
import {IUserCreationProps} from "../controllers";

export interface AuthService {

    subscribe(user: IUserCreationProps): Promise<UserModel | LogError>;
    login(mail: string, password: string): Promise<SessionModel | LogError>;
}