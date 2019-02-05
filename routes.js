'use strict';

module.exports = function (app) {
	app.use('/users', require('./server/routes/maintenance/users'));
	app.use('/roles', require('./server/routes/maintenance/roles'));
	app.use('/notices', require('./server/routes/maintenance/notices'));
	app.use('/permits', require('./server/routes/maintenance/permits'));
	app.use('/customers', require('./server/routes/center/customers'));
	app.use('/cars', require('./server/routes/center/cars'));
	app.use('/garages', require('./server/routes/center/garages'));
	app.use('/cylinders', require('./server/routes/center/cylinders'));
	app.use('/tickets', require('./server/routes/center/tickets'));
	app.use('/workOrders', require('./server/routes/center/workOrders'));
	app.use('/questions', require('./server/routes/center/questions'));
	app.use('/filterUsers', require('./server/routes/center/filterUsers'));
	app.use('/security', require('./server/routes/security/security'));
	app.use('/procedures', require('./server/routes/query/procedures'));
	app.use('/exportExcel', require('./server/routes/exportExcel'));
};