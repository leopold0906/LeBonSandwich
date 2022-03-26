let express = require('express');
let router = express.Router();
let axios = require('axios');
const querystring = require("querystring");




router.get('*', function(req, res, next){

    axios
        .get('http://api_prs-cmd:3000/commandes'+req.url, {
            body: req.body
        })
        .then(result => {
            res.status(result.status).json(result.data);
        })
        .catch(error => {
            if(error.response)
                res.status(error.response.status).json(error.response.data);
            else
                res.status(500).json("Internal server error, api prise de commande");
        });
});


router.post('/create', function(req, res, next){

    axios
        .post('http://api_prs-cmd:3000/commandes/create',
            querystring.stringify({
                "nom": req.body.nom,
                "mail": req.body.mail,
                "livraison": req.body.livraison,
                "items": req.body.items
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
        .then(result => {
            res.status(result.status).json(result.data);
        })
        .catch(error => {
            if(error.response)
                res.status(error.response.status).json(error.response.data);
            else
                res.status(500).json(error);
        });
});



module.exports = router;
