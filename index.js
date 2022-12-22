const express= require('express');
const env = require('./config/environment');
const logger= require('morgan');

const cookieParser= require('cookie-parser');
const app = express();
require('./config/view-helpers')(app);
const port= 8000;
const expresslayouts= require('express-ejs-layouts');
const db= require('./config/mongoose');
const session= require('express-session');
const passport= require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportgoogle = require('./config/passport-google-oauth2-strategy');
const MongoStore= require('connect-mongo');
const sassMiddleware = require('node-sass-middleware');

const flash = require('connect-flash');
const customMware = require('./config/middleware');

// chat server to be used with socket.io

const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('Chat server is listening on port 5000');
const path = require('path');

if(env.name=='development'){
app.use(sassMiddleware({
  src: path.join(__dirname, env.asset_path, 'scss'),
  dest: path.join(__dirname, env.asset_path, 'css'),
  
  debug: true,
  outputStyle: 'extended',
   prefix: '/css'
}));
}
app.use(express.urlencoded());
app.use(cookieParser());

app.use(express.static(env.asset_path));
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(logger(env.morgan.mode, env.morgan.options));
app.use(expresslayouts);
 app.set('layout extractStyles', true);
 app.set('layout extractScripts', true);
// use express router

//set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');
// mongostore is used to store session cookies in db
// app.use(session({
//    name: 'codeial',
//    // todo change the secret before deployment
//    secret: 'blahsomething',
//    saveUninitialized: false,
//    resave: false,
//    cookie: {
//        maxAge: (1000*60*100)
//    },
//    store: MongoStore.create({
//     mongoUrl: db._connectionString,
//     autoRemove: 'disabled',
//   },function (err) {
//     console.log.log(err || 'connect mongo setup ok')
//   })
// }));
app.use(session({

  name:'codeial',
  //TODO change the secret before deployement in the production mode
  secret: env.session_cookie_key,
  resave:false,
  cookie:{
      maxAge: (1000*60*100)
  },   
  store: MongoStore.create(
      {
          mongoUrl: 'mongodb://localhost/codeial_development',
          autoRemove: 'disabled'
      }
  ),
  saveUninitialized: false
   
}));

 app.use(passport.initialize());
 app.use(passport.session());
 app.use(passport.setAuthenticatedUser);

 app.use(flash());
 app.use(customMware.setFlash);
 app.use('/', require('./routes'));
 app.listen(port, function(err){
 if(err){
     console.log(`Error: ${err}`);
 }
 console.log(`Server is running on port: ${port}`);
});