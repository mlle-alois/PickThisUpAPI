import {LogError, StatusModel} from "../../models";
import {Connection} from "mysql2/promise";
import {StatusService} from "../status-service";
import {StatusController} from "../../controllers";

export class StatusServiceImpl implements StatusService {

    private connection: Connection;
    private statusController: StatusController;

    constructor(connection: Connection) {
        this.connection = connection;
        this.statusController = new StatusController(this.connection);
    }

    /**
     * Récupération d'un status depuis son :
     * @param statusId
     */
    getStatusById(statusId: number): Promise<StatusModel | LogError> {
        return this.statusController.getStatusById(statusId);
    }
}