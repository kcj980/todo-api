import mongoose from 'mongoose';

//import { DATABASE_URL } from '../env.js';
import * as dotenv from 'dotenv';
dotenv.config();

import Task from '../models/Task.js';
import data from './mock.js';

mongoose.connect(process.env.DATABASE_URL);

await Task.deleteMany({});
await Task.insertMany(data);

mongoose.connection.close();