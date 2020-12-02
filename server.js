const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require('dotenv').config();
const axios = require('axios');
const withAuth = require('./withAuth.js');
const github = require('octonode');
const Git = require("nodegit");
const fs = require('fs')


const app = express();

// middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(morgan("dev"));
// app.use(express.static('src'));

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header(
//         'Access-Control-Allow-Headers',
//         'Origin, X-Requested-With, Content-Type, Accept, Authorization'
//     );
//     if (req.method === 'OPTIONS') {
//         res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
//         return res.status(200).json({});
//     }
//     next();
// });


async function CreateRepo() {
  const client = github.client(`${process.env.GITHUB_TOKEN}`);
  var me = client.me();

  me.repo({
    "name": "TestWorld",
    "description": "This is your first repo",
    "auto_init": "true"
  }, function (err, data, headers) {
    console.log('error:' + err);
    console.log('data:' + data)
  });
  // const result = await me.forkAsync('SanDiegoCodeSchool/mobtimer-react')
  // console.log(result);

}
async function EditRepo() {
  const client = github.client(`${process.env.GITHUB_TOKEN}`);

  var ghrepo = client.repo('DiegosPlayground/mobtimer');
  console.log(ghrepo.info())
  // ghrepo.update({
  //   repo: 'www.hi.com'
  // })
}

async function CloneRepo() {
  var cloneURL = "https://github.com/DiegosPlayground/mobtimer";
  var localPath = require("path").join(__dirname, "tmp");
  var cloneOptions = {};
  cloneOptions.fetchOpts = {
    callbacks: {
      certificateCheck: function () { return 0; },
      credentials: function () {
        return Git.Cred.userpassPlaintextNew(process.env.GITHUB_TOKEN, "x-oauth-basic");
      }
    }
  };

  var cloneRepository = Git.Clone(cloneURL, localPath, cloneOptions)
  var errorAndAttemptOpen = function () {
    return Git.Repository.open(localPath);
  };
  cloneRepository.catch(errorAndAttemptOpen)
    .then(function (repository) {
      // Access any repository methods here.
      console.log(repository)
      Git.Repository.open("tmp").then(function (repo) {
        console.log(repo, 'REPO')
      });
      // console.log("Is the repository bare? %s", Boolean(repository.isBare()));
    });
}

app.get('/', withAuth, (req, res) => {
  console.log('authorized!');
  res.status(200).send('Authorized');
});

app.post('/github', withAuth, async (req, res) => {
  const filepath = './tmp/server/index.js';
  const file_buffer = fs.readFileSync(filepath);
  const contents_in_base64 = file_buffer.toString('base64');


  let config = {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      accept: 'application/vnd.github.v3+json'
    }
  }

  let data = {
    content: contents_in_base64,
    encoding: 'base64'
  }
  const repoString = req.body.repo;
  let refData;
  let headData;
  let blobSha;


  axios.get('https://api.github.com/repos/DiegosPlayground/TestWorld/git/refs')
    .then(response => {
      refData = response.data[0].object;
      return axios.get(refData.url)
    })
    .then(response => {
      headData = response.data;
    })
    .catch(err => console.log(err))
    .catch(error => console.log(error, 'error'))

  axios.post('https://api.github.com/repos/DiegosPlayground/TestWorld/git/blobs', data, config)
    .then(response => {
      blobSha = response.data.sha
      console.log(response)
    })
    .catch(err => console.log(err))

  res.status(200).send('working');

});

module.exports = app;

