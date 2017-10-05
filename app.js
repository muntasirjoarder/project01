const builder = require('botbuilder');
const restify = require('restify');
const mdb = require('moviedb')(process.env.MOVIE_DB_API_KEY);
const wordsToNum = require('words-to-num');
require('datejs');

// Setup Restify Server
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
  console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
const connector = new builder.ChatConnector({
  appId: process.env.MICROSOFT_APP_ID,
  appPassword: process.env.MICROSOFT_APP_PASSWORD,
});
const bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

const luisUrl = 'api.projectoxford.ai/luis/v1';
const luisModelUrl = `https://${luisUrl}/application?id=${process.env.LUIS_APP_ID}&subscription-key=${process.env.LUIS_API_KEY}`;

const recognizer = new builder.LuisRecognizer(luisModelUrl);
const intents = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', intents);

// Get this information with mdb.configuration()
const imagesBaseUrl = 'https://image.tmdb.org/t/p/';
const posterSize = 'w185';