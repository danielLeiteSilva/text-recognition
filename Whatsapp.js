require('dotenv').config()
const venom = require('venom-bot');
const mime = require('mime-types');
const fs = require('fs')


//services
const googleService = require('./GoogleService')
const tesseractService = require('./TesseractService')

venom.create({
    session: 'session-name', //name of session
    multidevice: true // for version not multidevice use false.(default: true)
})
    .then((client) => start(client))
    .catch((erro) => {
        console.log(erro);
    });

function start(client) {
    client.onMessage(async (message) => {
        try {

            if (message.isMedia) {
                const buffer = await client.decryptFile(message);
                const fileName = `image.${mime.extension(message.mimetype)}`;
                fs.writeFileSync(fileName, buffer);

                const text = await tesseractService.extractTextLocal(fileName)
                await client.sendText(message.from, `Português: \n${text}`)

                const translated = await googleService.translate(text, "pt", 'en')
                await client.sendText(message.from, `Inglês: \n${translated}`)

                const resolve = await googleService.textToSpeech(translated, 'en')

                let buff = Buffer.from(resolve, 'base64')
                fs.writeFileSync('audio.mp3', buff)

                await client.sendVoice(message.from, './audio.mp3')
            }

        } catch (error) {
            console.log(`Houve um erro: ${error.message}`)
        }

    });
}