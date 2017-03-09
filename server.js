const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

app.use(bodyParser.json());

readFilePromise = filename => {
    return new Promise((res, rej) => {
        fs.readFile(filename, 'utf8', (error, data) => {
            if (error) {
                const tempErr = new Error('Wystąpił błąd odczytu');
                rej(tempErr);
            } else {
                res(data);
            }
        });
    });
}

writeFilePromise = (filename, data) => {
    return new Promise((res, rej) => {
        fs.writeFile(filename, data, (error, data) => {
            if (error) {
                const tempErr = new Error('Wystąpił błąd zapisu');
                throw tempErr;
                rej(tempErr);
            } else {
                res();
            }
        });
    })
}

errorResponse = (error, res) => {
    console.error(error.message);
    res.send("Wystąpił błąd podczas przetwarzania pliku");
}

app.get('/getNote', function(req, res) {
    console.log('Otrzymałem żądanie GET do getNote');

    readFilePromise('./test22.json')
        .then(data => res.send('Zawartość pliku test.json: ' + data))
        .catch(error => errorResponse(error, res))
})

app.post('/updateNote/:note', function(req, res) {

    let responseTxt = '';
    let fileContent = '';

    console.log('Otrzymałem żądanie POST do updateNote');

    readFilePromise('./test.json')
        .then(data => {
            fileContent = data + req.params.note;
            responseTxt = "Dotychczasowa zawartość pliku test.json: " + data + ' ... ';
            return writeFilePromise('./test.json', fileContent);
        })
        .then(() => {
            responseTxt += "Nowa zawartość pliku test.json: " + fileContent;
            res.send(responseTxt);
        })
        .catch(error => errorResponse(error, res));
})
app.listen(3000);