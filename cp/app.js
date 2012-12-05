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
app.post('/cp/:project', make_post);

function make_post(req, res)
{
	console.log(req);
	serve_cp(req, res);
}

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
				if(doc.stage_completions.meeting       != null) content += build_meeting(doc);
				if(doc.stage_completions.problem       != null) content += build_problem(doc);
				if(doc.stage_completions.solution 	   != null) content += build_solution(doc);
				if(doc.stage_completions.design 	   != null) content += build_design(doc);
				if(doc.stage_completions.flow 		   != null) content += build_flow(doc);
				if(doc.stage_completions.wireframe 	   != null) content += build_wireframe(doc);
				if(doc.stage_completions.development   != null) content += build_development(doc);
				if(doc.stage_completions.ia 		   != null) content += build_ia(doc);
				if(doc.stage_completions.data_model    != null) content += build_data_model(doc);
				if(doc.stage_completions.ux_demo 	   != null) content += build_ux_demo(doc);
				if(doc.stage_completions.branding 	   != null) content += build_branding(doc);
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
				serve(req, res, 200, to_serve, new Date().getTime());
			}
		}
	);
}

function build_meeting(doc) 	  { return setup_feed(doc, setup_stage('Meeting', 		'/client-portal/images/meeting.png', 		'<b>Meetings are a real fun time.</b>'), 			     'meeting');       }
function build_problem(doc) 	  { return setup_feed(doc, setup_stage('Problem', 		'/client-portal/images/problem-space.png',  '<b>99 problems and your app aint one of them.</b>'), 	 'problem');       }
function build_solution(doc) 	  { return setup_feed(doc, setup_stage('Solution', 		'/client-portal/images/solution-space.png', '<b>Solutions are okay, I prefer solvents though.</b>'), 'solution');      }
function build_design(doc) 		  { return setup_feed(doc, setup_stage('Design', 		'/client-portal/images/404.png', 	        '<b>Why design when you can watch television?</b>'),     'design');        }
function build_flow(doc) 		  { return setup_feed(doc, setup_stage('Flow', 			'/client-portal/images/flow.png', 		    '<b>Mihály Csíkszentmihályi was here.</b>'), 			 'flow');          }
function build_wireframe(doc)     { return setup_feed(doc, setup_stage('Wireframe', 	'/client-portal/images/wireframe.png', 	    '<b>No filler here, straight killer b.</b>'), 			 'wireframe');     }
function build_development(doc)   { return setup_feed(doc, setup_stage('Development',   '/client-portal/images/404.png', 	        '<b>By development we mean fooseball.</b>'), 			 'development');   }
function build_ia(doc) 			  { return setup_feed(doc, setup_stage('IA', 			'/client-portal/images/ia.png', 		    '<b>If you build it, they will come.</b>'), 			 'ia');            }
function build_data_model(doc)    { return setup_feed(doc, setup_stage('Data Model', 	'/client-portal/images/data-model.png',     '<bThats one fine looking data model.</b>'), 			 'data_model');    }
function build_ux_demo(doc) 	  { return setup_feed(doc, setup_stage('UX Demo', 		'/client-portal/images/ux-demo.png', 	    '<b>Ux and Them - Pink Floyd</b>'), 					 'ux_demo');       }
function build_branding(doc) 	  { return setup_feed(doc, setup_stage('Branding', 		'/client-portal/images/404.png', 	        '<b>Branding, get it while its hot!</b>'), 				 'branding');      }
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

	var entry = {method: req.method, endpoint: req.url, http_response_code: http_response_code, response_time: new Date().getTime() - response_timer};
  	db.log.save({date: new Date().getTime(), entry: entry});
  	console.log(entry);
}

db.projects.ensureIndex({project_url:1});

app.listen(port);
console.log('msbweb serving: ' + port);
console.log('mbsweb db:      ' + db_url);