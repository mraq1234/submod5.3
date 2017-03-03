const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

app.use(bodyParser.json());

readFilePromise = filename => {
    return new Promise((res, rej) => {
                fs.readFile(filename, 'utf8', (error, data) => {
                    if (error) {
                        rej(error);
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
                        rej(error);
                    } else {
                        res();
                    }
                });
        }
    )
}

readErrorMsg = (error, res) => {
    console.error('Wystąpił błąd podczas odczytu pliku test. ', error.message);
    res.send('Bardzo nam przykro, wystąpiły kłopoty przy przetwarzaniu żądania');
}

app.get('/getNote', function (req, res) {
    console.log('Otrzymałem żądanie GET do getNote ' + res);

    readFilePromise('./test.json')
    .then(data => res.send('Zawartość pliku test.json: ' + data))
    .catch(error => readErrorMsg(error, res))
});


app.post('/updateNote/:note', function(req, res){
    
    let responseTxt = '';
    let fileContent = '';

    console.log('Otrzymałem żądanie POST do updateNote');

    readFilePromise('./test.json')
    .then (data => {
        fileContent = data + req.params.note;
        responseTxt = "Dotychczasowa zawartość pliku test.json: " + data + ' ... ';
        writeFilePromise('./test.json', fileContent)
        .then (() => {
            responseTxt += "Nowa zawartość pliku test.json: " + fileContent;
            res.send(responseTxt);
        })
        .catch (error => {
            console.error('Wystąpił błąd podczas zapisu pliku test.json', error.message)
            res.send('Bardzo nam przykro, wystąpiły kłopoty przy przetwarzaniu żądania');
        })
    })
    .catch (error => readErrorMsg(error, res));
})
app.listen(3000);