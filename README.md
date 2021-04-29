

# Environmental Variables (.env)

Um Sensiblen Daten (Datenbank, Moodle Schlüssel etc.) zu sichern, wurden diese Daten in eine .env Datei ausgelagert.
Diese Datei darf n i c h t in Gitlab gepusht werden, da sonst unsere Anwendungsdaten öffentlich sind.

Deswegen wurde die .env Datei in die .gitignore Datei eingetragen, welche das Pushen der .env Datei verhindert.
Die .env Datei muss sich aber auf dem Server befinden und lokal zum Entwickeln. Als Hilfe hat die Datei sample env liefert hierbei die Struktur, welche unsere .env hat. 

.env in der lokalen Entwicklungsumgebung einrichten:

1. Die .env Datei muss angelegt werden mit der Struktur, welche in sample env zu finden ist.
2. Die Kennwörter und Schlüssel eintragen, welche man von uns bekommt

.env auf dem Server (unsere Heroku Server + HRW Server) einrichten:

1. Die .env Datei muss angelegt werden mit der Struktur, welche in sample env zu finden ist.
2. Die Kennwörter und Schlüssel eintragen, welche man von uns bekommt
3. in .gitignore den Eintrag *.env auskommentieren mit #.
4. Auf den SERVER pushen
5. Nach Erfolgreichen Push sofort die *.env Datei wieder entkommentieren.

Somit ist die Environment Datei auf dem Server und Gitlab ist geschützt durch .gitignore.
Die .env Datei auf dem Server ist nur anzupassen mit den Schritten 3-5, wenn man Kennwörter etc. ändern muss.


Falls trotz .gitignore die .env in Git angezeigt wird:

To the people who might be searching for this issue still, are looking at this page only.

This will help you remove cached index files, and then only add the ones you need, including changes to your .gitignore file.

1. git rm -r --cached .  
2. git add .
3. git commit -m 'Removing ignored files'


# Datenbank
Es gibt keine kostenfreien MongoDBs mehr für Heroku (wäre sinnvoll gewesen für das npm ltijs-Paket). Daher wird nun eine kostenfreie PostgreSQL-Datenbank gehostet (postgresql-infinite-15588).
Doku zur PostgreSQL gibt es im CLI via 'heroku addons:docs heroku-postgresql'

moodledatauser:

-firstname (char varying)
-lastname (char varying)
-fullname (char varying)
-email (char varying)
-userid [PK] (int)
-profilepicture (char varying)
-moodleRoom (char varying)
-timestamp(timestamp without time zone)

rooms:

-lernflixroomid [PK] (int)
-lernflixroomname (char varying)
-moodleroomid (int)
-moodleroomname (char varying)
-timestamp (timestamp without time zone)

feedbackLernflix:

-id [PK] (int)
-userid (int)
-username (char varying)
-feedbacktext (char varying)
-moodleroom (char varying)
-moodleroomname (char varying)
-timestamp (timestamp without time zone)

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
