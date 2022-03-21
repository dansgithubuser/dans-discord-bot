const discord = require('./discord.js');
const logger = require('./logger.js');

const bodyParser = require('body-parser');
const express = require('express');

const app = express();

app.disable('x-powered-by');

fSendCounts = {};

function spamming(sender) {
  const now = new Date();
  if (!fSendCounts[sender]) fSendCounts[sender] = [];
  while (fSendCounts[sender].length && fSendCounts[sender][0] < now - 3600e3) {
    fSendCounts[sender] = fSendCounts[sender].splice(1);
  }
  fSendCounts[sender].push(new Date());
  if (fSendCounts[sender].length > 10) {
    if (fSendCounts[sender].length < 100) {
      logger.info(`Blocking spam from ${sender}. ${fSendCounts[sender].length} messages sent in past hour.`);
    }
    return true;
  }
  return false;
}

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
  if (spamming(req.body.sender)) {
    return res.status(400).send('Refusing to send spam. Stop spamming immediately. Do not repeat this mistake.');
  }
  const channel = await discord.channels.fetch(req.params.id);
  channel.send(req.body.message);
  return res.sendStatus(200);
}));

//===== main =====//
app.listen(process.env.DANS_DISCORD_BOT_PORT || 8000);
