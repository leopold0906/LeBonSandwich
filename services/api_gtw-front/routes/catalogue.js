let express = require('express');
const axios = require('axios');
let router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json;charset=utf-8');

    axios
        .get('https://directus:8055/items/Sandwich',)
        .then(result => {
            res.status(result.status).json(result.data);
        })
        .catch(error => {
            if(error.response)
                res.status(error.response.status).json(error.response.data);
            else
                res.status(500).json("Internal server error, directus");
        });

});



module.exports = router;