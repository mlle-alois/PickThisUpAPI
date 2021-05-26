import express from "express";
import {DatabaseUtils} from "../database/database";
import {authUserMiddleWare} from "../middlewares/auth-middleware";
import {
    getUserMailConnected,
    isBlockedUserConnected,
    isDevConnected
} from "../Utils";
import {CarpoolServiceImpl} from "../services/impl";
import {LogError} from "../models";

const carpoolRouter = express.Router();

/**
 * ajout d'un covoiturage
 * URL : /carpool/add
 * Requete : POST
 * ACCES : TOUS sauf UTILISATEUR BLOQUE
 * Nécessite d'être connecté : OUI
 */
carpoolRouter.post("/add", authUserMiddleWare, async function (req, res, next) {
    //vérification droits d'accès
    if (!await isBlockedUserConnected(req)) {
        const connection = await DatabaseUtils.getConnection();
        const carpoolService = new CarpoolServiceImpl(connection);

        const id = await carpoolService.getMaxCarpoolId() + 1;
        const street = req.body.street;
        const zipcode = req.body.zipcode;
        const city = req.body.city;
        const nbPlaces = req.body.nbPlaces;
        const eventId = req.body.eventId;

        if (street === undefined || zipcode === undefined || city === undefined ||
            nbPlaces === undefined || eventId === undefined) {
            res.status(400).end("Veuillez renseigner les informations nécessaires");
            return;
        }

        const conductorId = await getUserMailConnected(req);
        if (conductorId instanceof LogError)
            return LogError.HandleStatus(res, conductorId);

        const carpool = await carpoolService.createCarpool({
            carpoolId: id,
            carpoolDepartureStreet: street,
            carpoolDepartureZipcode: zipcode,
            carpoolDepartureCity: city,
            nbPlaces: nbPlaces,
            eventId: eventId,
            conductorId: conductorId
        });

        if (carpool instanceof LogError) {
            LogError.HandleStatus(res, carpool);
        } else {
            res.status(201);
            res.json(carpool);
        }
    }
    res.status(403).end();
});

/**
 * récupération d'un covoiturage selon son id
 * URL : /carpool/get/:id
 * Requete : GET
 * ACCES : TOUS
 * Nécessite d'être connecté : OUI
 */
carpoolRouter.get("/get/:id", authUserMiddleWare, async function (req, res, next) {
    const connection = await DatabaseUtils.getConnection();
    const carpoolService = new CarpoolServiceImpl(connection);

    const id = req.params.id;

    if (id === undefined)
        return res.status(400).end("Veuillez renseigner les informations nécessaires");

    const carpool = await carpoolService.getCarpoolById(Number.parseInt(id));

    if (carpool instanceof LogError)
        LogError.HandleStatus(res, carpool);
    else
        res.json(carpool);
});

/**
 * modification d'un covoiturage selon son id
 * URL : /carpool/update/:id
 * Requete : PUT
 * ACCES : TOUS sauf UTILISATEUR BLOQUE
 * Nécessite d'être connecté : OUI
 */
carpoolRouter.put("/update/:id", authUserMiddleWare, async function (req, res, next) {
    //vérification droits d'accès
    if (!await isBlockedUserConnected(req)) {
        const id = req.params.id;
        const street = req.body.street;
        const zipcode = req.body.zipcode;
        const city = req.body.city;
        const nbPlaces = req.body.nbPlaces;

        if (id === undefined || (street === undefined && zipcode === undefined && city === undefined && nbPlaces === undefined)) {
            res.status(400).end("Veuillez renseigner les informations nécessaires");
            return;
        }
        const connection = await DatabaseUtils.getConnection();
        const carpoolService = new CarpoolServiceImpl(connection);

        const carpool = await carpoolService.updateCarpool({
            carpoolId: Number.parseInt(id),
            carpoolDepartureStreet: street,
            carpoolDepartureZipcode: zipcode,
            carpoolDepartureCity: city,
            nbPlaces: nbPlaces
        });

        if (carpool instanceof LogError)
            LogError.HandleStatus(res, carpool);
        else
            res.json(carpool);
    }
    res.status(403).end();
});

