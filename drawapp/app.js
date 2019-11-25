var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(function(req, res, next)
{
	next(createError(404));
});


app.use(function(err, req, res, next)
{
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;

process.env.port = 5000;



var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function(request, response)
{
});
var clients = [];


server.listen(1337, function() { });

wsServer = new WebSocketServer(
{
	httpServer: server
});

wsServer.on('request', function(request)
{
	var connection = request.accept(null, request.origin);
	clients.push(connection);

	connection.on('message', function(message)
	{
		console.log("Message", message);
		if (message.type == "utf8")
		{
			clients.forEach(e => {e.send(message.utf8Data);});
		}
		else
		{
			console.log(message.type);
		}
	});

	connection.on('close', function(connection)
	{
		console.log("Closing", connection);
	});
});