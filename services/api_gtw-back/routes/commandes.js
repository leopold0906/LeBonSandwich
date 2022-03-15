let express = require('express');
const Connection = require("../config/connection");
let router = express.Router();

router.get('/', function(req, res, next){

    axios
        .get('http://localhost:5554'+req.url, {
          body: req.body
        })
        .then(result => {
            res.send(result);
        })
        .catch(error => {
            res.status(500).json(error500('Internal Server Error, api suivie de commande'));
        });
});


function error500(error){
    return {
        "type": "error",
        "error": "500",
        "message": error
    };
}



module.exports = router;
