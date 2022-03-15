const axios = require('axios');

module.exports = function(req, res, next){
    if(req.url === '/auth/signin' || req.url === '/auth/signup'){

        if(typeof req.headers.authorization !== undefined){
            let token = req.headers.authorization.split(' ')[1];

            axios
                .post('http://localhost:3333/auth/check', {
                    body: {
                        'token': token
                    }
                })
                .then(result => {
                    if(result.status !== 200){
                        res.status(result.status).json(result.data);
                    } else {
                        if(req.url.includes('/commandes') && result.data.role === 'admin')
                            next();
                        else
                            res.status(401).json({'error': "Not Authorized"})
                    }
                })
                .catch(error => {
                   res.status(500).json({'error': 'Internal Server Error, api auth'});
                });

        } else res.status(500).json({'error': "Not Authorized"});

    } else {
        next();
    }
}