import {LogError, StatusModel} from "../models";
import {StatusGetAllOptions} from "../controllers";

export interface StatusService {

    getStatusById(statusId: number): Promise<StatusModel | LogError>;

    getStatusByName(statusName: string): Promise<StatusModel | LogError>;

    getAllStatus(options?: StatusGetAllOptions): Promise<StatusModel[]>;

}