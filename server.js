const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require('dotenv').config();
const axios = require('axios');
const withAuth = require('./withAuth.js');
const github = require('octonode');
const Git = require("nodegit");


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
    "name": "Hello-World",
    "description": "This is your first repo",
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
        console.log(repo,'REPO')
      });
      // console.log("Is the repository bare? %s", Boolean(repository.isBare()));
    });
}

app.get('/', withAuth, (req, res) => {
  console.log('authorized!');
  res.status(200).send('Authorized');
});

app.post('/github', withAuth, async (req, res) => {
  const repoString = req.body.repo;

  // const headers = {
  //   headers: {
  //     "Authorization": `Bearer ${process.env.GITHUB_TOKEN}`,
  //     "Content-Type": "application/json"
  //   }
  // };

  // let github = await axios.get('https://api.github.com/user/repos', headers);
  // console.log(github, 'yoyo');
  // res.status(200);

  // var client = github.client(`${process.env.GITHUB_TOKEN}`);
  // var me = client.me()
  // me.fork('SanDiegoCodeSchool/mobtimer-react', (err) => {
    // var ghrepo = client.repo('DiegosPlayground/mobtimer-react');
    // ghrepo.update({
    //   name: 'test123'
    // } .catch(err => console.log(err)))
  // });

  // client.get('/user', {}, function (err, status, body, headers) {
  //   console.log(body); //json object
  // });
  
  // CreateRepo();
  // CloneRepo();
  var pathToRepo = require("path").resolve("./tmp");
    Git.Repository.open(pathToRepo).then(function (repo) {
      console.log(repo.length())
  })
});

module.exports = app;

