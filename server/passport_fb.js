var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

exports.config = function(passport){

  var users = {};

  passport.serializeUser(function(user, done) {
    users[user.id] = user;
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    // User.findById(id, function(err, user) {
    var user = users[id];
    delete users[id];
    done(err, user);
    // });
  });

  passport.use(new FacebookStrategy({
      clientID: '330011970489603',
      clientSecret: 'dcdaa7254bb9040a81e544d05e92c6f5',
      callbackURL: "http://localhost:8888/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      console.log(profile);
      // User.findOrCreate(..., function(err, user) {
        // if (err) { return done(err); }
        return done(null, profile);
      // });
    }
  ));

};
