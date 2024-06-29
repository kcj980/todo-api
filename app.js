import mongoose from 'mongoose';
import cors from 'cors';


//import { DATABASE_URL } from './env.js';
import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import Task from './models/Task.js';

mongoose.connect(process.env.DATABASE_URL).then(() => console.log('Connected to DB'));

const app = express();
app.use(cors());
app.use(express.json());

function asyncHandler(handler){
  return async function (req, res){
    try{
      await handler(req, res);
    } catch(e){
      if(e.name === 'ValidationError'){
        res.status(400).send({message: e.message});
      }else if(e.name === 'CastError'){
        res.status(404).send({message: 'Cannot find given id.'});
      }else{
        res.status(500).send({message: e.message});
      }
    }
  }
}

app.get('/tasks', asyncHandler(async (req, res) => {
  /**
   * 쿼리 파라미터
   * sort: 'oldest'인 경우 오래된 태스크 기준으로 내림차순, 나머지경우 새로만들어진 순서대로 정렬
   * count: 태스크 개수
   */
  const sort = req.query.sort;
  const count = Number(req.query.count) || 0;

  const sortOption = {createdAt:sort === 'oldest' ? 'asc' : 'desc'};

  const tasks = await Task.find().sort(sortOption).limit(count);

  res.send(tasks);
}));

app.get('/tasks/:id', asyncHandler(async (req, res)=>{
  const id = req.params.id;
  const task = await Task.findById(id);
  if(task){
    res.send(task);
  }else{
    res.status(404).send({message: 'Cannot find given id.'});
  }
  
}));

app.post('/tasks', asyncHandler(async (req, res)=>{
  const Newdata = await Task.create(req.body);
  res.status(202).send(Newdata);

  
}));

app.patch('/tasks/:id', asyncHandler(async(req, res)=>{
  const id = req.params.id;
  const task = await Task.findById(id);
  if(task){
    Object.keys(req.body).forEach((key)=>{
      task[key] = req.body[key];
    });
    await task.save();
    res.send(task);
  }else{
    res.status(404).send({message: "Cannot find given id."});
  }
}));

app.delete('/tasks/:id', asyncHandler(async(req, res)=>{
  const id = req.params.id;
  const task = await Task.findByIdAndDelete(id);
  if(task){
    res.sendStatus(204);
  }else{
    res.status(404).send({message: "Cannot find given id."});
  }
  
}));

//app.listen(3000, () => console.log('Server Started'));
app.listen(process.env.PORT || 3000, () => console.log('Server Started'));