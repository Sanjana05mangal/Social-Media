const req = require('express/lib/request');
const passport= require('passport');

const LocalStrategy= require('passport-local').Strategy;
const User= require('../models/user');
// authentication
passport.use(new LocalStrategy({
   usernameField: 'email',
   passReqToCallback: true
    },
  function(req, email, password, done){
      //find a user and establish the identity
      User.findOne({email: email}, function(err,user){
         if(err){
            req.flash('error', err);
        return done(err);
         }
         if( !user || user.password != password){
            req.flash('error', 'Invalid username/ password');
            return done(null, false);
          }
         
         return done(null,user); 
      });
  }
));
  

// serializing the user to decide which key is to be kept in the cookie
passport.serializeUser(function(user,done){
   done(null, user.id);
});
// deserializing user from the keys in the cookies  
passport.deserializeUser(function(id,done){
       User.findById(id, function(err,user){
         if(err)
         {console.log('error in finding user --> Passport');
         return done(err);  }
         return done(null, user);
    });
});

// check if user is authenticated
passport.checkAuthentication= function(req, res, next){
   if (req.isAuthenticated()){
               return next();
   }
   return res.redirect('/users/sign-in');
}
passport.setAuthenticatedUser = function(req, res, next){
   if (req.isAuthenticated()){
      // req.user contains the current user's sign in cookies
      res.locals.user = req.user;
   }
   next();
}

module.exports= passport;
