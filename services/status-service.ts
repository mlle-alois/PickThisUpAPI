import {LogError, StatusModel} from "../models";

export interface StatusService {

    getStatusById(statusId: number): Promise<StatusModel | LogError>;

}