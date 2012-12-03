var port			= process.env.PORT || 80;
var fs				= require('fs');
var db_url			= process.env.MONGOHQ_URL || 'mbsweb';
var db				= require('mongojs').connect(db_url, ['projects', 'log']);
var express			= require('express');
var app				= express();

var html_global_prefix  = fs.readFileSync('html/global_prefix.html',  'utf8');
var html_global_postfix = fs.readFileSync('html/global_postfix.html', 'utf8');
var html_500            = '<html><b>500</b> DB IS DOWN!</html>';
var html_404            = '<html><b>404</b> PAGE NOT FOUND!</html>';

app.use(express.bodyParser());

app.get('/cp/:project', serve_cp);

db.projects.save(
	{
		project_url:  'test',

		project_name: 'Test Project', 
		
		stage_completions: 
		{
			pre: 						 0.0,
			design: 	 				 0.1,
			development: 				 0.5,
			testing: 					 0.3,
			make_money_money_make_money: 1.0
		},

		feed:
		[
			{
				date: 	  new Date().getTime(),
				markdown: '## THIS SHOULD BE BIG',
				tags:
				[
					'stage_pre',
					'stage_design',
					'mo@magneticbear.com'
				]
			},
			{
				date: 	  new Date().getTime() - 1000,
				markdown: '#### THIS SHOULD BE LESS BIG',
				tags:
				[
					'stage_pre',
					'stage_design',
					'mo@magneticbear.com'
				]
			},
			{
				date: 	  new Date().getTime() - 4000,
				markdown: 'THIS SHOULD BE normal BIG',
				tags:
				[
					'stage_pre',
					'stage_design',
					'mo@magneticbear.com'
				]
			},
			{
				date: 	  new Date().getTime() - 402000,
				markdown: 'This markdown will automatically be converted to HTML whenever the page is served ;) ',
				tags: 	  []
			}
		],

		authorized_clients:
		[
			'adrian@magneticbear.com',
			'mo@magneticbear.com',
			'jp@magneticbear.com'
		],

		public_is_authorized: 1
	}
);

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
				serve(req, res, 200, '<html>' + JSON.stringify(doc) + '</html>', new Date().getTime());
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