const line = require('@line/bot-sdk');
const cors = require('cors')({origin: true});
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto'); // 引入crypto模組

const app = express();
app.use(bodyParser.json());
app.use(cors)

app.post('/api/app/linebot', async (req, res) => {

  cors(req, res, async () => {
    const client = new line.Client({
      channelAccessToken: 'nR1n9JcQU4Jbdl0s0u5DAaVjrMe5XCDtIWp0sSYjy+VfXtpmYqPoO/YBcU9L5PUB4ghq7pkuDFKZCBTANO+8PxhauEj8/1AnZn6HjfOdpFuVDNsHEbk3PTPfqUH9S9NoIVkKeCjpwwfSDhnkk9WlbgdB04t89/1O/w1cDnyilFU=',
      channelSecret: 'c4a8ecb5b00d27b82ef04df35b15edfa'
    });
    
    const message = {
      type: 'text',
      text: 'Hello, World!',
    };
    
    try {
      const signature = req.get('X-Line-Signature');
      const hmac = crypto.createHmac('SHA256', 'channel secret');
      const body = JSON.stringify(req.body);
      const digest = hmac.update(body).digest('base64');
      if (digest === signature) {
        const events = req.body.events;
        const promises = events.map(async (event) => {
          await client.replyMessage(event.replyToken, message);
        });
        await Promise.all(promises);
        res.sendStatus(200);
      } else {
        res.sendStatus(403); // 簽名驗證失敗
      }
    } catch (err) {
      console.error(err);
      res.status(500).send(err);
    }
  });
});

exports.lineBot = app;
