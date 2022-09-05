//Enviroment
require('dotenv').config()

//Libs
const venom = require('venom-bot');
const fs = require('fs')

//services
const googleService = require('./GoogleService')
const tesseractService = require('./TesseractService')

//Cache
const cache = require('./Cache')

//utils
const { dateHourLog, createFile, createFileWithExt } = require('./Utils')

//Prototypes
String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function run() {
    venom.create({ session: 'session-name', multidevice: true })
        .then((client) => start(client))
        .catch((erro) => {
            console.log(erro);
        });
}

function start(client) {
    client.onMessage(async (message) => {

        try {

            let msg = ""
            if (message.body !== undefined) {
                msg = message.body.toLowerCase()
            }

            if (msg === '/search' && message.isGroupMsg === false) {
                cache.changeCache(message.from)
                const validate = cache.readFileCache()
                console.log(`[${dateHourLog()}] Usuário ${message.notifyName} alterou valor do cache para ${validate[message.from]}...`)
            } else if (message.mimetype.includes("audio") && message.isGroupMsg === false) {

                console.log(`[${dateHourLog()}] Usuário ${message.notifyName} enviou um audio...`)
                await client.sendText(message.from, '⌛ Estamos processando sua resposta. Aguarde...')

                const buffer = await client.decryptFile(message);
                const base64 = Buffer.from(buffer).toString('base64')

                let text = await googleService.speechToText(base64)
                await client.sendText(message.from, `🎤 Audio para 📝 texto: \n\n${text.capitalize()}`)

                let validate = cache.readFileCache()

                if (validate[message.from]) {
                    const image = await googleService.search(text)
                    await client.sendImage(message.from, image, 'image-search')
                    cache.changeCache(message.from)
                    validate = cache.readFileCache()
                    console.log(`[${dateHourLog()}] Usuário ${message.notifyName} alterou valor do cache para ${validate[message.from]}...`)
                }

            } else if (message.mimetype.includes("image") && message.isGroupMsg === false) {

                console.log(`[${dateHourLog()}] Usuário ${message.notifyName} enviou uma imagem...`)
                await client.sendText(message.from, '⌛ Estamos processando sua resposta. Aguarde...')

                const fileName = await createFile("image", client, message)

                const text = await tesseractService.extractTextLocal(fileName)
                const translated = await googleService.translate(text, "pt", 'en')
                const resolve = await googleService.textToSpeech(translated, 'en')

                await createFileWithExt("audio", resolve, "mp3")

                await client.sendText(message.from, `🗣️ Português: \n${text.capitalize()}`)
                await client.sendText(message.from, `🗣️ Inglês: \n${translated.capitalize()}`)
                await client.sendVoice(message.from, './audio.mp3')
            } else {
                console.log(`[${dateHourLog()}][start] - Mídia inválida`)
                await client.sendText(message.from, `❌ Mídia não reconhecida. Envie uma imagem 🖼️ ou um áudio 🎤`)
            }

        } catch (error) {
            console.log(`[${dateHourLog()}][start] - Houve um erro: ${error}`)
            await client.sendText(message.from, `❌ Não foi possível efetuar a leitura do arquivo. Por favor, envie outro arquivo!!!`)
        }
    });
}


module.exports = {
    run
}