var port	 = process.env.PORT || 22324;
var fs		 = require('fs');
var db_url	 = process.env.MONGOHQ_URL || 'mbsweb';
var db		 = require('mongojs').connect(db_url, ['projects', 'log']);
var express	 = require('express');
var app		 = express();

var html_cp  			  = fs.readFileSync('html/cp.html',  			  'utf8');
var html_wrap_stage_entry = fs.readFileSync('html/wrap_stage_entry.html', 'utf8');
var html_wrap_feed_entry  = fs.readFileSync('html/wrap_feed_entry.html',  'utf8');
var html_500 			  = '<html><b>500</b> DB IS DOWN!</html>';
var html_404 			  = '<html><b>404</b> PAGE NOT FOUND!</html>';

app.use(express.bodyParser());

app.get('/cp/:project', serve_cp);

function serve_cp(req, res)
{
	// todo: validate req.params.project before using

	db.projects.findOne({project_url: req.params.project}, 
		function(err, doc)
		{

				 if(err)  serve(req, res, 500, html_500, new Date().getTime());
			else if(!doc) serve(req, res, 404, html_404, new Date().getTime());
			else
			{
				var content  = 'HIIIB';
				var to_serve = html_cp.replace('{{content}}', content);
				serve(req, res, 200, to_serve, new Date().getTime());
			}
		}
	);
}

function serve(req, res, http_response_code, html_response, response_timer)
{
	res.status(http_response_code);
	res.setHeader('Content-Type', 'text/html');
  	res.setHeader('Content-Length', html_response.length);
  	res.end(html_response);

	var entry = {method: req.method, endpoint: req.url, http_response_code: http_response_code, response_time: new Date().getTime() - response_timer};
  	db.log.save({date: new Date().getTime(), entry: entry});
  	console.log(entry);
}

db.projects.ensureIndex({project_url:1});

app.listen(port);
console.log('msbweb serving: ' + port);
console.log('mbsweb db:      ' + db_url);