/**
 * suppression d'un covoiturage selon son id
 * URL : /carpool/delete/:id
 * Requete : DELETE
 * ACCES : TOUS sauf UTILISATEUR BLOQUE
 * Nécessite d'être connecté : OUI
 */
carpoolRouter.delete("/delete/:id", authUserMiddleWare, async function (req, res, next) {
    if (await isDevConnected(req)) {
        const connection = await DatabaseUtils.getConnection();
        const carpoolService = new CarpoolServiceImpl(connection);

        const id = req.params.id;

        if (id === undefined)
            return res.status(400).end("Veuillez renseigner les informations nécessaires");

        const success = await carpoolService.deleteCarpoolById(Number.parseInt(id));

        if (success)
            res.status(204).end();
        else
            res.status(404).end();
    }
    res.status(403).end();
});

/**
 * s'inscrire à un covoiturage selon son id
 * URL : /carpool/register/:id
 * Requete : POST
 * ACCES : TOUS
 * Nécessite d'être connecté : OUI
 */
carpoolRouter.post("/register/:id", authUserMiddleWare, async function (req, res, next) {
    const connection = await DatabaseUtils.getConnection();
    const carpoolService = new CarpoolServiceImpl(connection);

    const id = req.params.id;

    if (id === undefined)
        return res.status(400).end("Veuillez renseigner les informations nécessaires");

    const userMail = await getUserMailConnected(req);
    if (userMail instanceof LogError)
        return LogError.HandleStatus(res, userMail);

    const participants = await carpoolService.registerCarpool(Number.parseInt(id), userMail);

    if (participants instanceof LogError)
        LogError.HandleStatus(res, participants);
    else
        res.json(participants);
});

/**
 * se désinscrire d'un covoiturage selon son id
 * URL : /carpool/unregister/:id
 * Requete : DELETE
 * ACCES : TOUS
 * Nécessite d'être connecté : OUI
 */
carpoolRouter.delete("/unregister/:id", authUserMiddleWare, async function (req, res, next) {
    const connection = await DatabaseUtils.getConnection();
    const carpoolService = new CarpoolServiceImpl(connection);

    const id = req.params.id;

    if (id === undefined)
        return res.status(400).end("Veuillez renseigner les informations nécessaires");

    const userMail = await getUserMailConnected(req);
    if (userMail instanceof LogError)
        return LogError.HandleStatus(res, userMail);

    const participants = await carpoolService.unregisterCarpool(Number.parseInt(id), userMail);

    if (participants instanceof LogError)
        LogError.HandleStatus(res, participants);
    else
        res.json(participants);
});

/**
 * récupérer les covoiturages d'un événement
 * URL : /carpool/getByEvent/:id
 * Requete : GET
 * ACCES : TOUS
 * Nécessite d'être connecté : OUI
 */
carpoolRouter.get("/getByEvent/:id", authUserMiddleWare, async function (req, res, next) {
    const connection = await DatabaseUtils.getConnection();
    const carpoolService = new CarpoolServiceImpl(connection);

    const id = req.params.id;

    if (id === undefined)
        return res.status(400).end("Veuillez renseigner les informations nécessaires");

    const carpools = await carpoolService.getCarpoolsByEvent(Number.parseInt(id));

    if (carpools instanceof LogError)
        LogError.HandleStatus(res, carpools);
    else
        res.json(carpools);
});

/**
 * récupérer les précédentes adresses de covoiturages de l'utilisateur connecté
 * URL : /carpool/getOldAdresses
 * Requete : GET
 * ACCES : TOUS
 * Nécessite d'être connecté : OUI
 */
carpoolRouter.get("/getOldAdresses", authUserMiddleWare, async function (req, res, next) {
    const connection = await DatabaseUtils.getConnection();
    const carpoolService = new CarpoolServiceImpl(connection);

    const mail = await getUserMailConnected(req);
    if (mail instanceof LogError)
        return LogError.HandleStatus(res, mail);

    const carpools = await carpoolService.getOldAdressesCarpoolByUser(mail);

    if (carpools instanceof LogError)
        LogError.HandleStatus(res, carpools);
    else
        res.json(carpools);
});

export {
    carpoolRouter
}