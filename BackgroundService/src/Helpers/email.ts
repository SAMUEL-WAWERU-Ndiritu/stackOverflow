import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import path from 'path'
dotenv.config({ path: path.resolve(__dirname, '../../.env') })
import { Pool } from 'pg';
const pgConfig= new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
});
function createTransporter(pgConfig: { host: string; service: string; port: number; auth: { user: string; pass: string } }){
return nodemailer.createTransport(pgConfig)
}

let config ={
    host:'smtp.gmail.com',
    service:'gmail',
    port:587,
    auth:{
        user: 'samuelnderitu495@gmail.com',
        pass: 'vlnanwdotnasiywb'

    }
}

const sendMail = async(messageOptions:any)=>{
    let transporter =createTransporter(config)
    await transporter.verify()
    await transporter.sendMail(messageOptions, (err, info)=>{
        console.log(info);
        
    })
}

export default sendMail