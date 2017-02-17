#!/usr/bin/nodejs

var app = require('./app');
var debug = require('debug')('my-application');

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
	debug('Express server listening on port ' + server.address().port);
	console.log('Server started on port' + app.get('port'));
});