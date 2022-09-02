const { createWorker } = require('tesseract.js')

const worker = createWorker({
    logger: m => m
});

async function extractText(body) {
    await worker.load();
    await worker.loadLanguage('por')
    await worker.initialize('por')

    const { data: { text } } = await worker.recognize(body.image.url)

    return text
        .split("\n")
        .join("\s")
        .toLowerCase()
}

async function extractTextLocal(fileName) {
    await worker.load();
    await worker.loadLanguage('por')
    await worker.initialize('por')

    const { data: { text } } = await worker.recognize(`./${fileName}`)

    return text
        .split("\n")
        .join("\s")
        .toLowerCase()
}


module.exports = {
    extractText,
    extractTextLocal
}