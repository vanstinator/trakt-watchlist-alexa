import * as Alexa from 'ask-sdk';
import { ExpressAdapter } from 'ask-sdk-express-adapter';
import express from 'express';

import AddItemToWatchlistIntentHandler from './src/alexa/handlers/AddItemToWatchlistIntentHandler';
import LaunchRequestHandler from './src/alexa/handlers/LaunchRequestHandler';
import LocalisationRequestInterceptor from './src/alexa/handlers/LocalisationRequestInterceptor';

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

app.post('/', adapter.getRequestHandlers());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.sendStatus(500);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));