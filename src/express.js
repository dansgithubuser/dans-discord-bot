const discord = require('./discord.js');
const logger = require('./logger.js');

const bodyParser = require('body-parser');
const express = require('express');

const app = express();

app.disable('x-powered-by');

function asyncHandler(callback) {
  return (req, res, next) => {
    callback(req, res, next).catch((e) => {
      logger.error(e);
      next(e);
    });
  };
}

//===== middlewares =====//
app.use((req, res, next) => {
  res.on('finish', () => {
    if (res.statusCode < 500) return;
    logger.error(`[${new Date()}] ${req.method} ${req.url} ${res.statusCode}`);
  });
  next();
});

app.use(bodyParser.json());

//===== routes =====//
app.post('/channel/:id/message', asyncHandler(async (req, res) => {
  const channel = await discord.channels.fetch(req.params.id);
  channel.send(req.body.message);
  return res.sendStatus(200);
}));

//===== main =====//
app.listen(process.env.DANS_DISCORD_BOT_PORT || 8000);
