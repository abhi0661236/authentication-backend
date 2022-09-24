// import bodyParser from 'body-parser';
import env from 'dotenv';
import express from 'express'
import connectdb from './configs/db.js';
import userRoutes from './routes/user.js';

env.config();

const app = express();
const port  = process.env.PORT || 4000;
const username = process.env.DB_USER;
const password = process.env.DB_PASSWORD;

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false}));
// we are no longer needed to use body-parser seperately in express 4.16 or latter versions.
app.use(express.json());
app.use(express.urlencoded({extended: false}));


app.use("", userRoutes);
app.listen(port, ()=>{
    // connect database
    connectdb(username, password);
    console.log('server started at port '+port);
})