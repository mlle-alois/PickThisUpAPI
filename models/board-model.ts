export interface IBoardProps {
    boardId: number;
    boardName: string;
}

export class BoardModel implements IBoardProps {
    boardId: number;
    boardName: string;

    constructor(properties: IBoardProps) {
        this.boardId = properties.boardId;
        this.boardName = properties.boardName;
    }
}