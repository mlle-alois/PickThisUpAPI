export interface PriorityModelProps {
    priorityId: number;
    priorityLibelle: string;
}

export class PriorityModel implements PriorityModelProps {
    priorityId: number;
    priorityLibelle: string;

    constructor(properties: PriorityModelProps) {
        this.priorityId = properties.priorityId;
        this.priorityLibelle = properties.priorityLibelle;
    }
}