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
        try {
            request.post(process.env.URL_SYNTHESIZE, options, (error, response, data) => {
                if (!error) {
                    if (response.statusCode === 200) {
                        return resolve(data)
                    } else {
                        return reject(`Error in connection ${response.statusCode}`)
                    }
                } else {
                    return reject(`Error ${error}`)
                }
            })
        } catch (exception) {
            return reject(`Error in convert text to speech ${exception}`)
        }
    })
}

function speechToText(base64MP3) {
    return new Promise((resolve, reject) => {
        const options = {
            body: JSON.stringify({
                audio: {
                    content: base64MP3
                },
                config: {
                    encoding: "WEBM_OPUS",
                    languageCode: "pt-br",
                    sampleRateHertz: 16000
                }
            }),
            headers: {
                "Content-Type": "application/json",
                "X-goog-api-key": process.env.API_KEY //Coloque o token aqui
            }
        }
        try {
            request.post(process.env.URL_RECOGNIZE, options, (error, response, data) => {
                if (!error) {
                    if (response.statusCode === 200) {
                        let resolveData = JSON.parse(data)
                        if (resolveData.results === undefined) {
                            return resolve("Não foi possível obter o texto")
                        }
                        return resolve(JSON.parse(data).results[0].alternatives[0].transcript)
                    } else {
                        return reject(`Error in connection ${response.statusCode}`)
                    }
                } else {
                    return reject(`Error ${error}`)
                }
            })
        } catch (exception) {
            return reject(`Error in convert speech to text ${exception}`)
        }
    })
}


function translate(text, source, target) {
    return new Promise((resolve, reject) => {
        const options = {
            headers: {
                "Content-Type": "application/json",
                "X-goog-api-key": process.env.API_KEY  //Coloque o token aqui
            }
        }

        const url = `${process.env.URL_TRANSLATE}?q=${text}&target=${target}&format=text&source=${source}`

        try {
            request.post(url, options, (error, response, data) => {
                if (!error) {
                    if (response.statusCode === 200) {
                        let resolveData = JSON.parse(data).data
                        if (resolveData.translations === undefined) {
                            return resolve("Não foi possível traduzir")
                        }
                        return resolve(JSON.parse(data).data.translations[0].translatedText)
                    } else {
                        return reject(`Error in connection ${response.statusCode}`)
                    }
                } else {
                    return reject(`Error ${error}`)
                }
            })
        } catch (exception) {
            return reject("Error in convert text to speech")
        }
    })
}

function search(text) {
    return new Promise((resolve, reject) => {

        const url = `${process.env.URL_SEARCH}?key=${process.env.API_KEY}&cx=${process.env.CUSTOM_SEARCH}&searchType=IMAGE&imgSize=large&lr=lang_pt&fileType=jpg&q=${text}`

        try {
            request.get(url, (error, response, data) => {
                if (!error) {
                    if (response.statusCode === 200) {
                        let resolveData = JSON.parse(data)
                        if (resolveData.items === undefined) {
                            return resolve("Não foi possível traduzir")
                        }
                        return resolve(JSON.parse(data).items[0].link)
                    } else {
                        return reject(`Error in connection ${response.statusCode}`)
                    }
                } else {
                    return reject(`Error ${error}`)
                }
            })
        } catch (exception) {
            return reject("Error in convert text to speech")
        }
    })
}

module.exports = {
    textToSpeech,
    translate,
    speechToText,
    search
}