import {AuthService} from "../auth-service";
import {AuthController, IUserCreationProps, SessionController, UserController} from "../../controllers";
import {LogError, SessionModel, UserModel} from "../../models";
import {Connection} from "mysql2/promise";
import {hash} from "bcrypt";
import {UserTypeController} from "../../controllers";
import {UserService} from "../user-service";
import {UserServiceImpl} from "./user-service-impl";

export class AuthServiceImpl implements AuthService {

    private connection: Connection;
    private userService: UserService;
    private authController: AuthController;
    private sessionController: SessionController;
    private userTypeController: UserTypeController;

    constructor(connection: Connection) {
        this.connection = connection;
        this.userService = new UserServiceImpl(this.connection);
        this.authController = new AuthController(this.connection);
        this.sessionController = new SessionController(this.connection);
        this.userTypeController = new UserTypeController(this.connection);
    }

    /**
     * Inscription de l'utilisateur
     * @param properties -> Informations de l'utilisateur entrées en base (mot de passe haché par le code)
     */
    async subscribe(properties: IUserCreationProps): Promise<UserModel | LogError> {
        //vérifier que le mail est unique
        const user = await this.userService.getUserByMail(properties.userMail);
        if (!(user instanceof LogError))
            return new LogError({numError: 409, text: "Mail is already used"});

        //vérifier que le type user renseigné existe
        const typeUser = await this.userTypeController.getUserTypeById(properties.userTypeId);
        if(typeUser instanceof LogError) {
            return new LogError({numError: 400, text: "User type don't exists"});
        }

        //hachage du mot de passe
        properties.userPassword = await hash(properties.userPassword, 5);

        return this.authController.createUser(properties);
    }

    /**
     * login de l'utilisateur via :
     * @param mail
     * @param password
     * Récupération de la session créée
     */
    public async login(mail: string, password: string): Promise<SessionModel | LogError> {

        const user = await this.userService.getUserByMailAndPassword(mail, password);
        if (user instanceof LogError)
            return user;

        //génération de token depuis la date actuelle et le mail
        let token = await hash(Date.now() + mail, 5);
        token = token.replace('/', '');
        try {
            //suppression des anciennes sessions non fermées
            await this.sessionController.deleteOldSessionsByUserMail(mail);

            //création et récupération de la session
            return await this.sessionController.createSession(await this.sessionController.getMaxSessionId() + 1, token, mail);
        } catch (err) {
            console.error(err);
            return new LogError({numError: 500, text: "Connection failed"});
        }
    }

}