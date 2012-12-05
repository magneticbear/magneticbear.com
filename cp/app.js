var port	 = process.env.PORT || 22324;
var fs		 = require('fs');
var db_url	 = process.env.MONGOHQ_URL || 'mbsweb';
var db		 = require('mongojs').connect(db_url, ['projects', 'log']);
var md 		 = require("node-markdown").Markdown;
var express	 = require('express');
var app		 = express();

var html_cp  			  = fs.readFileSync('html/cp.html',  			  'utf8');
var html_wrap_stage_entry = fs.readFileSync('html/wrap_stage_entry.html', 'utf8');
var html_wrap_feed_entry  = fs.readFileSync('html/wrap_feed_entry.html',  'utf8');
var html_500 			  = '<html><b>500</b> DB IS DOWN!</html>';
var html_404 			  = '<html><b>404</b> PAGE NOT FOUND!</html>';

app.use(express.bodyParser());

app.get('/cp/:project', serve_cp);

setup_debug_project();
function setup_debug_project()
{
	db.projects.save(
		{
			project_url:  'test', 
			project_name: 'The CP Test Project', 

			stage_completions:
			{
				meeting:  	   0,
				problem:  	   0,
				solution: 	   0,
				design: 	   0,
				flow: 		   0,
				wireframe: 	   0,
				development:   0,
				ia: 		   0,
				data_model:    0,
				ux_demo: 	   0,
				branding: 	   0,
				style_guide:   0,
				ui: 		   0,
				api_structure: 0,
				network: 	   0,
				functionality: 0,
				ui_demo: 	   0,
				web_design:    0,
				web_frontend:  0,
				polish: 	   0,
				testing: 	   0,
				beer: 		   0,
				delivery: 	   0
			}, 

			feed: 
			{
				last_change: new Date(),
				entries: 
				[
					{
						last_change: new Date(),
						markdown:   '# HIB JIB RABIBDABIB',
						short_name: 'Adrian',
						tags: 
						[
							'problem', 'flow', 'meeting'
						]
					}
				]
			}
		},

		function(err)
		{
			if(err) console.log(err);
		}
	);
}

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
				var content  = '';
				if(doc.stage_completions.meeting != null)
				{
					var stage = setup_stage('Meeting', '/client-portal/images/meeting.png', '<b>Meetings are a real fun time!</b>');
					stage     = setup_feed(doc, stage, 'meeting');
					content  += stage;
				}


				html_wrap_stage_entry;
				var to_serve = html_cp.replace('{{content}}', content);
				serve(req, res, 200, to_serve, new Date().getTime());
			}
		}
	);
}

function setup_stage(stage_title, icon_url, stage_description)
{
	return html_wrap_stage_entry.replace('{{stage_title}}', stage_title).replace('{{icon_url}}', icon_url).replace('{{stage_description}}', stage_description);
}
function setup_feed(doc, stage, tag)
{
	var feed = '';
	for(var e = 0; e < doc.feed.entries.length; e++) if(contains_tag(doc.feed.entries[e].tags, tag)) feed += html_wrap_feed_entry.replace('{{short_name}}', doc.feed.entries[e].short_name).replace('{{markdown}}', md(doc.feed.entries[e].markdown)).replace('{{timestamp}}', doc.feed.entries[e].last_change);
	return stage.replace('{{feed}}', feed);
}
function contains_tag(array, tag) 
{
    for (var a = 0; a < array.length; a++) if (array[a].toLowerCase() === tag.toLowerCase()) return true;
    return false;
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