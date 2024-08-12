const mongoose=require('mongoose');

const databaseConnect=()=>{
    mongoose.connect(process.env.DB_LOCAL_URI).then((con)=>{
        console.log(`this db is connected with the ${con.connection.host} `)
       
    })
}

module.exports=databaseConnect;