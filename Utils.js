const fs = require('fs');
const mime = require('mime-types');

function dateHourLog() {
    const date = new Date()
    return date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    })
}

async function createFile(name, client, message) {
    try {
        const buffer = await client.decryptFile(message);
        const fileName = `${name}.${mime.extension(message.mimetype)}`;
        fs.writeFileSync(fileName, buffer);

        return fileName

    } catch (error) {
        console.log(`[createFile] - Houve um erro ao criar o arquivo  ${error}`)
    }

    return
}

async function createFileWithExt(name, base64, ext) {
    try {

        let buffer = Buffer.from(base64, 'base64')
        const fileName = `${name}.${ext}`;
        fs.writeFileSync(fileName, buffer);

        return fileName

    } catch (error) {
        console.log(`[createFileWithExt] - Houve um erro ao criar o arquivo ${error}`)
    }

    return
}



module.exports = {
    dateHourLog,
    createFile,
    createFileWithExt
}