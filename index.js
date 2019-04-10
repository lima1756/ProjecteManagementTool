const express = require('express');

const DBController =  require('./libraries/DBController');
const ErrorManager = require('./libraries/ErrorManager')

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
    next(new ErrorManager.NotFoundError('Page not found'));
  });

  /// error handlers

  // development error handler
  if (!isProduction) {
    app.use(function(err, req, res, next) {
      console.log(err.stack);

      res.status(err.status);

      res.json({'errors': {
        message: err.message,
        error: err
      }});
    });
  }
  else
  {
    // production error handler
    app.use(function(err, req, res, next) {
      res.status(err.status);
      res.json({'errors': {
        message: err.message,
        error: {}
      }});
    });
  }

  // Start server, listen to port 300 in development
  var server = app.listen( process.env.PORT || 3000, function(){
    console.log('Listening on port ' + server.address().port);
  });
}
