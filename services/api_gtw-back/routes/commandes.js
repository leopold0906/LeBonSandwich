let express = require('express');
let router = express.Router();
let axios = require('axios');

router.get('/', function(req, res, next){
    console.log(req.url);
    axios
        .get('http://api_sv-cmd:3000'+req.url, {
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
