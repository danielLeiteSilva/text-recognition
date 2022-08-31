const { createWorker } = require('tesseract.js')

const worker = createWorker({
    logger: m => m
});

async function extractText(body) {
    await worker.load();
    await worker.loadLanguage('por')
    await worker.initialize('por')

    const { data: { text } } = await worker.recognize(body.image.url)
    await worker.terminate()

    return text.split("\n").join(" ").toLowerCase()
}


module.exports = {
    extractText
}