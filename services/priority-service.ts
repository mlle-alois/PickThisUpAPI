import {LogError, PriorityModel} from "../models";

export interface PriorityService {

    getPriorityById(priorityId: number): Promise<PriorityModel | LogError>;

}