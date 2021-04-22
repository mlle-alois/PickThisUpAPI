export interface IListProps {
    listId: number;
    listName: string;
    positionInBoard: number;
    boardId: number;
}

export class ListModel implements IListProps {
    listId: number;
    listName: string;
    boardId: number;
    positionInBoard: number;

    constructor(properties: IListProps) {
        this.listId = properties.listId;
        this.listName = properties.listName;
        this.boardId = properties.boardId;
        this.positionInBoard = properties.positionInBoard;
    }
}