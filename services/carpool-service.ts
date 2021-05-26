import {LogError, CarpoolModel, UserModel} from "../models";
import {CarpoolUpdateOptions} from "../controllers";

export interface CarpoolService {

    getMaxCarpoolId(): Promise<number>;

    getCarpoolById(carpoolId: number): Promise<CarpoolModel | LogError>;

    createCarpool(options: CarpoolModel): Promise<CarpoolModel | LogError>;

    deleteCarpoolById(carpoolId: number): Promise<boolean>;

    updateCarpool(options: CarpoolUpdateOptions): Promise<CarpoolModel | LogError>;
    
    registerCarpool(carpoolId: number, userMail: string): Promise<UserModel[] | LogError>;

    unregisterCarpool(carpoolId: number, userMail: string): Promise<UserModel[] | LogError>;

    getCarpoolsByEvent(eventId: number): Promise<CarpoolModel[] | LogError>;

    getCarpoolMembersById(carpoolId: number): Promise<UserModel[] | LogError>;

    getOldAdressesCarpoolByUser(userMail: string): Promise<String[] | LogError>;
}