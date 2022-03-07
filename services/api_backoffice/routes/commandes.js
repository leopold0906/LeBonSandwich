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

           /** Pagination  **/
           if(req.query['page']!==null && req.query['page']!==undefined){
               let pag = req.query['page'];
               let idd, idf;

               if(pag < 1) pag = 1;
               if((pag * 10) >= cmds.length){
                   if(cmds.length > 10) {
                        idd = cmds.length - 11;
                        idf = cmds.length - 1;
                   } else {
                       idd = 0;
                       idf = cmds.length - 1;
                   }
               } else {
                   idd = pag*10 - 10;
                   idf = pag*10 - 1;
               }

               /**

               cmds = cmds.slice(idd, idf);
           }


           res.status(203).json({
               "type": "collection",
               "count": result.length,
               "size": 10,
               "commandes": cmds
           });
       }
    });
});



module.exports = router;
