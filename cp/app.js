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
var html_403 			  = '<html><b>403</b> BAD AUTH!</html>';
var html_404 			  = '<html><b>404</b> PAGE NOT FOUND!</html>';

var admins = 
[
	{email: 'adrian@magneticbear.com', auth: 'foobar'},
	{email: 'jp@magneticbear.com',     auth: 'foobar'},
	{email: 'stu@magneticbear.com',    auth: 'foobar'},
	{email: 'mo@magneticbear.com',     auth: 'foobar'}
];

app.use(express.bodyParser());

app.all('/cp/:email/:auth/:project/*',      	auth_user);
app.all('/cp/admin/:email/:auth/:project/*', 	auth_admin);

app.get ('/cp/:email/:auth/:project/serve',     serve_cp);
app.post('/cp/:email/:auth/:project/postfeed',  postfeed);
app.post('/cp/admin/:email/:auth/:project/new', newproj);

function auth_user(req, res, next)
{
	if(!req.params.email || !req.params.auth || !req.params.project) serve(req, res, 403, html_403, now());
	else
	{
		db.projects.findOne({project_url: req.params.project}, 
			function(err, doc)
			{
					 if(err)  serve(req, res, 500, html_500, now());
				else if(!doc) serve(req, res, 403, html_403, now());
				else
				{
					for(var u = 0; u < doc.users.length; u++)
					{
						if(doc.users[u].email.toLowerCase() === req.params.email.toLowerCase())
						{
							if(users[u].auth === req.params.auth) next();
							else serve(req, res, 403, html_403, now());
						}
					}
					auth_admin(req, res, next());
				}
			}
		);
	}
}
function auth_admin(req, res, next)
{
	//console.log(req.toString());
	if(!req.params.email || !req.params.auth) serve(req, res, 403, html_403, now());
	else
	{
		for(var a = 0; a < admins.length; a++)
		{
			if(admins[a].email.toLowerCase() === req.params.email.toLowerCase())
			{
				if(admins[a].auth === req.params.auth) next();
				else serve(req, res, 403, html_403, now());
			}
		}
		serve(req, res, 403, html_403, now());
	}
}

