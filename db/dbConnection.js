import mongoose from 'mongoose'

const dbConnection = ()=>{
    mongoose.connect(process.env.DB_CONNECTION)
    .then(console.log('DB connection done..'))
    .catch((err)=> console.log('Connection failed!!' , err.message))
}

export default dbConnection