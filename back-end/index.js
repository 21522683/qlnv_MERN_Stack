import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connect from './database/database.js'
import { StaffRouter } from './routes/index.js'
    
const PORT = process.env.PORT || 4000
const app = express();



app.use(cors())
app.use(express.json({
    limit: '500mb'
}));


app.use('/api/staffs', StaffRouter); 


app.get('/', (req,res) => {
    res.send('Hello from server side')
})

app.listen(PORT, async () => {
    await connect();
    console.log(`Server is running at PORT ${PORT}`);
})