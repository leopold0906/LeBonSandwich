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

           let size = 10;

           /** Pagination  **/
           if(req.query['page']!==null && req.query['page']!==undefined){
               let pag = parseInt(req.query['page']);
               let idd, idf;

               /** Size **/
               if(req.query['size'] !== null && req.query['size'] !== undefined)
                   size = parseInt(req.query['size']);

               if(pag < 1) pag = 1;
               if((pag * size) >= cmds.length){
                   if(cmds.length > size) {
                        idd = cmds.length -size -1;
                        idf = cmds.length - 1;
                   } else {
                       idd = 0;
                       idf = cmds.length - 1;
                   }
               } else {
                   idd = pag*size - size;
                   idf = pag*size;
               }


               cmds = cmds.slice(idd, idf);

               res.status(203).json({
                   "type": "collection",
                   "count": result.length,
                   "size": size,
                   "links": {
                       "next": {
                           "href": "/commandes/?page="+ parseInt(pag+1) +"&size="+ size
                       },
                       "prev": {
                           "href": "/commandes/?page="+ parseInt(pag-1) +"&size="+ size
                       },
                       "last": {
                           "href": "/commandes/?page="+ Math.ceil(result.length/size) +"&size="+ size
                       },
                       "first": {
                           "href": "/commandes/?page=1&size="+ size
                       }
                   },
                   "commandes": cmds
               });
           }
            else {
               res.status(203).json({
                   "type": "collection",
                   "count": result.length,
                   "size": size,
                   "commandes": cmds
               });
           }



       }
    });
});



module.exports = router;
