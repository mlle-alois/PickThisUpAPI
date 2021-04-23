import {UserTypeController} from "../../controllers";
import {LogError, UserTypeModel} from "../../models";
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
}