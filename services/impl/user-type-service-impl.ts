import {UserGetAllOptions, UserTypeController} from "../../controllers";
import {LogError, UserModel, UserTypeModel} from "../../models";
import {Connection} from "mysql2/promise";
import {UserTypeService} from "../user-type-service";

export class UserTypeServiceImpl implements UserTypeService {

    private connection: Connection;
    private userTypeController: UserTypeController;

    constructor(connection: Connection) {
        this.connection = connection;
        this.userTypeController = new UserTypeController(this.connection);
    }

    /**
     * Récupération d'un userType depuis son :
     * @param userTypeId
     */
    getUserTypeById(userTypeId: number): Promise<UserTypeModel | LogError> {
        return this.userTypeController.getUserTypeById(userTypeId);
    }

    /**
     * Récupération de toutes les types de users
     * @param options? -> Limit et offset de la requete
     */
    async getAllUsersTypes(options?: UserGetAllOptions): Promise<UserTypeModel[]> {
        return this.userTypeController.getUserTypes(options);
    }
}
