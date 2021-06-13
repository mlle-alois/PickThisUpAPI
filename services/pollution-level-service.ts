import {LogError, PollutionLevelModel} from "../models";

export interface PollutionLevelService {

    getPollutionLevelById(pollutionLevelId: number): Promise<PollutionLevelModel | LogError>;

}