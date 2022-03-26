let express = require('express');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const Connection = require("../config/connection");
let router = express.Router();

/* GET toutes les commandes */
router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json;charset=utf-8');

    Connection.query("SELECT * FROM commande", (error, result, fields) => {
        if(error){
            res.status(500).json({
                "type": "error",
                "error": "500",
                "message": error,
            });
        } else {
            res.status(200).json(result);
        }
    });
});
router.post('/', function(req, res, next) { res.status(405).json({
    "type": "error",
    "error": "405",
    "message": "Méthode non autorisée pour cette URL"
}); });


/* GET commandes by id and token */
router.get('/:id', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json;charset=utf-8');

    /** Verify Token **/
    let tkn = null;
    if(req.query['token'] !== null && req.query['token'] !== undefined) tkn = req.query['token'];
    if(req.get('X-lbs-token') !== null) if(req.get('X-lbs-token') !== undefined) tkn = req.get('X-lbs-token');

    /** Vérifie le token de la commande */
    let rq = "SELECT token FROM commande WHERE id='"+ req.params.id + "'";
    Connection.query(rq, (error, result, fields) => {
        if(error){
            res.status(500).json({
                "type": "error",
                "error": "500",
                "message": error,
            });
        } else {
            if(tkn === result[0].token){

                /** Récupère les items de la commande **/
                let items = '';

                    let rqsItems = "SELECT id, libelle, tarif, quantite FROM item WHERE command_id='" + req.params.id + "'";
                    Connection.query(rqsItems, (error, result, fields) => {
                        if (!error) {
                            items = result;

                            /** Récupère les infos de la commande */
                            let rqs = "SELECT id, mail, nom, created_at, livraison, montant FROM commande WHERE id='"+req.params.id+"'";
                            Connection.query(rqs, (error, result, fields) => {

                                if(error){
                                    res.status(500).json({
                                        "type": "error",
                                        "error": "500",
                                        "message": error,
                                    });
                                } else {
                                    if(result[0] == null){
                                        res.status(404).json({
                                            "type": "error",
                                            "error": "404",
                                            "message": "ressource non disponible : "+req.params.id,
                                        });
                                    }

                                    if(req.query['embed'] == 'items') {
                                        res.status(201).json({
                                            "type": "ressource",
                                            "commande": result,
                                            "items": items,
                                            "links": {
                                                "items": {
                                                    "href": req.originalUrl+'/items'
                                                },
                                                "self": {
                                                    "href": req.originalUrl
                                                },
                                            }
                                        });
                                    } else {
                                        res.status(201).json({
                                            "type": "ressource",
                                            "commande": result,
                                            "links": {
                                                "items": {
                                                    "href": req.originalUrl+'/items'
                                                },
                                                "self": {
                                                    "href": req.originalUrl
                                                },
                                            }
                                        });
                                    }

                                }
                            });

                        } else {
                            res.status(500).json({
                                "type": "error",
                                "error": "500",
                                "message": error,
                            });
                        }
                    });

            } else {
                res.status(404).json({
                    "type": "error",
                    "error": "404",
                    "message": "Token non fournis dans l'url",
                });
            }
        }
    });
});
router.put('/:id', function(req, res, next) {
    let body = req.body;

    let nom_client = body.nom_client;
    let mail_client = body.mail_client;
    let date_livr = body.date_livr;

    if(nom_client == null || mail_client == null || date_livr == null){
        res.status(404).json({
            "type": 'error',
            "error": 404,
            "message": "Les paramètres entrées ne sont pas bon.",
        });
    } else {
        let rqs = "UPDATE commande SET nom='"+ escapeHtml(nom_client) +"', mail='"+ escapeHtml(mail_client) +"', livraison='"+ escapeHtml(date_livr) +"' WHERE id='"+ req.params.id+"'";
        Connection.query(rqs, (error, result, fields) => {

            if(error){
                res.status(500).json({
                    "type": "error",
                    "error": "500",
                    "message": error,
                });
            } else {
                res.status(204).json({'message': 'NO CONTENT'});
            }
        });
    }
});



