import {LogError, UserModel} from "../models";
import {Connection} from "mysql2/promise";
import {UserController} from "./user-controller";
import {SessionController} from "./session-controller";

export interface IUserCreationProps {
    userMail: string;
    userPassword: string;
    userName: string;
    userFirstname: string;
    userPhoneNumber: string;
    userTypeId: number;
}

export class AuthController {

    private connection: Connection;
    private userController: UserController;
    private sessionController: SessionController;

    constructor(connection: Connection) {
        this.connection = connection;
        this.userController = new UserController(this.connection);
        this.sessionController = new SessionController(this.connection);
    }

    async createUser(properties: IUserCreationProps): Promise<UserModel | LogError> {
        try {
            await this.connection.execute(`INSERT INTO USER (user_mail, user_password, user_name, user_firstname,
                                                             user_phone_number, user_type_id)
                                           VALUES (?, ?, ?, ?, ?, ?)`, [
                properties.userMail,
                properties.userPassword,
                properties.userName,
                properties.userFirstname,
                properties.userPhoneNumber,
                properties.userTypeId
            ]);
            //récupération de l'utilisateur inscrit ou null si cela n'a pas fonctionné
            return await this.userController.getUserByMail(properties.userMail);
        } catch (err) {
            console.error(err);
            return new LogError({numError: 500, text: "Error during creation"});
        }
    }
}