function postfeed(req, res)
{	
	is_user_on_project(req.params.email, req.params.project, 
		function(err, result)
		{
			if(err) serve(req, res, 500, html_500, now());
			else if (result)
			{
				db.projects.findOne({project_url: req.params.url}, 
					function(err, doc)
					{
							 if(err)  serve(req, res, 500, html_500, now());
						else if(!doc) serve(req, res, 500, html_500, now());
						else
						{
							doc.feed.entries.push({ last_change: new Date(), markdown: req.params.markdown, short_name: req.params.email.slice(0, req.params.email.indexOf('@')), tags: req.params.tags.split(',') });
							db.projects.save(doc, 
								function(err)
								{
									if(err) serve(req, res, 500, html_500, now());
									else serve_cp(req, res);
								}
							);
						}
					}
				);
			}
			else
			{
				serve(req, res, 403, html_403, now());
			}
		}
	);
}
function delete_project(req, res, url)
{

			db.projects.remove({project_url: url}, 
				function(err)
				{
					if(err) console.log(err);
				}
			);

}
function newproj(req, res, url, name)
{
	is_admin('', '', //req.params.email, req.params.project, 
		function(err, result)
		{
			db.projects.save(
				{
					project_url:  url, 
					project_name: name, 

					stage_completions:
					{
						meeting:  	   0,
						problem:  	   0,
						solution: 	   0,
						flow: 		   0,
						wireframe: 	   0,
						ia: 		   0,
						data_model:    0,
						ux_demo: 	   0,
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

					users: 
					[
						{email: 'abseeley@gmail.com',    auth: 'foobar'},
						{email: 'adrian@gatosomina.com', auth: 'foobar'}
					],

					feed: 
					{
						last_change: new Date(),
						entries: 
						[
							{
								last_change: new Date(),
								markdown:    'Project Start!',
								short_name:  'adrian',
								tags: 		 []
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
	);
}
function serve_cp(req, res)
{
	// todo: validate req.params.project before using

	db.projects.findOne({project_url: req.params.project}, 
		function(err, doc)
		{

				 if(err)  serve(req, res, 500, html_500, now());
			else if(!doc) serve(req, res, 404, html_404, now());
			else
			{
				var content  = '';
				if(doc.stage_completions.meeting       != null) content += build_meeting(doc);
				if(doc.stage_completions.problem       != null) content += build_problem(doc);
				if(doc.stage_completions.solution 	   != null) content += build_solution(doc);
				if(doc.stage_completions.flow 		   != null) content += build_flow(doc);
				if(doc.stage_completions.wireframe 	   != null) content += build_wireframe(doc);
				if(doc.stage_completions.ia 		   != null) content += build_ia(doc);
				if(doc.stage_completions.data_model    != null) content += build_data_model(doc);
				if(doc.stage_completions.ux_demo 	   != null) content += build_ux_demo(doc);
				if(doc.stage_completions.style_guide   != null) content += build_style_guide(doc);
				if(doc.stage_completions.ui 		   != null) content += build_ui(doc);
				if(doc.stage_completions.api_structure != null) content += build_api_structure(doc);
				if(doc.stage_completions.network       != null) content += build_network(doc);
				if(doc.stage_completions.functionality != null) content += build_functionality(doc);
				if(doc.stage_completions.ui_demo 	   != null) content += build_ui_demo(doc);
				if(doc.stage_completions.web_design    != null) content += build_web_design(doc);
				if(doc.stage_completions.web_frontend  != null) content += build_web_frontend(doc);
				if(doc.stage_completions.polish 	   != null) content += build_polish(doc);
				if(doc.stage_completions.testing 	   != null) content += build_testing(doc);
				if(doc.stage_completions.beer 		   != null) content += build_beer(doc);
				if(doc.stage_completions.delivery 	   != null) content += build_delivery(doc);

				html_wrap_stage_entry;
				var to_serve = html_cp.replace('{{content}}', content);
				serve(req, res, 200, to_serve, now());
			}
		}
	);
}
function build_meeting(doc) 	  { return setup_feed(doc, setup_stage('Meeting', 		'/client-portal/images/meeting.png', 		'<b>Meetings are a real fun time.</b>'), 			     'meeting');       }
function build_problem(doc) 	  { return setup_feed(doc, setup_stage('Problem', 		'/client-portal/images/problem-space.png',  '<b>99 problems and your app aint one of them.</b>'), 	 'problem');       }
function build_solution(doc) 	  { return setup_feed(doc, setup_stage('Solution', 		'/client-portal/images/solution-space.png', '<b>Solutions are okay, I prefer solvents though.</b>'), 'solution');      }
function build_flow(doc) 		  { return setup_feed(doc, setup_stage('Flow', 			'/client-portal/images/flow.png', 		    '<b>Mihály Csíkszentmihályi was here.</b>'), 			 'flow');          }
function build_wireframe(doc)     { return setup_feed(doc, setup_stage('Wireframe', 	'/client-portal/images/wireframe.png', 	    '<b>No filler here, straight killer b.</b>'), 			 'wireframe');     }
function build_ia(doc) 			  { return setup_feed(doc, setup_stage('IA', 			'/client-portal/images/ia.png', 		    '<b>If you build it, they will come.</b>'), 			 'ia');            }
function build_data_model(doc)    { return setup_feed(doc, setup_stage('Data Model', 	'/client-portal/images/data-model.png',     '<bThats one fine looking data model.</b>'), 			 'data_model');    }
function build_ux_demo(doc) 	  { return setup_feed(doc, setup_stage('UX Demo', 		'/client-portal/images/ux-demo.png', 	    '<b>Ux and Them - Pink Floyd</b>'), 					 'ux_demo');       }
function build_style_guide(doc)   { return setup_feed(doc, setup_stage('Style Guide',   '/client-portal/images/style-guide.png',    '<b>How to look like Mo, just 5 easy payments!</b>'),    'style_guide');   }
function build_ui(doc) 			  { return setup_feed(doc, setup_stage('UI', 			'/client-portal/images/ui-design.png', 	    '<b>Still watching television.</b>'), 					 'ui'); 		   }
function build_api_structure(doc) { return setup_feed(doc, setup_stage('API Structure', '/client-portal/images/api.png', 		    '<b>The API is actually a small rodent from Peru.</b>'), 'api_structure'); }
function build_network(doc) 	  { return setup_feed(doc, setup_stage('Network', 		'/client-portal/images/networking.png',     '<b>-Insert Skynet Here-</b>'), 						 'network'); 	   }
function build_functionality(doc) { return setup_feed(doc, setup_stage('Functionality', '/client-portal/images/functionality.png',  '<b>Functional, like a solar powered lightbulb.</b>'),   'functionality'); }
function build_ui_demo(doc) 	  { return setup_feed(doc, setup_stage('UI Demo', 		'/client-portal/images/ui-demo.png', 	    '<b>I glued this together for you (:</b>'), 			 'ui_demo'); 	   }
function build_web_design(doc) 	  { return setup_feed(doc, setup_stage('Web Design', 	'/client-portal/images/web-design.png',     '<b>Okay lets see.. htm-err-css-err.. Mo! Help!</b>'),   'web_design');    }
function build_web_frontend(doc)  { return setup_feed(doc, setup_stage('Web Frontend',  '/client-portal/images/web-dev.png', 	    '<b>In Russia, web frontends you!</b>'), 				 'web_frontend');  }
function build_polish(doc) 		  { return setup_feed(doc, setup_stage('Polish', 		'/client-portal/images/polish.png', 	    '<b>Sparkle-Sparkle</b>'), 							     'polish'); 	   }
function build_testing(doc) 	  { return setup_feed(doc, setup_stage('Testing', 		'/client-portal/images/testing.png', 	    '<b>Lending our phones to irresponsible parties.</b>'),  'testing'); 	   }
function build_beer(doc) 		  { return setup_feed(doc, setup_stage('Beer', 			'/client-portal/images/beer.png', 		    '<b>420</b>'), 											 'beer'); 		   }
function build_delivery(doc) 	  { return setup_feed(doc, setup_stage('Delivery', 		'/client-portal/images/final-product.png',  '<b>Planet Express Ship at your service!</b>'), 		 'delivery');      }
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

	var entry = {method: req.method, endpoint: req.url, http_response_code: http_response_code, response_time: now() - response_timer};
  	db.log.save({date: now(), entry: entry});
  	//console.log(entry);
}

function now()
{
	return new Date().getTime();
}

db.projects.ensureIndex({project_url:1});

//delete_project('test');
//create_new_project('test', 'Test Project');

app.listen(port);
console.log('msbweb serving: ' + port);
console.log('mbsweb db:      ' + db_url);