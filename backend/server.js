const app = require('./app');
const databaseConnect = require('./config/database');
const path = require('path');
const cors=require('cors')
databaseConnect();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'https://d-amazon-ecomm.vercel.app', // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
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
