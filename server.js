const express = require('express')
require('dotenv').config()
const fs = require('fs')
const path = require('path')
const wokeDyno = require("woke-dyno")

//Services
const googleService = require('./GoogleService')
const tesseractService = require('./TesseractService')

//Whatsapp
const whatsapp = require('./Whatsapp')

//Cache
const cache = require('./Cache')
const { file } = require('googleapis/build/src/apis/file')

const app = express()
const port = process.env.PORT || 8080

app.use(express.json())

app.get("/cache", (req, res) => {
    const cacheInfo = cache.readFileCache()
    res.status(200).json(cacheInfo)
})

app.get("/translate_image", async (req, res) => {
    const fileName = req.query.fileName || "audio.mp3"
    await download(res, req.query.url, fileName)
})

app.post("/translate_image", async (req, res) => {
    const fileName = req.body.fileName || "audio.mp3"
    await download(res, req.body.image.url, fileName)
})

app.get("/translate_text", async (req, res) => {
    const fileName = req.query.fileName || "audio.mp3"
    const text = req.query.text || "teste de aúdio"
    await download(res, req.query.url, fileName, text)
})

async function download(res, url, fileName, textInput) {

    const text = url ? await tesseractService.extractText(url) : textInput

    const translated = await googleService.translate(text, 'pt', 'en')
    const resolve = await googleService.textToSpeech(translated, 'en')
    let buff = Buffer.from(resolve, 'base64')
    fs.writeFileSync(fileName, buff)

    let filePath = path.join(__dirname, fileName)
    res.download(filePath, fileName)
}

app.listen(port, async () => {

    console.log(`Connected on port -> ${port}`)
    await whatsapp.run()

    let uri = "https://whatsapp-bot-v2.herokuapp.com"
    wokeDyno({
        url: uri,
        interval: 1200000
    }).start()

})