var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';


//TODO revemo after all implementation
exports.response = function (data, message, isSuccess) {
    return responseData(data, message, isSuccess);
};

function responseData(data, message, isSuccess) {
    isSuccess = isSuccess == undefined ? true : false;
    if (!isSuccess && data.name == "SequelizeForeignKeyConstraintError") {
        message = "Por favor revisar, item tiene relaciones con otras entidades";
    }
    return { isSuccess: isSuccess, message: message, data: data };
}

exports.formatDate = function (val, format) {
    if (!format)
        return val.split("/")[2] + "/" + val.split("/")[1] + "/" + val.split("/")[0];

    return val.split("/")[2] + "/" + val.split("/")[0] + "/" + val.split("/")[1];
};

exports.getDatesInvoice = function (orderbook, data) {
    return {
        deadline: orderbook.deadline.split("/")[2] + "/" + orderbook.deadline.split("/")[1] + "/" + orderbook.deadline.split("/")[0],
        datecurrent: data.dateregister.split("/")[2] + "/" + data.dateregister.split("/")[1] + "/" + data.dateregister.split("/")[0]
    }
}

exports.isAuthenticate = function (req, res, next) {
    var bearerToken;
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.send(403);
    }
}

exports.encrypt = function (text) {
    var cipher = crypto.createCipher(algorithm, password)
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

exports.decrypt = function (text) {
    var decipher = crypto.createDecipher(algorithm, password)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}

exports.sendResponse = function (res, err, data, message) {
    if (err)
        res.send(responseData(err, err.message, false));
    else
        res.send(responseData(data, message));
}

exports.executeAction = function (response, action) {
    try {
        action();
        response.json(common.sendResponse());
    }
    catch (err) {
        response.status(500);
        response.send(common.sendError(err));
    }
}