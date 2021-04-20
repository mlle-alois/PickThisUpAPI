import {UserModel} from "../models";
import {Connection} from "mysql2/promise";
import {hash} from "bcrypt";
import {SessionModel} from "../models";
import {UserController} from "./user-controller";
import {SessionController} from "./session-controller";

export interface IUserCreationProps {
    mail: string;
    password: string;
    name: string;
    firstname: string;
    phoneNumber: string;
    typeId: number;
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

    async createUser(properties: IUserCreationProps): Promise<UserModel | null> {
        try {
            await this.connection.execute(`INSERT INTO USER (user_mail, user_password, user_name, user_firstname, user_phone_number, user_type_id) VALUES (?, ?, ?, ?, ?, ?, ?)`, [
                properties.mail,
                properties.password,
                properties.name,
                properties.firstname,
                properties.phoneNumber,
                properties.typeId
            ]);
            //récupération de l'utilisateur inscrit ou null si cela n'a pas fonctionné
            return await this.userController.getUserByMail(properties.mail);
        } catch (err) {
            console.error(err);
            return null;
        }
    }
}