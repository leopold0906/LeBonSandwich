let express = require('express');
const axios = require('axios');
let router = express.Router();

const {checkToken, addToken} = require("../config/token");

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json;charset=utf-8');

    res.status(500).json({
        "type": "error",
        "error": "500",
        "message": error,
    });

});


router.post('/signin', function(req, res, next) {

    let login, pswwd;

    if(req.headers.authorization) {
        const base64Credentials = req.headers.authorization.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        [login, pswwd] = credentials.split(':');
    } else {
        res.status(401).json(error401('Missing credential'));
    }

    axios
        .post('http://localhost:3333/auth/signin', {
            body: {
                'login': login,
                'pswwd': pswwd
            }
        })
        .then(result => {
            res.send(result);
        })
        .catch(error => {
            res.status(500).json(error500('Internal Server Error, api auth'));
        });

});





function error401(error){
    return {
        "type": "error",
        "error": "401",
        "message": error
    };
}

function error500(error){
    return {
        "type": "error",
        "error": "500",
        "message": error
    };
}


module.exports = router;