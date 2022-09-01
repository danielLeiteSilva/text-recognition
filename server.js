const express = require('express')
require('dotenv').config()
const fs = require('fs')
const path = require('path')

//Services
const googleService = require('./GoogleService')
const tesseractService = require('./TesseractService')

const app = express()
const port = process.env.PORT || 8080

app.use(express.json())

app.post("/translate", async (req, res) => {

    const text = await tesseractService.extractText(req.body)

    const translated = await googleService.translate(text, "pt", 'en')
    const resolve = await googleService.textToSpeech(translated, 'en')
    let buff = Buffer.from(resolve, 'base64');
    fs.writeFileSync('audio.mp3', buff);

    let filePath = path.join(__dirname, "audio.mp3");
    res.download(filePath, 'audio.mp3')

})


app.listen(port, () => console.log(`Connected on port -> ${port}`))