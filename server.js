const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const ip = require('ip');

const express = require('express');
const app = express();
const Busboy = require('busboy');

const config = require('./config');

const dataFolder = path.resolve('.', 'tmp');
const allowedIPs = [
    '::1',
    '127.0.0.1'
];

// if (fs.existsSync(dataFolder)) {
//     rimraf.sync(dataFolder);
// }

// fs.mkdirSync(dataFolder);

app.get(`${config.path}/:file`, function (req, res) {
    const file = path.resolve(dataFolder, req.params.file);

    if (!file.startsWith(dataFolder)) {
        return res.sendStatus(403);
    }

    fs.readFile(file, (err, data) => {
        if (err) {
            res.type('text/plain');
            res.send('Error!');
            return;
        }

        res.type('png');
        res.send(data);
    });
});

app.post('/', function (req, res) {
    if (allowedIPs.indexOf(req.ip) < 0) {
        res.sendStatus(403);
        return;
    }

    var name = '';
    var bufs = [];
    var bufsSize = 0;
    var busboy = new Busboy({ headers: req.headers });

    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        name = filename;
        console.log('File [' + filename + '] receive');

        file.on('data', function (data) {
            bufs.push(data);
            bufsSize += data.length;
        });

        file.on('end', function () {
            console.log('File [' + filename + '] finished');
        });
    });

    busboy.on('finish', function () {
        fs.writeFile(path.resolve(dataFolder, name), Buffer.concat(bufs, bufsSize), function (err) {
            if (err) {
                console.log('Error ' + err);
                res.type('text/plain');
                res.send('Error');
            } else {
                res.send(`${config.domain}${config.path}/${name}`);
            }
        });
    });

    req.pipe(busboy);
});

app.listen(3000);
