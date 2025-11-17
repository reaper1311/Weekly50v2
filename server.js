// Basic Node.js Web Push server
// Requires: npm install express web-push cors

const express = require("express");
const webpush = require("web-push");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let subscriptions = [];

// Set your VAPID KEYS after generating them:
webpush.setVapidDetails(
  "mailto:you@example.com",
  "REPLACE_PUBLIC",
  "REPLACE_PRIVATE"
);

app.post("/subscribe", (req, res) => {
  subscriptions.push(req.body);
  res.sendStatus(201);
});

app.post("/test", async (req, res) => {
  for (const sub of subscriptions) {
    await webpush.sendNotification(
      sub,
      JSON.stringify({
        title: "Weekly $50 Investor",
        body: "This is a test push notification"
      })
    );
  }
  res.sendStatus(200);
});

// Monday morning push (cron)
const cron = require("node-cron");
cron.schedule("30 6 * * 1", async () => {
  for (const sub of subscriptions) {
    await webpush.sendNotification(
      sub,
      JSON.stringify({
        title: "Monday Investment Reminder",
        body: "Your $50 weekly investment summary is ready."
      })
    );
  }
});

app.listen(3000, () => console.log("Push server running on port 3000"));
