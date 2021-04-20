import {AuthService} from "../auth-service";
import {AuthController, IUserCreationProps, SessionController, UserController} from "../../controllers";
import {SessionModel, UserModel} from "../../models";
import {Connection} from "mysql2/promise";
import {hash} from "bcrypt";

export class AuthServiceImpl implements AuthService {

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
     * Inscription de l'utilisateur
     * @param properties -> Informations de l'utilisateur entrées en base (mot de passe haché par le code)
     */
    async subscribe(properties: IUserCreationProps): Promise<UserModel | null> {
        //vérifier que le mail est unique
        const user = await this.userController.getUserByMail(properties.mail);
        if (user !== null) {
            return null;
        }

        //hachage du mot de passe
        properties.password = await hash(properties.password, 5);

        return this.authController.createUser(properties);
    }

    /**
     * login de l'utilisateur via :
     * @param mail
     * @param password
     * Récupération de la session créée
     */
    public async login(mail: string, password: string): Promise<SessionModel | null> {

        const user = await this.userController.getUserByMailAndPassword(mail, password);
        if (user === null || user.mail === undefined) {
            return null;
        }
        //génération de token depuis la date actuelle et le login
        const token = await hash(Date.now() + mail, 5);

        try {
            //suppression des anciennes sessions non fermées
            await this.sessionController.deleteOldSessionsByUserMail(user.mail);

            //création et récupération de la session
            return await this.sessionController.createSession(await this.sessionController.getMaxSessionId() + 1, token, user.mail);
        } catch (err) {
            console.error(err);
            return null;
        }
    }

}