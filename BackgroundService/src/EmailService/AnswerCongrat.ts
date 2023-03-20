import { Pool } from 'pg';
// import pgConfig from '../Config';
import ejs from 'ejs';
import sendMail from '../Helpers/email';
// const pgConfig:= new pg.Pool({
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
// });
// const poolConfig: Pool = pgConfig;

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isSent: boolean;
  password: string;
}

interface Answer {
  id?: number;
  body: string;
  user_id: number;
  question_id: number;
  created_at?: Date;
  updated_at?: Date;
  isSent: boolean;
  accepted: boolean;
}

const sendCongratsEmail = async () => {
  const pool = new Pool({user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,});
  const client = await pool.connect();
  const answers: Answer[] = await (await client.query("SELECT * FROM answers WHERE accepted = true && isSent = false")).rows;
  const users: User[] = await (await client.query(`SELECT * FROM users WHERE id IN (SELECT DISTINCT user_id FROM answers WHERE accepted = true && isSent = false)`)).rows;

  for (let user of users) {
    ejs.renderFile('Templates/Congrats.ejs', { name: user.name }, async (error, html) => {
      const message = {
        from: "samuelnderitu495@gmail.com",
        to: user.email,
        subject: "Nodemailer Test",
        html
      };
      try {
        await sendMail(message);
        await client.query(`UPDATE answers SET isSent = true WHERE user_id = '${user.id}'`);
      } catch (error) {
        console.log(error);
      }
    });
  }

  client.release();
};

export default sendCongratsEmail;
