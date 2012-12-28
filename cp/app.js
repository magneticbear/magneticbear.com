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

app.get ('/', 	  		   			 	 			  login 	 	 );
app.get ('/login', 		   		     	 			  login 		 );
app.post('/process_login', 			 	 			  process_login  );
app.get ('/admin/:token',            	 			  admin 		 );
app.get ('/admin/:extra/:token',         			  admin          );
app.get ('/client/:token',           	 			  client         );
app.get ('/project/:project/:token', 	 			  project 	     );
app.post('/admin/new_project/:token', 	 			  new_project    );
app.get ('/admin/delete_project/:project_url/:token', delete_project );
app.post('/admin/new_user/:token', 		 			  new_user		 );
app.post('/admin/delete_user/:token',    			  delete_user	 );
app.post('/admin/modify_user/:token',    			  modify_user	 );

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
	authorize_admin(req, res, 
		function(req, res, usr)
		{
			db.projects.find({},
				function(err, projects)
				{
					if (err) { error  (req, res, err);  return; }
					var project_html = ''; 
					for(var p = 0; p < projects.length; p++) 
					{	
						project_html += '<a href="/project/' + projects[p].url + '/' + usr.token + '">' + projects[p].url + '</a>';
						project_html += '<a href="/admin/delete_project/' + projects[p].url + '/' + usr.token +'">Delete</a><br>';
					}
					res.status(200); res.setHeader('Content-Type', 'text/html');
					res.end((req.params.extra ? req.params.extra + '<br><br>' : '') + HTML_admin_panel.toString().replace(/\{\{token\}\}/g, usr.token).replace('{{projects}}', project_html));
				}
			);		
		}
	);
}
function client(req, res)
{
	authorize_client(req, res,
		function(req, res, usr)
		{
			var projects = ''; for(var p = 0; p < doc.projects.length; p++) projects += '<a href="/project/' + doc.projects[p] + '/' + doc.token + '">' + doc.projects[p] + '</a><br>';
			res.status(200); res.setHeader('Content-Type', 'text/html');
			res.end(HTML_client_panel.toString().replace(/\{\{token\}\}/g, doc.token).replace('{{projects}}', projects));
		}
	);
}
function project(req, res)
{
	authorize_client(req, res,
		function(req, res, usr)
		{
			db.projects.findOne({url: req.params.project, users: usr.email}, 
				function(err, doc)
				{
					if(err)  { error (req, res, err);  																				  return; }
					if(!doc) { error (req, res, 'Attempted to access a project that does not exist, or you don\'t have access to.');  return; }
					res.status(200); res.setHeader('Content-Type', 'text/html');
					res.end(HTML_project_page.toString().replace('{{token}}', usr.token).replace('{{upnav}}', '<a href="/' + (usr.admin ? 'admin' : 'client') + '/' + usr.token + '">' + (usr.admin ? 'Admin' : 'Client') + ' Panel</a>') + ' project: ' + req.params.project);
					return;
				}
			);
		}
	);
}
function new_project(req, res)
{
	authorize_admin(req, res, 
		function(req, res, usr)
		{
			db.projects.findOne({url: req.body.project_url},
				function(err, doc)
				{
					if(err) { error (req, res, err);  									   return; }
					if(doc) { error (req, res, 'A project already exists with that url.'); return; }
					db.projects.save({url: req.body.project_url, filler: req.body.filler, users: ['abs@mbs.com']}, 
						function(err)
						{
							if(err) { error (req, res, err); return; }
							res.redirect('/admin/' + encodeURI('Successfully Created: ' + req.body.project_url) + '/' + usr.token);
						}
					);
				}
			);
		}
	);
}
function delete_project(req, res)
{
	authorize_admin(req, res, 
		function(req, res, usr)
		{
			db.projects.findOne({url: req.params.project_url},
				function(err, doc)
				{
					if(err)  { error (req, res, err);  													return; }
					if(!doc) { error (req, res, 'Attempted to delete a project that does not exist.');  return; }
					db.projects.remove({url: req.params.project_url}, 
						function(err)
						{
							if(err) { error (req, res, err); return; }
							res.redirect('/admin/' + encodeURI('Successfully Deleted: ' + req.params.project_url) + '/' + usr.token);
						}
					);
				}
			);
		}
	);
}
function new_user(req, res)
{
	authorize_admin(req, res, 
		function(req, res, usr)
		{
			db.users.findOne({email: req.body.email},
				function(err, doc)
				{
					if(err) { error (req, res, err);  													    return; }
					if(doc) { error (req, res, 'Attempted to create a user with an email already in use.'); return; }
					console.log(req.body.admin);
					db.users.save({email: req.body.email, admin: (req.body.admin === 'on' ? 1 : 0)}, 
						function(err)
						{
							if(err) { error (req, res, err); return; }
							res.redirect('/admin/' + encodeURI('Successfully Added: ' + req.body.email + (req.body.admin === 'on' ? ' (with administrator priviledges)' : ' ') + '<br>When they first attempt to login, the password they enter will become the password for their account.') + '/' + usr.token);
						}
					);
				}
			);
		}
	);
}
function delete_user(req, res)
{
	authorize_admin(req, res, 
		function(req, res, usr)
		{
			
		}
	);
}
function modify_user(req, res)
{
	authorize_admin(req, res, 
		function(req, res, usr)
		{
			
		}
	);
}
function authorize_admin(req, res, callback)
{
	db.users.findOne({token: req.params.token}, 
		function(err, doc)
		{
			if (err)  	    { error  	 (req, res, err);  return; }
			if (!doc) 	    { login  	 (req, res, true); return; }
			if (!doc.admin) { bad_access (req, res);       return; }
			if (doc.admin)  { callback	 (req, res, doc);  return; }
		}
	);
}
function authorize_client(req, res, callback)
{
	db.users.findOne({token: req.params.token}, 
		function(err, doc)
		{
			if (err)  { error  	 (req, res, err);  return; }
			if (!doc) { login  	 (req, res, true); return; }
			if (doc)  { callback (req, res, doc);  return; }
		}
	);
}
function bad_access(req, res)
{
	error(req, res, 'Page does not exist, or you do not have the authorization to view it.');
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

db.users.save({email: 'abs@mbs.com', password: 'foobar', admin:1});
db.users.save({email: 'c@mbs.com',   password: 'foobar', admin:0});

db.projects.save({url: 'idelete', filler: 'LOREM IPSUM ISENDSUM IDELETESUM', users: ['abs@mbs.com', 'c@mbs.com']});
db.projects.save({url: 'scala1',  filler: 'LOREM IPSUM SCALUM ONEUM' , 		 users: ['abs@mbs.com'			   ]});

app.listen(port);
console.log('msbweb serving: ' + port);
console.log('mbsweb db:      ' + db_url);