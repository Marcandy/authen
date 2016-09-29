const express = require('express');
const session = require('express-session');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const config = require('./config.js');
const cors = require('cors');

const app = express();
const port = 3000;
app.use( cors({
  origin: 'http://localhost:3000'
}) );

app.use( session( { secret: config.mySecrets.secret } ) );
app.use( passport.initialize() );
app.use( passport.session() );
app.use( express.static(`${ __dirname }/public/`));

passport.use(new FacebookStrategy({
  clientID: config.facebook.clientID,
  clientSecret: config.facebook.secret,
  callbackURL: config.facebook.cbURL
}, function(token, refreshToken, profile, done) {
  return done(null, profile);
}));

app.get( '/auth/facebook', passport.authenticate( 'facebook' ) );
app.get( '/auth/facebook/callback', passport.authenticate( 'facebook', {
	successRedirect: '/#/me',
	failureRedirect: '/login'
} ) );

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// app.get( '/#/me', (req, res) => {
// 	res.send( req.user );
// } );

app.get('/user', (req, res) => {
	res.send(req.user);
})

app.listen(port, () => {
	console.log(`Listening on port ${ port }`);
});
