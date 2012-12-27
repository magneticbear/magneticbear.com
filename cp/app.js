var port	 = process.env.PORT || 80;
var fs		 = require('fs');
var db_url	 = process.env.MONGOHQ_URL || 'mbsweb';
var db		 = require('mongojs').connect(db_url, ['users', 'projects', 'log']);
var md 		 = require("node-markdown").Markdown;
var express	 = require('express');
var app		 = express();

app.use(express.bodyParser());

var HTML_login 	 	  = fs.readFileSync('login.html'	   );
var HTML_admin_panel  = fs.readFileSync('admin_panel.html' );
var HTML_client_panel = fs.readFileSync('client_panel.html');
var HTML_project_page = fs.readFileSync('project_page.html');
var HTML_error_page   = fs.readFileSync('error_page.html'  );

app.get ('/', 	  		   login);
app.get ('/login', 		   login);
app.post('/process_login', process_login);


function login(req, res, failed)
{	
	res.status(200); res.setHeader('Content-Type', 'text/html');
	res.end(HTML_login + (failed == true ? ' FAILED ' : ''));
}
function process_login(req, res)
{
	db.users.findOne({email: req.body.email}, 
		function (err, doc)
		{
			if (err)  	    { error  (req, res, err);  return; }
			if (!doc) 	    { login  (req, res, true); return; }
			if (doc.admin)  { admin  (req, res); 	   return; }
			if (!doc.admin) { client (req, res);       return; }
		}
	);
}
function admin(req, res)
{
	res.status(200); res.setHeader('Content-Type', 'text/html');
	res.end(HTML_admin_panel);
}
function client(req, res)
{
	res.status(200); res.setHeader('Content-Type', 'text/html');
	res.end(HTML_client_panel);
}
function error(req, res, err)
{
	res.status(500); res.setHeader('Content-Type', 'text/html');
	res.end(HTML_error_page + ' ' + err);
}
function now() { return new Date().getTime(); }


db.users.remove();
db.projects.remove();
db.log.remove();

db.users.ensureIndex({email:1});


db.users.save({email: 'abs@mbs.com', password: 'foobar', admin:1});
db.users.save({email: 'c@mbs.com', password: 'foobar', admin:0});

app.listen(port);
console.log('msbweb serving: ' + port);
console.log('mbsweb db:      ' + db_url);