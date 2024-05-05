const fs = require('fs');

async function getFiles(dir) {
    return new Promise((resolve, reject) => {
        fs.readFile(dir, (err, data) => {
            if (err) reject(err)
            if (data) resolve(data.toString('utf8'))
        })
    })
}

module.exports = { getFiles };
