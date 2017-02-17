var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

//GET registrieren
router.get('/register',function(request, response) {
	response.render('register');
});

//anmelden
router.get('/login',function(request, response) {
	response.render('login');
});

//registrieren
router.post('/register', function(request, response) {
	var name = request.body.name;
	var vorname = request.body.vorname;
	var email = request.body.email;
	var benutzername = request.body.benutzername;
	var password = request.body.password;
	var passwordConfirm = request.body.passwordConfirm;
	
	request.checkBody('name', 'Sie muessen ein name geben').notEmpty();
	request.checkBody('vorname', 'Sie muessen Ihre Vorname eingeben').notEmpty();
	request.checkBody('email', 'Sie  muessen eine E-Mail Adresse geben').notEmpty();
	request.checkBody('benutzername','Sie muessen einen Betnuzername eingeben').notEmpty();
	request.checkBody('password', 'Sie muessen ein Passwort geben').notEmpty();
	request.checkBody('passwordConfirm', 'Die Passworten stimmen nicht mit überein').equals(request.body.password);
	
	var errors = request.validationErrors();
	
	if (errors) {
		response.render('register', {
			errors: errors
		});
	}else{
		var newUser = new User({
			name: name,
			vorname: vorname,
			email: email,
			benutzername: benutzername,
			password: password
		});
		
		User.createUser(newUser, function(error, user) {
			if(error) throw error;
			console.log(user);
		});
		
		request.flash('success_msg', 'Sie sind jetzt registriert');
		response.redirect('/users/login');
	}
});

//LocalStrategy: Benutzername empfangen, und 'match' mit dem vom User 
//gegebenen Benutzername
//dasgleich mit Passwort
passport.use(new LocalStrategy(
	function(username, password, done) {
		User.getUserByUserName(username, function(error, user) {
			if (error) throw error;
			if(!user) {
				return done(null, false, {message: 'Unbekannter Benutzer'});
			}
			
			User.comparePassword(password, user.password, function(error, isMatch) {
				if (error) throw error;
				if(isMatch) {
					return  done(null, user);
				} else {
					return done(null, false, {message: 'Falsche Passwort'});
				}
			});
		});
	}));
	
passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.getUserById(id, function(error, user) {
		done(error, user);
	});
});
//anmelden
router.post('/login',
	//localDatabase
	passport.authenticate('local', {successRedirect: '/', 
									failureRedirect: '/users/login',
									failureFlash: true}), 
	function(request, response) {
		response.redirect('/');
	});
	

module.exports = router;
