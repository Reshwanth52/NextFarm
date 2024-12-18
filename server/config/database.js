const mongoose = require('mongoose')

exports.connectDatabase = () => {
    mongoose.connect(process.env.MONGO_URI)
    .then((con)=> console.log(`Database connected on ${con.connection.host}`));
}