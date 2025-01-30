import express from 'express'
import cors from 'cors'
import authRouter from './routes/auth.js'
import departmentRouter  from './routes/department.js'
import studentRouter  from './routes/student.js'
import leaveRouter from './routes/leave.js'
import connectToDatabase from './db/db.js'
import path from 'path'
import settingRouter from './routes/setting.js'
// const express=require('express')
connectToDatabase()
const app= express()
app.use(cors({
    origin : "https://smart-leave-client.vercel.app",
    credentials:true
}))
app.use(express.json())
app.use("/public/uploads", express.static(path.resolve("public/uploads")));
app.use('/auth',authRouter)
app.use('/department',departmentRouter)
app.use('/student',studentRouter)
app.use('/leave',leaveRouter)
app.use('api/setting', settingRouter)
app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
})