router.get('/:id/items', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json;charset=utf-8');

    let rqsExist = "SELECT * FROM commande WHERE id='"+req.params.id+"'";
    Connection.query(rqsExist, (error, result, fields) => {
        //console.log(req.params.id);
        if(error){
            res.status(500).json({
                "type": "error",
                "error": "404",
                "message": error,
            });
        }
    });

    let rqs = "SELECT id, libelle, tarif, quantite FROM item WHERE command_id='"+req.params.id+"'";
    Connection.query(rqs, (error, result, fields) => {
        //console.log(req.params.id);
        if(error){
            res.status(500).json({
                "type": "error",
                "error": "500",
                "message": error,
            });
        } else {
            res.status(201).json({
                "type": "collection",
                "count": result.length,
                "items": result
            });
        }
    });
});


/** Création de commande **/
router.post('/create', function(req, res, next) {
    let body = req.body;

    let nom = req.body.nom;
    let mail = req.body.mail;
    let livraison = JSON.parse(req.body.livraison);
    let date_livr = livraison.date;
    let heure_livr = livraison.heure;
    let items = JSON.parse(req.body.items);

    let date = dateToMysqlFormat(new Date(date_livr+" "+heure_livr+":00"));

    let verif = {
        'nom': nom,
        'mail': mail,
        'livraison': {
            'date': date_livr,
            'heure': heure_livr
        },
        'items': items
    }


    if(verifyDataCreate(verif)){


        let uuid = uuidv4();
        let token = jwt.sign({ foo: 'bar' }, 'commande');

        let rqs = "INSERT INTO commande (`id`, `created_at`, `updated_at`, `livraison`, `nom`, `mail`, `montant`, `token`, `status`) VALUES ('"+ uuid +"', NOW(), NOW(), '"+ date +"', '"+ nom +"', '"+ mail +"', 0, '"+ token +"', 1)";
        Connection.query(rqs, (error, result, fields) => {
            //console.log(req.params.id);
            if(error){
                res.status(500).json({
                    "type": "error",
                    "error": "500",
                    "message": error,
                });
            } else {
                /** Insert items **/
                let montant = 0;
                if(items!==undefined&&items.length!==0){
                    items.forEach((item) => {
                        montant += item.tarif;
                        let v = insertItem(item, uuid);
                    });

                    res.setHeader('Content-Type', 'application/json;charset=utf-8');
                    res.setHeader('Location', '/commandes/'+uuid);
                    res.status(201).json({
                        "commande": {
                            "nom": nom,
                            "mail": mail,
                            "date_livraison": date_livr+heure_livr,
                            "id": uuid,
                            "token": token,
                            "montant": montant
                        }
                    });
                } else{
                    res.status(201).json({
                        "commande": {
                            "nom": nom,
                            "mail": mail,
                            "date_livraison": date_livr+heure_livr,
                            "id": uuid,
                            "token": token,
                            "montant": montant
                        }
                    });
                }
            }
        });

    } else {
        res.status(403).json({
            "type": "error",
            "error": "403",
            "message": "Les données sont fausses ou manquantes",
        });
    }
});





function escapeHtml(text) {
    let map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };

    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}



function insertItem(item, cmd_id){
    let req = "INSERT INTO item('uri', 'libelle', 'tarif', 'quantite', 'command_id') VALUES("+ item.uri +", "+ item.libelle +", "+ item.q +", "+ item.tarif +", "+ cmd_id +")";
    Connection.query(req, (error, result, fields) => {
       if(error){
           return false;
       } else {
           return true;
       }
    });
}


function verifyDataCreate(data){

    const schema = Joi.object().keys({
        nom: Joi.string().min(1).pattern(/^[a-zA-Z0-9]+/).required(),
        mail: Joi.string().email().required(),
        livraison: Joi.object().keys({
            date: Joi.string().required(),
            heure: Joi.string().pattern(/^[0-9]{2}:{1}[0-9]{2}/).required(),
        }),
        items: Joi.array(),
    });


    const res = schema.validate(data);
    const { value, error } = res;
    const valid = error == null;
    if (!valid) {
        return false
    } else {
        return true;
    }
}


function dateToMysqlFormat(date) {
    return date.toISOString().slice(0, 19).replace('T', ' ');
}


module.exports = router;
