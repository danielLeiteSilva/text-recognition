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

function changeCache() {
    const file = readFileCache()
    file["search"] = file["search"] ? false : true
    writeFileCache(file)

    return file
}

console.log(changeCache())


module.exports = {
    changeCache,
    readFileCache
}