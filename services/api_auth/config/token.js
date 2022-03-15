let tokens = [];

function checkToken(tkn, login){
    let res = tokens[login];

    let now = new Date();

    if(res['date_expired'] < now){
        if(res.token === tkn){
            return 'valid';
        } else {
            return 'invalid';
        }
    } else {
        tokens[login] = null;
        return 'expired';
    }
}


function addToken(login, token, date, uuid){
    tokens[login] = JSON.parse({"token": token, "date_expired": date, "uuid": uuid});
}

module.exports = checkToken, addToken;