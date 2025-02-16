import express  from "express";
import cors from "cors";
import dotenv from 'dotenv';
// import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
//import WebstoryRouter from "./Router/WebstoryRouter.js";
import WebstoryRouter from "./Router/WebstoryRouter.js";

dotenv.config(); 

const app = express();
const port = process.env.PORT || 5000 ;

// app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use(cors({
    origin: ['http://localhost:3000'],
    methods: ['POST', 'GET', 'PUT','DELETE'],
    credentials: true,
}));

//============ API for user ================

app.use('/api/story', WebstoryRouter);
app.get("/api/test",(req, res)=>{
    res.send("i am from test api aeroway");
})


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
