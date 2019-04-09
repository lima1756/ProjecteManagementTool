const express = require('express');
const DBController =  require('./DBController');

new DBController(startServer);

function startServer(DBInstance){
  Object.freeze(DBInstance);

  const isProduction = process.env.NODE_ENV === 'production';

  const app = express();


  app.use(express.json());


  if(!isProduction){
      // TODO: app.use test packages and error handlers 
      
      
  }

  app.use(require('./routes'));

  /// catch 404 and forward to error handler
  app.use(function(req, res, next) {
    let err = new Error('Page not found');
    err.status = 404;
    next(err);
  });

  /// error handlers

  // development error handler
  if (!isProduction) {
    app.use(function(err, req, res, next) {
      console.log(err.stack);

      res.status(err.status || 500);

      res.json({'errors': {
        message: err.message,
        error: err
      }});
    });
  }

  // production error handler
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({'errors': {
      message: err.message,
      error: {}
    }});
  });

  // Start server, listen to port 300 in development
  var server = app.listen( process.env.PORT || 3000, function(){
    console.log('Listening on port ' + server.address().port);
  });
}
