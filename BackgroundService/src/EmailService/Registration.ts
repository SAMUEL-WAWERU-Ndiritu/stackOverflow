import { Pool } from 'pg';
// import pgConfig  from '../Config';
import ejs from 'ejs';
import sendMail from '../Helpers/email';

const pool = new  Pool({user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,});

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isSent: boolean;
  password: string;
}

const sendWelcomeEmail = async () => {
  const client = await pool.connect();
  const users: User[] = await (await client.query("SELECT * FROM users WHERE isSent = false")).rows;

  for (let user of users) {
    ejs.renderFile('Templates/registration.ejs', { name: user.name }, async (error, html) => {
      const message = {
        from: "samuelnderitu495@gmail.com",
        to: user.email,
        subject: "Nodemailer Test",
        html
      };

      try {
        await sendMail(message);
        await client.query(`UPDATE users SET isSent = true WHERE id = '${user.id}'`);
      } catch (error) {
        console.log(error);
      }
    });
  }

  client.release();
};

export default sendWelcomeEmail;
