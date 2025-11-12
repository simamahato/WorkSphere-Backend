import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.js';
import departmentRouter from './routes/department.js';
import employeeRouter from './routes/employee.js';
import salaryRouter from './routes/salary.js'
import leaveRouter from './routes/leave.js'
import SettingRouter from './routes/setting.js'
import dashboardRouter from './routes/dashboard.js'
import connectToDatabase from './db/db.js';
import path from 'path';


connectToDatabase()
const app = express()
app.use(cors({
  origin: "https://worksphere-frontend-inky.vercel.app",
  credentials: true
}))
app.use(express.json())
app.use(express.static(path.join('public/uploads')))
app.use('/api/auth', authRouter)
app.use('/api/department', departmentRouter)
app.use('/api/employee', employeeRouter)
app.use('/api/salary', salaryRouter)
app.use('/api/leave', leaveRouter)
app.use('/api/setting', SettingRouter)
app.use('/api/dashboard', dashboardRouter)


app.listen(process.env.PORT, () => {
  console.log(`Server is Running on port ${process.env.PORT}`);
})

