# Server information

Es ist ein Heroku Server (glacial-anchorage-18932). Seite erreichbar unter: https://glacial-anchorage-18932.herokuapp.com/

Derweil solltet Ihr Heroku CLI installieren und lokal testen.

Wichtig: Lokal vorhandene Dateien, Module, Pakete usw. m ü s s e n serverseitig bereitgestellt werden.

# Logs

Hiermit könnt Ihr Logs ansehen, um ggfs. nicht gleichzeitig zu pushen:
heroku logs --source app --tail

# Vorgehensweise Pull, Commit, Push usw.

Ladet euch wie bisher diese Branch lokal in euer Repo. Legt diese Branch ggfs. lokal an.

Ganz normal 'git add .' danach einen Commit mit message via 'git commit -m "Commit Nachricht"'. 
Wenn Ihr nun ins Gitlab Repo pushen wollt, könnt Ihr das wie gewohnt tun. 

Wenn Ihr auf dem Server deployen wollt, dann müsst Ihr ggfs. die Remote Branch hinzufügen. 
Schaut also zuerst, ob die Heroku Branch bereits via 'git remove -v' da ist. 
Ist dies der Fall, könnt Ihr via 'git checkout -b heroku' in die Remote-Heroku-Branch wechseln. 
Überprüft das nochmal via 'git branch'.
Dann müsste der Kopf auf dem Origin von heroku sitzen und Ihr könnt ganz normal 'git push -u origin heroku' durchführen.

# Datenbank
Es gibt keine kostenfreien MongoDBs mehr für Heroku (wäre sinnvoll gewesen für das npm ltijs-Paket). Daher wird nun eine kostenfreie PostgreSQL-Datenbank gehostet (postgresql-infinite-15588).
Doku zur PostgreSQL gibt es im CLI via 'heroku addons:docs heroku-postgresql'

# LTI-Protokoll
Das npm Paket ims-lti wurde implementiert, um die Authentifizierung aus Moodle nach Lernflix zu ermöglichen.
Man kann im externen Tool in Moodle custom-Variablen zur Übertragung mit bereitstellen.
In app.js können in der Variable sessions alle übertragenen (auch custom-) Parameter eingesehen werden. Diese werden auch serverseitig geloggt. 

# node-js-getting-started

A barebones Node.js app using [Express 4](http://expressjs.com/).

This application supports the [Getting Started on Heroku with Node.js](https://devcenter.heroku.com/articles/getting-started-with-nodejs) article - check it out.

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) and the [Heroku CLI](https://cli.heroku.com/) installed.

```sh
$ git clone https://github.com/heroku/node-js-getting-started.git # or clone your own fork
$ cd node-js-getting-started
$ npm install
$ npm start
```

Your app should now be running on [localhost:5000](http://localhost:5000/).

## Deploying to Heroku

```
$ heroku create
$ git push heroku main
$ heroku open
```
or

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

## Documentation

For more information about using Node.js on Heroku, see these Dev Center articles:

- [Getting Started on Heroku with Node.js](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [Heroku Node.js Support](https://devcenter.heroku.com/articles/nodejs-support)
- [Node.js on Heroku](https://devcenter.heroku.com/categories/nodejs)
- [Best Practices for Node.js Development](https://devcenter.heroku.com/articles/node-best-practices)
- [Using WebSockets on Heroku with Node.js](https://devcenter.heroku.com/articles/node-websockets)
