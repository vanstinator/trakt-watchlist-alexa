import { conversation } from '@assistant/conversation';
import * as Alexa from 'ask-sdk';
import { ExpressAdapter } from 'ask-sdk-express-adapter';
import bodyParser from 'body-parser';
import express from 'express';

import AddItemToWatchlistIntentHandler from './src/alexa/handlers/AddItemToWatchlistIntentHandler';
import LaunchRequestHandler from './src/alexa/handlers/LaunchRequestHandler';
import LocalisationRequestInterceptor from './src/alexa/handlers/LocalisationRequestInterceptor';
import logger from './src/core/utils/logger';
import AddItemToWatchlistConversationHandler from './src/google/handlers/AddItemToWatchlistConversationHandler';

const log = logger.category('APP');

const port = process.env.PORT || 3000;

const app = express();

const skillBuilder = Alexa.SkillBuilders
  .custom()
  .addRequestInterceptors(
    LocalisationRequestInterceptor
  )
  .addRequestHandlers(
    AddItemToWatchlistIntentHandler,
    LaunchRequestHandler
  );

const skill = skillBuilder.create();

const adapter = new ExpressAdapter(skill, true, true);

app.post('/alexa', adapter.getRequestHandlers());

// Create an app instance
const action = conversation();
// Register handlers for Dialogflow intents
action.handle('add_item', (conv) => AddItemToWatchlistConversationHandler(conv));

action.handle('AccountLinked', conv => {
  log.trace(JSON.stringify(conv, null, 2));
});

action.handle('list', conv => {
  log.trace(JSON.stringify(conv, null, 2));
});

// Intent in Dialogflow called `Goodbye`
action.handle('Goodbye', conv => {
  // conv.close('See you later!');
});

action.handle('Default Fallback Intent', conv => {
  // conv.ask('I didn\'t understand. Can you tell me something else?');
});

app.use(bodyParser.json());
app.post('/google', action);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  log.error(err.stack);
  res.sendStatus(500);
});

app.listen(port, () => log.info(`Example app listening on port ${port}!`));