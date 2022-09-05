const fs = require('fs');
const path = require('path')

const pathFile = path.join(__dirname, ".", "cache.json")

function readFileCache() {
    const buffer = fs.readFileSync(pathFile)
    return JSON.parse(Buffer.from(buffer).toString())
}

function writeFileCache(data) {
    fs.writeFileSync(pathFile, JSON.stringify(data))
}

function changeCache(user) {
    const file = readFileCache()

    if (!file[user]) {
        file[user] = true
    } else {
        file[user] = file[user] ? false : true
    }
    writeFileCache(file)
    return file
}


module.exports = {
    changeCache,
    readFileCache
}