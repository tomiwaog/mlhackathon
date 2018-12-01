"use strict";
var dotenv     = require('dotenv').config();
var rpn        = require("request-promise-native");
var	express    = require('express');
var	bodyParser = require('body-parser');
var http       = require('http');
var AssistantV1 = require('watson-developer-cloud/assistant/v1');
var port = 3000;

//Express Server
var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
http.createServer(app).listen(port, '0.0.0.0', function() {
	ts("app:main",'server starting on: ' + port);
  });


//Watson Assitant Cred
  var assistant = new AssistantV1({
	version: '2018-09-20',
    username: 'apikey',
   password: 'rzIHkHrOIKk5CZ6CSB9RSk3N6Pps0YFO2ZefEPKWkt0g',
   url: 'https://gateway-syd.watsonplatform.net/assistant/api',
   headers: {
	 'X-Watson-Learning-Opt-Out': 'true'
   }
   });



/*************************************************************/
/* POST for client to interact with server                   */
/*************************************************************/
app.post('/api/bot', function(req, res) {
	
	ts("app:post","Received POST from client");
	ts("app:post","Workspace Id = " + req.body.workspace_id);


	let workspace_id;
	let input;
	let context;

	if (req.body) {
		workspace_id = req.body.workspace_id;
      if (req.body.input) {
        input = JSON.stringify(req.body.input);
      }

      if (req.body.context) {
        context = req.body.context;
      }
	  else {
		ts("app:post","No context yet");
			
	  }	  
	}

	console.log('req parameters ====>>>>>', input,context,workspace_id);
	
	
	assistant.message({
		workspace_id:'b6116dbd-e181-47fd-900d-12816d53ea59',
		input: {'text': input},
		context: context
	  },
		function (err, result, response) {
		  if (err) {
			console.log('error:======>>>>>>', err);
		  } else {
			
			console.log(response.body);
			return res.status(200).send(response);
		  }
		}
	  );
}); 








/**********************************************************************************/
/* Name:    ts                                                                    */
/*                                                                                */
/* Purpose: Logging function.                                                     */
/*                                                                                */
/**********************************************************************************/
function ts(module, msg) {
    console.log(new Date().toISOString() + " " + module + " ==> " + msg);
}