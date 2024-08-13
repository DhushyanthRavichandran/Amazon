const app = require('./app');
const databaseConnect = require('./config/database');
const path = require('path');

databaseConnect();
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handling unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  console.log('Shutting down due to unhandled promise rejection');
  server.close(() => {
    process.exit(1);
  });
});

// Handling uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  console.log('Shutting down due to uncaught exception');
  server.close(() => {
    process.exit(1);
  });
});
