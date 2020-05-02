const express = require('express')
const cors = require('cors')
const app = express()
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT;

const bodyParser = require('body-parser');

const scrapers = require('./scrapers.js');
const db = require('./db.js');

app.use(bodyParser.json());
app.use(cors());

app.get('/creators', async (req, res) => {
    const creators = await db.getAllCreators();
    res.send(creators);
});

app.post('/creators', async (req, res) => {
    console.log(req.body);
    const channelData = await scrapers.scrapeChannel(req.body.channelURL);
    const creators = await db.insertCreator(channelData.name, channelData.avatarURL, req.body.channelURL);
    res.send(creators);
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))