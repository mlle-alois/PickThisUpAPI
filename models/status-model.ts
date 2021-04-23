export interface StatusModelProps {
    statusId: number;
    statusLibelle: string;
}

export class StatusModel implements StatusModelProps {
    statusId: number;
    statusLibelle: string;

    constructor(properties: StatusModelProps) {
        this.statusId = properties.statusId;
        this.statusLibelle = properties.statusLibelle;
    }
}