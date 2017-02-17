var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');



//User Schema

var UserSchema = mongoose.Schema({
	benutzername: {
		type: String,
		index: true
	},
	password: {
		type: String,
	},
	email: {
		type: String
	},
	name: {
		type: String
	},
	vorname: {
		type: String
	}
});

var User = module.exports = mongoose.model('User', UserSchema);

//Funktionen, die in users.js verwendet werden
module.exports.createUser = function(newUser, callback) {
	bcrypt.genSalt(10, function(error, salt) {
		bcrypt.hash(newUser.password, salt, function(error, hash) {
			newUser.password = hash;
			newUser.save(callback);
		});
	});
};

module.exports.getUserByUsername = function(username, callback) {
	var query = {username: benutzername};
	User.findOne(query, callback);
}

module.exports.comparePassword = function(aPassword, hash, callback) {
	bcrypt.compare(aPassword, hash, function(error, isMatch) {
		if(error) throw error;
		callback(null, isMatch);
	});
}

module.exports.getUserById = function(id, callback) {
	User.findById(id, callback);
}