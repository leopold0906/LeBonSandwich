let express = require('express');
const Connection = require("../config/connection");
let router = express.Router();

router.get('/', function(req, res, next){
    res.setHeader('Content-Type', 'application/json;charset=utf-8');

    let rq = "";

    if(req.query['s'] !== null && req.query['s'] !== undefined){
        rq = "SELECT id, nom, created_at, livraison, status FROM commande WHERE status="+ req.query['s'] +" ORDER BY livraison ASC";
    } else {
        rq = "SELECT id, nom, created_at, livraison, status FROM commande ORDER BY livraison ASC";
    }

    console.log(req.query['s']);

    Connection.query(rq, (error, result, fields) => {
       if(error){
           res.status(500).json({
               "type": "error",
               "error": "500",
               "message": error,
           });
       } else {
           let cmds = [];
           /** Gestion du tableau de commandes **/
           result.forEach((cmd) => {
               let json = ({
                   "commande": cmd,
                   "links": {
                       "self": {
                           "href": "/commandes/" + cmd.id + "/",
                       }
                   }
               });

              cmds.push(json);
           });

           res.status(203).json({
               "type": "collection",
               "count": result.length,
               "commandes": cmds
           });
       }
    });
});



module.exports = router;
