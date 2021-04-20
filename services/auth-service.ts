import {SessionModel, UserModel} from "../models";
import {IUserCreationProps} from "../controllers";

export interface AuthService {

    subscribe(user: IUserCreationProps): Promise<UserModel | null>;
    login(mail: string, password: string): Promise<SessionModel | null>;
}