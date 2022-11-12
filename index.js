const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();

const app = express();
const port = process.env.PORT || 4000;
app.use(express.json());
app.use(cors());

// * Mongodb connect:::::::::::::::::::::
const uri = `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASSWORD}@cluster0.we2oxi5.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1
});

const dbConnect = () => {
    try {
        client.connect();
        console.log('Database connected')
    } catch (error) {
        console.log(error.message)
    }
}
dbConnect();

app.post('/note/:name', async (req, res) => {
   try {
    const name = req.params.name;
    const Note = client.db('note').collection(name);

       const note = await Note.insertOne(req.body);
       if (note.insertedId) {
           res.send({
               succees: true,
               message:'Successfully added'
           })
       }
       else {
           res.send({
               succees: false,
               message:'Unsuccessfully'
               })
    }
   } catch (error) {
       res.send({
           succees: false,
           message:error.message
    })
    }

})
app.get('/note/:name', async (req, res) => {
    try {
        const Note = client.db('note').collection(req.params.name);

        const cursor = Note.find({});
        const note = await cursor.toArray();

        res.send({
            succees: true,
            message: "successfull",
            data:note
        })
    } catch (error) {
        res.send({
            succees: false,
            message:error.message
        })
    }
})

app.get('/note', async (req, res) => {
    try {
        const Note = client.db('note').collection(req.query.name);
        const id = req.query.id;
        const cursor =await Note.findOne({_id : ObjectId(id)})
        res.send(cursor);
    } catch (error) {
        res.send({
            succees: false,
            message:"Can't get Note"
        })
    }
    
})

//Update:::::::::::::::::::::::

app.patch('/note/:id', async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    const Note = client.db('note').collection(req.query.name);
    const cursor = await Note.update({ _id: ObjectId(id) }, { $set: body  });
    res.send(cursor);
})


//Delete Note:::::::::::::::::::::::::::::::::::::
app.delete('/note/:id', async (req, res) => {
    const Note = client.db('note').collection(req.query.name);

    const id = req.params.id;
    const result = await Note.deleteOne({ _id: ObjectId(id) });

    if (result.deletedCount) {
        res.send({
            succees: true,
            message: "Successfully deleted"
        })
    } else {
        res.send({
            succees: false,
            message: "Unsuccessfull"
        })
    }

})

app.get('/', (req, res) => {
    res.send('server started successfully');
})

app.listen(port, () => {
    console.log('server started on', port)
})