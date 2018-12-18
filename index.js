/*  EXPRESS SETUP  */

const express = require('express');
const app = express();
var fs = require("fs");

app.get('/', (req, res) => res.sendFile('index.html', { root : __dirname}));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

const port = process.env.PORT || 3000;
app.listen(port , () => console.log('App listening on port ' + port));

/*  PASSPORT SETUP  */

const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

//Authentication handling
app.get('/success', function (req, res) {
   res.render('../main.html', { dat: " "}, function(err, html) {
      res.send(html);
   });
})
app.get('/error', (req, res) => res.send("error logging in"));

//Show JSON
app.get('/search', function (req, res) {
   fs.readFile( __dirname + "/" + "pokeweakness.json", 'utf8', function (err, data) {
      if (err) {
         res.send('error');
      }
      var pokeweakness = JSON.parse(data);
      var pokemon = pokeweakness["pokemon" + req.query.pokeid]
      res.render('../main.html', { dat: JSON.stringify(pokemon)}, function(err, html) {
        res.send(html);
      })
   });
})

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

/*  FACEBOOK AUTH  */

const FacebookStrategy = require('passport-facebook').Strategy;

const FACEBOOK_APP_ID = '2243086945949265';
const FACEBOOK_APP_SECRET = '0f6ead5631eedf47005bb412172fbd13';

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
      return cb(null, profile);
  }
));

app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/error' }),
  function(req, res) {
    res.redirect('/success');
});
