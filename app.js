var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var routes = require('./routes/index');
var methodOverride = require('method-override');
var session = require('express-session');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('Quiz 2015'));
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(partials());

app.use(function  (req,res,next) {
    if(!req.path.match(/\/login|\/logout/))   {
        req.session.redir = req.path;
    }

    res.locals.session = req.session;
    next();
});


//middleware auto-logout
app.use(function  (req,res,next) {
    if(res.locals.session.user)   {        
        // tiempo en segundos        
        var tiempo = new Date().getTime() / 1000;
        var tiempoPrevio = res.locals.session.user.ultimaActualizacion ;
        var inactivo = tiempo - tiempoPrevio; 
        var segundosInactividadPermitido = 120;
        if(inactivo > segundosInactividadPermitido )
            {                
                res.locals.session.user.cerrarSesion=true;
                res.locals.session.errors = [{"message":"La session ha expirado por inactividad. "}];

            }
            else{

                res.locals.session.user.cerrarSesion=false;
                res.locals.session.user.ultimaActualizacion = tiempo;
                
            }

        //console.log(res.locals.session);    
    }


    next();    

});

app.use('/', routes);

// catch 404 and forward to error handler
/*delete funciono al comentar estas lineas
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
*/

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors:[]
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors:[]
    });
});


module.exports = app;
