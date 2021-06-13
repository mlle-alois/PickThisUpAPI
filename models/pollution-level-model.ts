export interface PollutionLevelModelProps {
    pollutionLevelId: number;
    pollutionLevelLibelle: string;
}

export class PollutionLevelModel implements PollutionLevelModelProps {
    pollutionLevelId: number;
    pollutionLevelLibelle: string;

    constructor(properties: PollutionLevelModelProps) {
        this.pollutionLevelId = properties.pollutionLevelId;
        this.pollutionLevelLibelle = properties.pollutionLevelLibelle;
    }
}