const server = require('./server');

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server is listening on http://localhost:${PORT}`));

// const express = require('express');
// var github = require('octonode');
// const app = express();
// const port = 3000;
// var client = github.client();
// var ghme = client.me();
// var ghuser = client.user('dalmau77');
// var ghrepo = client.repo('dalmau77/hub');



// app.get('/', (req, res) => {
//   client.get('/users/dalmau77', {}, function (err, status, body, headers) {
//     console.log(body); //json object
//   });
// })

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`)
// })