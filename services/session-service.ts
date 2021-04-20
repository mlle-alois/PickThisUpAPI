import {LogError, SessionModel, UserModel} from "../models";
import {IUserCreationProps} from "../controllers";
import {ResultSetHeader, RowDataPacket} from "mysql2/promise";
import {DateUtils} from "../Utils";

export interface SessionService {

    getMaxSessionId(): Promise<number>;

    getSessionByToken(token: string): Promise<SessionModel | null>;

    createSession(sessionId: number, token: string, userId: string): Promise<SessionModel | null>;

    deleteOldSessionsByUserId(mail: string): Promise<boolean>;

    deleteSessionByToken(token: string): Promise<boolean | null>;

    getLastUpdatedTimePlus2Hours(token: string): Promise<string | undefined>;

    updateSession(options: SessionModel): Promise<SessionModel | LogError | null>;

}