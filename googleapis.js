const AssistantV1 = require('watson-developer-cloud/assistant/v1');
const youtubeSearch = require('youtube-search');
const googleSearch = require('google-search-scraper');

var assistant = new AssistantV1({
  version: '2018-09-20',
  username: 'apikey',
  password: 'rzIHkHrOIKk5CZ6CSB9RSk3N6Pps0YFO2ZefEPKWkt0g',
  url: 'https://gateway-syd.watsonplatform.net/assistant/api',
  headers: {
     'X-Watson-Learning-Opt-Out': 'true'
  }
});

const youtubeOpts = {
  maxResults: 1,
  key: 'AIzaSyAoKo5gNSs8c0BauOmIs3ilBapJattARD8'
};

console.log(assistant)

const workspaceId = 'b6116dbd-e181-47fd-900d-12816d53ea59';
const queryInput = 'I need to buy a book';
const authorInput = 'Stephen Hawking';

assistant.message({
  workspace_id: workspaceId,
  input: { 'text': queryInput },
  headers: {
    'Custom-Header': 'custom',
    'Accept-Language': 'custom'
  }
}, authorQuery);

function authorQuery(err, result, response) {
  if (err) console.log('error:', err);
  else console.log(JSON.stringify(result, null, 2));

  assistant.message({
    workspace_id: workspaceId,
    input: { 'text': authorInput },
    context: result.context
  }, ytSearchQuery);
}

function ytSearchQuery(authorErr, authorResult, authorResponse) {
  if (authorErr) console.log('error:', authorErr);
  else console.log(JSON.stringify(authorResult, null, 2));

  youtubeSearch(authorInput, youtubeOpts, function(err, results) {
    if(err) return console.log(err);
    console.dir(results);
  })
}

function googleSearchQuery(authorErr, authorResult, authorResponse) {
  var searchOpts = {
    query: authorInput,
    host: 'www.google.com',
    lang: 'en',
    limit: 1,
  };

  scraper.search(options, function(err, url) {
    // This is called for each result
    if(err) throw err;
    console.log(url);
  });
}
