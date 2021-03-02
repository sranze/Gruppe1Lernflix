const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 3000

const Database = require('ltijs-sequelize')
const lti = require('ltijs').Provider
const { Sequelize } = require('sequelize');



const db = new Database("dqaaogcnf104s", "hqeqpijokilgsq", "f02927df9cdeb15c6314dc34dacefff33ab082175f94f81c6be5fde3858ee5a0", {
    host: "ec2-52-70-67-123.compute-1.amazonaws.com",
    dialect: 'postgres',
    "dialectOptions": {
      "ssl": {
            require: true,
            rejectUnauthorized: false
            }
    }
    });

// Setup provider
lti.setup('LTIKEY', // Key used to sign cookies and tokens
  {
    plugin: db // Passing db object to plugin field
  },
  { // Options
    appRoute: '/', loginRoute: '/login', // Optionally, specify some of the reserved routes
    cookies: {
      secure: false, // Set secure to true if the testing platform is in a different domain and https is being used
      sameSite: '' // Set sameSite to 'None' if the testing platform is in a different domain and https is being used
    },
    devMode: false // Set DevMode to true if the testing platform is in a different domain and https is not being used
  }
)

// Set lti launch callback
lti.onConnect((token, req, res) => {
  console.log(token)
  //return res.send('It\'s alive!')
})

const setup = async () => {
  // Deploy server and open connection to the database
  await lti.deploy({ port: 3000 }) // Specifying port. Defaults to 3000

  // Register platform
  await lti.registerPlatform({
    url: 'https://platform.url',
    name: 'Platform Name',
    clientId: 'TOOLCLIENTID',
    authenticationEndpoint: 'https://platform.url/auth',
    accesstokenEndpoint: 'https://platform.url/token',
    authConfig: { method: 'JWK_SET', key: 'https://platform.url/keyset' }
  })
}

setup()


// First Try: Old Connection to database

/*const sequelize = new Sequelize("dqaaogcnf104s", "hqeqpijokilgsq", "f02927df9cdeb15c6314dc34dacefff33ab082175f94f81c6be5fde3858ee5a0", {
    host: "ec2-52-70-67-123.compute-1.amazonaws.com",
    dialect: 'postgres',
    "dialectOptions": {
      "ssl": {
            require: true,
            rejectUnauthorized: false
            }
    }
    });

//Sequelize will keep the connection open by default, and use the same connection for all queries. If you need to close the connection, call sequelize.close() (which is asynchronous and returns a Promise).
//For saving stuff on DB: https://stackoverflow.com/questions/63611772/sequelize-does-not-creating-a-table-shows-this-result-executing-default-se

*/
express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))




/*
try {
   db.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

*/