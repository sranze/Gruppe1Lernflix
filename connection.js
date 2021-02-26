
const { Sequelize } = require('sequelize');


const sequelize = new Sequelize('postgres://hqeqpijokilgsq:f02927df9cdeb15c6314dc34dacefff33ab082175f94f81c6be5fde3858ee5a0@ec2-52-70-67-123.compute-1.amazonaws.com:5432/dqaaogcnf104s') // Example for postgres



try {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}