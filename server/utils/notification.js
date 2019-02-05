var nodemailer = require('nodemailer');
var xoauth2 = require('xoauth2');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: 'enarcil.rectificadora@gmail.com',
        clientId: '1069797620464-f1plbvuf9h0rdvmcrdrrskuho3kbjnp5.apps.googleusercontent.com',
        clientSecret: 'qYEC67mPDyJZfW3DpHI1Po2m',
        refreshToken: '1/uiFaoHI8mMC2p0bptehIJFwq6hsh5HJ0w7eHJBCsYow',
        accessToken: "ya29.GlvOBC2s3lw3_EblmvZ301QgKCV3OiIY-PWiS9T0qIdbnLeWsazjTS3D3OT0uMhV2-v_0vx05lvLc6PWFLBMXl4kyLWb58a76i0yBV-MIXZtwLCVtMxfMnaYexP-",
    },
});

exports.notificate = function (data, actionToExecute) {
    transporter.sendMail(data, function (error, response) {
        if (error) {
            actionToExecute(error, null);
        } else {
            actionToExecute(null, response.message);
        }
    });
}