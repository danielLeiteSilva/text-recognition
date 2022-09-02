const fs = require('fs');

function readFileCache(cacheFile) {
    const buffer = fs.readFileSync(`./${cacheFile}`)
    return JSON.parse(Buffer.from(buffer).toString())
}

function writeFileCache(cacheFile, data) {
    fs.writeFileSync(`./${cacheFile}`, JSON.stringify(data))
}

function changeCache(cacheFile) {
    const file = readFileCache(cacheFile)
    if (file["search"]) {
        file["search"] = false
        writeFileCache(cacheFile, file)
    } else {
        file["search"] = true
        writeFileCache(cacheFile, file)
    }
    return file
}



module.exports = {
    changeCache,
    readFileCache
}