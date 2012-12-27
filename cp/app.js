var port	 = process.env.PORT || 80;
var fs		 = require('fs');
var db_url	 = process.env.MONGOHQ_URL || 'mbsweb';
var db		 = require('mongojs').connect(db_url, ['projects', 'log']);
var md 		 = require("node-markdown").Markdown;
var express	 = require('express');
var app		 = express();

app.use(express.bodyParser());

var HTML_login 	 	  = fs.readFileSync('login.html'	   );
var HTML_admin_panel  = fs.readFileSync('admin_panel.html' );
var HTML_client_panel = fs.readFileSync('client_panel.html');
var HTML_project_page = fs.readFileSync('project_page.html');

app.get ('/', 	  		   login);
app.get ('/login', 		   login);
app.post('/process_login', process_login);


function login(req, res)
{	
	res.status(200); res.setHeader('Content-Type', 'text/html');
	res.end(HTML_login);
}
function process_login(req, res)
{
	res.status(200); res.setHeader('Content-Type', 'text/html');
	res.end(HTML_admin_panel);
}
function now() { return new Date().getTime(); }

db.projects.ensureIndex({project_url:1});

//delete_project('test');
//create_new_project('test', 'Test Project');

app.listen(port);
console.log('msbweb serving: ' + port);
console.log('mbsweb db:      ' + db_url);