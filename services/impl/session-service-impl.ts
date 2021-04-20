import {AuthService} from "../auth-service";
import {AuthController, IUserCreationProps, SessionController, UserController} from "../../controllers";
import {LogError, SessionModel, UserModel} from "../../models";
import {Connection, ResultSetHeader, RowDataPacket} from "mysql2/promise";
import {hash} from "bcrypt";
import {SessionService} from "../session-service";
import {DateUtils} from "../../Utils";

export class SessionServiceImpl implements SessionService {

    private connection: Connection;
    private userController: UserController;
    private authController: AuthController;
    private sessionController: SessionController;

    constructor(connection: Connection) {
        this.connection = connection;
        this.userController = new UserController(this.connection);
        this.authController = new AuthController(this.connection);
        this.sessionController = new SessionController(this.connection);
    }

    /**
     * Récupération de l'id de session maximum existant
     * Utile pour l'incrémentation manuelle
     */
    async getMaxSessionId(): Promise<number> {
        return this.sessionController.getMaxSessionId();
    }

    /**
     * Récupération d'une session depuis le token
     * @param token
     */
    async getSessionByToken(token: string): Promise<SessionModel | LogError> {
        return this.sessionController.getSessionByToken(token);
    }

    /**
     * Création d'une session
     * @param sessionId
     * @param token
     * @param mail
     */
    async createSession(sessionId: number, token: string, mail: string): Promise<SessionModel | LogError> {
        return this.sessionController.createSession(sessionId, token, mail);
    }

    /**
     * récupérations des sessions associées à l'user id
     * @param mail
     */
    async deleteOldSessionsByUserId(mail: string): Promise<boolean> {
        return this.sessionController.deleteOldSessionsByUserMail(mail);
    }

    /**
     * Suppression d'une session depuis le token
     * @param token
     */
    async deleteSessionByToken(token: string): Promise<boolean> {
        return this.sessionController.deleteSessionByToken(token);
    }

    /**
     * Récupération d'une session en ajoutant 2 heure d'un le token
     * A utiliser si on veut effectuer le controle d'expiration du token en base
     * @param token
     */
    async getLastUpdatedTimePlus2Hours(token: string): Promise<string | undefined> {
        return this.sessionController.getLastUpdatedTimePlus2Hours(token);
    }

    /**
     * Met à jour le champ updatedAt de la dernière session
     * @param options
     */
    async updateSession(options: SessionModel): Promise<SessionModel | LogError> {
        return this.sessionController.updateHourOfSession(options);
    }

}