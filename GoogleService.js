const request = require('request')


function textToSpeech(text, lang) {
    return new Promise((resolve, reject) => {
        const options = {
            body: JSON.stringify({
                input: {
                    text: text
                },
                voice: {
                    languageCode: lang
                },
                audioConfig: {
                    audioEncoding: "MP3"
                }
            }),
            headers: {
                "Content-Type": "application/json",
                "X-goog-api-key": process.env.API_KEY //Coloque o token aqui
            }
        }

        request.post("https://texttospeech.googleapis.com/v1/text:synthesize", options, (error, response, data) => {
            return resolve(data)
        })
    })
}

function speechToText() {

}


function translate(text, source, target) {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                "Content-Type": "application/json",
                "X-goog-api-key": process.env.API_KEY //Coloque o token aqui
            }
        }

        const url = `https://translation.googleapis.com/language/translate/v2?q=${text}&target=${target}&format=text&source=${source}`

        request.post(url, options, (error, response, data) => {
            return resolve(JSON.parse(data).data.translations[0].translatedText)
        })
    })
}

module.exports = {
    textToSpeech,
    translate
}