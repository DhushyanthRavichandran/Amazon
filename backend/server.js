const app=require('./app');
const databaseConnect = require('./config/database');
const path=require('path');

databaseConnect();
const PORT = process.env.PORT || 3000;

const server=app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on('unhandledRejection',(err)=>{
  console.log(`Error :${err.message}`);
  console.log('shutting down due to server unhandledRejection');
  server.close(()=>{
    process.exit(1);
  })
})

process.on('uncaughtException',(err)=>{
  console.log(`Error :${err.message}`);
  console.log('shutting down due to server unhandledRejection');
  server.close(()=>{
    process.exit(1);
  })
})