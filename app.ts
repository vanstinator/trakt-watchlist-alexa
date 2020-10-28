import * as Alexa from 'ask-sdk';
import { ExpressAdapter } from 'ask-sdk-express-adapter';
import express from 'express';

import LaunchRequestHandler from './handlers/LaunchRequestHandler';
import LocalisationRequestInterceptor from './handlers/LocalisationRequestInterceptor';

const app = express();

const port = 3000;

const skillBuilder = Alexa.SkillBuilders
  .custom()
  .addRequestInterceptors(
    LocalisationRequestInterceptor
  )
  .addRequestHandlers(
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