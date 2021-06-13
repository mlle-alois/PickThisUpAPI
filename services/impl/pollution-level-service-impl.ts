import {PollutionLevelController} from "../../controllers";
import {LogError, PollutionLevelModel} from "../../models";
import {Connection} from "mysql2/promise";
import {PollutionLevelService} from "../pollution-level-service";

export class PollutionLevelServiceImpl implements PollutionLevelService {

    private connection: Connection;
    private pollutionLevelController: PollutionLevelController;

    constructor(connection: Connection) {
        this.connection = connection;
        this.pollutionLevelController = new PollutionLevelController(this.connection);
    }

    /**
     * Récupération d'un pollutionLevel depuis son :
     * @param pollutionLevelId
     */
    getPollutionLevelById(pollutionLevelId: number): Promise<PollutionLevelModel | LogError> {
        return this.pollutionLevelController.getPollutionLevelById(pollutionLevelId);
    }
}