const mongoose = require('mongoose');

const databaseConnect = () => {
    console.log('DB_LOCAL_URI:', process.env.DB_LOCAL_URI); 
    mongoose.connect(process.env.DB_LOCAL_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then((con) => {
        console.log(`MongoDB connected with the host: ${con.connection.host}`);
    }).catch((err) => {
        console.error(`Database connection failed: ${err.message}`);
        process.exit(1);
    });
}

module.exports = databaseConnect;
