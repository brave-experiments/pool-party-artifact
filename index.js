var express = require('express');
var path = require('path');

const { WebSocketServer } = require('ws');

const app = express();

app.use(express.json());

//app.get('/', function(req, res, next){
//  res.send("hello, welcome to the pool party demo\n");
//});

app.use(express.static(path.join(__dirname, 'static')));

app.get('/source', async function(req, res) {
//  console.log('Got /source');
//  res.send("hi from /source");
  res.set({
    'Cache-Control': 'no-cache',
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive'
  });
  res.flushHeaders();

  // Tell the client to retry every 10 seconds if connectivity is lost
  res.write('retry: 10000\n\n');
});

let lastResults = [];

app.post('/result', async function (req, res) {
  const currentResults = req.body;
  console.log({currentResults, lastResults});
  let matchCount = 0.0;
  for (let i = 0; i < currentResults.length; ++i) {
    if (lastResults.includes(currentResults[i])) {
      ++matchCount;
    }
  }
  console.log(matchCount);
  lastResults = currentResults;
  res.send(`${matchCount / currentResults.length}`);
});


const server = app.listen(3501);

const wss = new WebSocketServer({ server });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    try {
//      console.log(message.toString());
      ws.send(message);
    } catch (e) {
      console.log(e, message);
    }
  });
});

