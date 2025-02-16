import express from "express";
import { addwebstory, fetchstory, fetchonestory } from "../Controller/WebstoryController.js";
// import multer from multer;

// const storage = multer.memoryStorage(); 
// const upload = multer({ storage: storage });

const WebstoryRouter = express.Router();

WebstoryRouter.post('/addstory', addwebstory)
              .get('/list-story', fetchstory)
              .get('/fetchonestory/:id',fetchonestory);


export default WebstoryRouter;