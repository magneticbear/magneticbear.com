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

app.get ('/', 	  		   			 login 	 	   );
app.get ('/login', 		   		     login 		   );
app.post('/process_login', 			 process_login );
app.get ('/admin/:token',            admin 		   );
app.get ('/client/:token',           client        );
app.get ('/project/:project/:token', project 	   );

function login(req, res, failed)
{
	res.status(200); res.setHeader('Content-Type', 'text/html');
	res.end(HTML_login + (failed == true ? ' FAILED ' : ''));
}
function process_login(req, res)
{
	db.users.findOne({email: req.body.email, password: req.body.password}, 
		function (err, doc)
		{
			if (err)  	    { error  (req, res, err);  return; }
			if (!doc) 	    { login  (req, res, true); return; }

			doc.token = generate_token();
			db.users.save(doc);

			if (doc.admin)  { res.redirect('/admin/'  + doc.token); return; }
			if (!doc.admin) { res.redirect('/client/' + doc.token); return; }
		}
	);
}
function admin(req, res)
{
	db.users.findOne({token: req.params.token}, 
		function(err, doc)
		{
			if (err)  	    { error  (req, res, err);  return; }
			if (!doc) 	    { login  (req, res, true); return; }

			var projects = ''; for(var p = 0; p < doc.projects.length; p++) projects += '<a href="/project/' + doc.projects[p] + '/' + doc.token + '">' + doc.projects[p] + '</a><br>';
			res.status(200); res.setHeader('Content-Type', 'text/html');
			res.end(HTML_admin_panel.toString().replace('{{token}}', doc.token).replace('{{projects}}', projects));

		}
	);

}
function client(req, res)
{
	res.status(200); res.setHeader('Content-Type', 'text/html');
	res.end(HTML_client_panel.toString().replace('{{token}}', req.token));
}
function project(req, res)
{
	db.users.findOne({token: req.params.token}, 
		function(err, doc)
		{
			console.log('post user');
			if (err)  { error  (req, res, err);  return; }
			if (!doc) { login  (req, res, true); return; }

			for(var p = 0; p < doc.projects.length; p++)
			{
				if(req.params.project === doc.projects[p])
				{
					res.status(200); res.setHeader('Content-Type', 'text/html');
					res.end(HTML_project_page.toString().replace('{{token}}', doc.token) + ' project: ' + doc.projects[p]);
					return;
				}
			}
			error(req, res, 'Project was not found, or you do not have access to this project if it exists.'); return;
		}
	);
}
function error(req, res, err)
{
	res.status(500); res.setHeader('Content-Type', 'text/html');
	res.end(HTML_error_page + ' ' + err);
}
function generate_token() { var token_length = 20; var new_token = ''; var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; for(var t = 0; t < token_length; t++) new_token += possible.charAt(Math.floor(Math.random() * possible.length)); return new_token; }
function now() 			  { return new Date().getTime(); }

db.users.remove();
db.projects.remove();
db.log.remove();

db.users.ensureIndex({email:1});
db.users.ensureIndex({token:1});

db.users.save({email: 'abs@mbs.com', password: 'foobar', admin:1, projects: ['idelete', 'scala1']});
db.users.save({email: 'c@mbs.com',   password: 'foobar', admin:0, projects: ['idelete']});

app.listen(port);
console.log('msbweb serving: ' + port);
console.log('mbsweb db:      ' + db_url);