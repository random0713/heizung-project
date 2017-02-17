var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');

var url = 'mongodb://localhost:27017/temperature';




//var randomTemperature = (Math.random() * 100).toFixed(2);
var defaultTemperature = 30.45;





router.get('/', function(request, response) {
	
	response.render('index', {
	});
	
});

router.get('/get-data', function(request, response, next) {
	var temperatureArray = [{
		id: 1, temperature: parseFloat(defaultTemperature)
	}];
	mongo.connect(url, function(error, db) {
		assert.equal(null, error);
		var cursor = db.collection('temperature-data').find();
		cursor.forEach(function(doc, error) {
			assert.equal(null, error);
			temperatureArray.push(doc);
		}, function() {
			db.close();
			res.render('index', {items: temperatureArray});
		});
	});
});


//neue temperatr hinzufügen
router.post('/', function(request,response) {
	var item = { newTemperature: request.body.newTemperature};
	
	mongo.connect(url, function(error, db) {
		assert.equal(null, error);
		db.collection('temperature-data').insertOne(item, function(error, result) {
			assert.equal(null, error);
			db.close();
		});
	});
});

//neue Temperatur einzusetzen
router.post('/', function(request, response) {
	var item = { newTemperature: request.body.newTemperature};
	var id = request.body.id;
	
	mongo.connect(url, function(error, db){
		assert.equal(null, error);
		db.collection('temperature-data').updateOne({"id": objectId(id)}, {$set: item}, function(error, result)  {
			assert.equal(null, error);
			console.log('updated');
			db.close();
		});
	});
});
	

module.exports = router;

