import {TaskGetAllOptions, UserController, UserGetAllOptions} from "../../controllers";
import {LogError, UserModel} from "../../models";
import {Connection} from "mysql2/promise";
import {UserService} from "../user-service";
import {UserTypeServiceImpl} from "./user-type-service-impl";
import {compare, hash} from "bcrypt";

export interface UserUpdateProps {
    mail: string;
    password: string;
    name: string;
    firstname: string;
    phoneNumber: string;
    typeId?: number;
}

export class UserServiceImpl implements UserService {

    private connection: Connection;
    private userController: UserController;
    private userTypeService: UserTypeServiceImpl;

    constructor(connection: Connection) {
        this.connection = connection;
        this.userController = new UserController(this.connection);
        this.userTypeService = new UserTypeServiceImpl(this.connection);
    }

    /**
     * Récupération de toutes les user
     * @param options -> Limit et offset de la requete
     */
    async getAllUsers(options?: UserGetAllOptions): Promise<UserModel[]> {
        return this.userController.getAllUsers(options);
    }

    /**
     * Récupération d'un user depuis son :
     * @param userId
     */
    getUserByMail(userId: string): Promise<UserModel | LogError> {
        return this.userController.getUserByMail(userId);
    }

    /**
     * Récupération d'un user depuis son :
     * @param mail
     * @param password
     */
    getUserByMailAndPassword(mail: string, password: string): Promise<UserModel | LogError> {
        return this.userController.getUserByMailAndPassword(mail, password);
    }

    /**
     * récupération des développeurs
     * @param options
     */
    async getAllDevelopers(options?: TaskGetAllOptions): Promise<UserModel[]> {
        return await this.userController.getAllDevelopers(options);
    }


    /**
     * Récupération d'un user depuis son :
     * @param token
     */
    getUserByToken(token: string): Promise<UserModel | LogError> {
        return this.userController.getUserByToken(token);
    }

    /**
     * Modification des informations d'un user renseignées dans les options
     * @param options
     */
    async updateUser(options: UserUpdateProps): Promise<UserModel | LogError> {
        const user = await this.userController.getUserByMail(options.mail);
        if (user instanceof LogError)
            return user;

        return await this.userController.updateUser(options);
    }

    /**
     * Modification le statut d'un user renseignées dans les options
     * @param mail
     * @param status
     */
    async updateUserStatus(mail: string,status:number): Promise<UserModel | LogError> {
        const user = await this.userController.getUserByMail(mail);
        if (user instanceof LogError)
            return user;

        return await this.userController.updateUserStatus(mail,status);
    }


    /**
     * Création d'un user
     * @param options
     */
    /*async createUser(options: UserModel): Promise<UserModel | LogError> {
        const userType = await this.userTypeService.getUserTypeById(options.typeId as number);
        if (userType instanceof LogError)
            return new LogError({numError: 404, text: "User type not exists"});

        return this.userController.createUser(options);
    }*/

    /**
     * suppression d'un user selon son id
     * @param mail
     */
    async deleteUserByMail(mail: string): Promise<boolean> {
        const user = await this.userController.getUserByMail(mail);
        if (user instanceof LogError)
            return false;

        return await this.userController.deleteUserByMail(mail);
    }
}
