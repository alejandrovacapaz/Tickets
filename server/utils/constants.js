module.exports = Object.freeze({
    MESSAGE_SAVE: 'Se registro correctamente',
    MESSAGE_UPDATE: 'Se actualizo correctamente',
    MESSAGE_DELETE: 'Se elimino correctamente',
    MESSAGE_SAVE_NOTIFICATION: 'Se registro y notifico correctamente !',
    EMAIL_TEMPLATE:"<body style='background: #FAFAFA; color: #333333;font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif; font-size: 100%; line-height: 1.6; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: none; width: 100% !important; height: 100%; margin: 0; padding: 0;'>" +
      "<div style=' padding: 20px; background-color: #f6f6f6;'>"+
      "<div style='margin:20px;background-color:white;padding: 13px;'>"+
      "<b>Saludos,</b><br><br>Seniores <b>{garage}</b> ,  Tenemos el agrado de informale que el cliente:  <br>"+
      "<h1 style='font-size: 36px;line-height: 1.2;color: #000;font-weight: 200;margin: 40px 0 10px;padding: 0;'>"+
      "{client} - Nro celular {cellPhone}</h1>"+
      "<br><p >Fue remitido a su taller, para el mantenimiento de su equipo de gas del vehiculo </p>"+
      "<h3 style=\"font-family: 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif; font-size: 28px; line-height: 1.2; color: #000; font-weight: 200; margin: 40px 0 10px; padding: 0;\">"+
      " {carData} <br></h3>"+            
      "<p>Saludos, el CLUB del GNV</p></div></div></body>"
});