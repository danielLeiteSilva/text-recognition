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
                "X-goog-api-key": process.env.API_KEY
            }
        }

        request.post("https://texttospeech.googleapis.com/v1/text:synthesize", options, (error, response, data) => {
            if (response.statusCode === 200 && !error) {
                return resolve(data)
            } else {
                console.log(response.statusCode)
                console.log(error)
            }
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
                "X-goog-api-key": process.env.API_KEY
            }
        }

        const url = `https://translation.googleapis.com/language/translate/v2?q=${text}&target=${target}&format=text&source=${source}`

        request.post(url, options, (error, response, data) => {
            if (response.statusCode === 200 && !error) {
                console.log(response.statusCode)
                return resolve(JSON.parse(data).data.translations[0].translatedText)
            }
        })
    })
}

module.exports = {
    textToSpeech,
    translate
}