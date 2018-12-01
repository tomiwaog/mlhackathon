"use strict";
/******************************************************************************************/
/* Name:       bot.js                                                                     */
/*                                                                                        */
/* Purpose:    Processes requests from index.html to send data to the server side API in  */
/*             app.js which in turn calls the API that calls Watson. When results are back*/
/*             from Watson, bot.js displays those results in the browser.                 */
/*                                                                                        */
/******************************************************************************************/

// Object for parameters sent to the Watson Assistant service
var params = {
    input: '',
    context: '',
	workspace_id: ''
};



// Holds all the data for the current point of the chat
var context;

var bypass_start = 0;

/**********************************************************************************/
/* Name:    newEvent                                                              */
/*                                                                                */
/* Purpose: This function gets called each time a key is pressed by the user.     */
/*          The code looks for the user clicking on the enter key (13) and        */
/*          then calls submitMessage() to begin the process of sending to Watson. */
/*                                                                                */
/**********************************************************************************/
function newEvent(e){
	if (e.which === 13 || e.keyCode === 13){
	  ts("newEvent", "User pressed enter key");
	  submitMessage();
    }
}
/**********************************************************************************/
/* Name:    submitMessage                                                         */
/*                                                                                */
/* Purpose: This function handles the user clicking on the submit button and then */
/*          begins the process of sending input to Watson.                        */
/*                                                                                */
/**********************************************************************************/
function submitMessage(){
	ts("submitMessage", "Begin");

	bypass_start++;
	var userInput = document.getElementById('chatMessage');
	var text = userInput.value;                // Using text as a recurring variable through functions
	text = text.replace(/(\r\n|\n|\r)/gm, ""); // Remove erroneous characters

	if (text){
		// Display the user's text in the chat box and null out input box
		displayMessage(text, "user");
		userInput.value = '';
		userMessage(text);
	}else{
		// Blank user message. Do nothing.
		ts("submitMessage", "No message from user.");
		userInput.value = '';
		return false;
    }
}

/**********************************************************************************/
/* Name:    userMessage                                                           */
/*                                                                                */
/* Purpose: This function POSTs the user's message to the server side API that    */
/*          then makes the call to Watson.                                        */
/*                                                                                */
/**********************************************************************************/
function userMessage(message){
	if (bypass_start>0){
		// Set parameters for payload to Watson
		params.input = {
			text: message // Input from user
		}
		// Add variables to the context as more options are chosen
		if (context){
			console.log(context,'context================><><><><>');
			params.context = context; // Add a context if there is one previously stored
		}
		var xhr = new XMLHttpRequest();
		var uri = '/api/bot';
		xhr.open('POST', uri, true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.onload = function(){
			// Verify if there is a success code response and some text was sent
			if (xhr.status === 200 && xhr.responseText){
				console.log('success msg')
				var response = JSON.parse(xhr.responseText);
				var text = response.body.output.text; // Only display the first response
				context = response.body.context; // Store the context for next round of questions
				console.log(response.body.intents[0],'contexttttttttttttttttttttttt');
				console.log("Got response from Bot: ", JSON.stringify(response));
				for(let i = 0;i<text.length;i++){
				displayMessage(text[i], "watson");
				}
			}else{
				console.error('Server error for Conversation. Return status of: ', xhr.statusText);
			}
		};
		xhr.onerror = function(){
			console.error('Network error trying to send message!');
		};
		console.log(JSON.stringify(params));
		xhr.send(JSON.stringify(params));
	}
}

/**********************************************************************************/
/* Name:    displayMessage                                                        */
/*                                                                                */
/* Purpose: This function sends results back to the browser. First is echoing back*/
/*          what the user typed in and then the results from Watson.              */
/*                                                                                */
/**********************************************************************************/
function displayMessage(text, user){
	var chat = document.getElementById('chatBox');
	var bubble = document.createElement('div');
	bubble.className = 'message';  // Wrap the text first in a message class for common formatting
	// Set chat bubble color and position based on the user parameter
	if (user === "watson"){
		bubble.innerHTML = "<div class='bot_parent'><div class='bot'>" + text + "</div></div>";
	}else{
		bubble.innerHTML = "<div class='user_parent'><div class='user'>" + text + "</div></div>";
	}
	chat.appendChild(bubble);
	chat.scrollTop = chat.scrollHeight;  // Move chat down to the last message displayed
	document.getElementById('chatMessage').focus();
	return null;
}

/**********************************************************************************/
/* Name:    handleRadioButton                                                     */
/*                                                                                */
/* Purpose: Switches between the different workspaces.                            */
/*                                                                                */
/**********************************************************************************/
function handleRadioButton(selectedButton){
	params.workspace_id = workspaceIds[selectedButton];
	console.log(params.workspace_id);
}

/**********************************************************************************/
/* Name:    ts                                                                    */
/*                                                                                */
/* Purpose: Logging function.                                                     */
/*                                                                                */
/**********************************************************************************/
function ts(module, msg) {
    console.log(new Date().toISOString() + " " + module + " ==> " + msg);
}
