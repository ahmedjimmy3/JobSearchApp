import express from 'express'
import dotenv from 'dotenv'
import dbConnection from './db/dbConnection.js'
import errorHandler from './src/middlewares/errorHandler.js'
import userRouters from './src/modules/user/user.router.js'
import companyRouter from './src/modules/company/company.router.js'
import jobRouter from './src/modules/job/job.router.js'

const app = express()
dotenv.config()
dbConnection()

app.use(express.json())
app.use('/user',userRouters)
app.use('/company',companyRouter)
app.use('/job',jobRouter)

app.use(errorHandler)

app.listen(3000, () => console.log(`App listening on port 3000!`))