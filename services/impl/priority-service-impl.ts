import {LogError, PriorityModel} from "../../models";
import {Connection} from "mysql2/promise";
import {PriorityService} from "../priority-service";
import {PriorityController} from "../../controllers";

export class PriorityServiceImpl implements PriorityService {

    private connection: Connection;
    private priorityController: PriorityController;

    constructor(connection: Connection) {
        this.connection = connection;
        this.priorityController = new PriorityController(this.connection);
    }

    /**
     * Récupération d'une priority depuis son :
     * @param priorityId
     */
    getPriorityById(priorityId: number): Promise<PriorityModel | LogError> {
        return this.priorityController.getPriorityById(priorityId);
    }
}