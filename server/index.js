require('dotenv').config();
const PORT= 8000;
const { v4: uuidv4 } = require('uuid');
const express= require('express');
const { MongoClient }= require('mongodb');
const jwt= require('jsonwebtoken');
const cors= require('cors');
const bcrypt= require('bcrypt');

const uri= process.env.URI;
//console.log(uri)

const app= express();
app.use(cors());
app.use(express.json());

app.listen(PORT, ()=> console.log('Magic append on port ' + PORT));

//GET

app.get('/', (req, res)=> {
    res.json('Hello Kokotto !');
});

app.get('/user', async (req, res)=> {
    const client= new MongoClient(uri);
    //const userId= req.query.userId;

    const userId= "test001";

    try{
        await client.connect();
        const database= client.db('pioupiou-data');
        const users= database.collection('users');
        const query= { user_id: userId };
        const user= await users.findOne(query);
        res.send(user);
    }catch(err){
        console.log("user error : " + err);
    }finally{
        await client.close();
    }
});

/*app.get('/gendered-users', async (req, res)=> {
    const client= new MongoClient(uri);
    const gender= req.query.gender;

    //console.log("gender : " + gender)

    try{
        await client.connect();
        const database= client.db('app-data');
        const users= database.collection('users');
        const query= { gender_identity: { $eq : gender }};
        const foundUsers= await users.find(query).toArray();

        
        res.send(foundUsers);

    }catch(err){
        console.log("error : " + err);
    }finally{
        await client.close();
    }

});*/

/*app.get('/users', async (req, res)=> {
    const client= new MongoClient(uri);
    const userIds= JSON.parse(req.query.userIds);

    try{
        await client.connect();
        const database= client.db('app-data');
        const users= database.collection('users');

        const pipeline= [
            {
                '$match': {
                    'user_id': {
                        '$in': userIds
                    }
                }
            }
        ]
        
        const foundUsers= await users.aggregate(pipeline).toArray();
        console.log(foundUsers);
        res.send(foundUsers);
    }catch(err){
        console.log("error : " + err);
    }finally{
        await client.close();
    }
    
});*/

app.get('/messages', async (req, res) => {
    const client= new MongoClient(uri);
    const { userId, correspondingUserId }= req.query;

    //console.log(userId, correspondingUserId);

    try{
        await client.connect();
        const database= client.db('pioupiou-data');
        const messages= database.collection('messages');
        const query= {
            from_userId: userId,
            to_userId: correspondingUserId
        }

        const foundMessages= await messages.find(query).toArray();
        res.send(foundMessages);
    }catch(err){
        console.log("error : " + err);
    }finally{
        await client.close();
    }

    
})

app.get('/all-users', async (req, res)=> {
    const client= new MongoClient(uri);

    try{
        await client.connect();
        const database= client.db('pioupiou-data');
        const users= database.collection('users');
        const returnedUsers= await users.find().toArray();
        res.send(returnedUsers);
    }catch(err){
        console.log("error : " + err);
    }finally{
        await client.close();
    }
    
});

//POST

/*app.post('/signup', async (req, res)=> {
    const client= new MongoClient(uri);
    //console.log(req.body);
    const { email, password }= req.body;

    //génère un id unique
    const generateUserId= uuidv4();
    const hashedPassword= await bcrypt.hash(password, 10);

    try{
        await client.connect();
        const database= client.db('app-data');
        const users= database.collection('users');

        const existingUser= await users.findOne({ email });

        if(existingUser){
            return res.status(409).send('User already exists. Please login.');
        }

        const sanitizedEmail= email.toLowerCase();

        const data= {
            user_id: generateUserId,
            email: sanitizedEmail,
            hashed_password: hashedPassword
        }
        const insertedUser= await users.insertOne(data);

        const token= jwt.sign(insertedUser, sanitizedEmail, {
            expiresIn: 60 * 24,
        })

        res.status(201).json({ token, userId: generateUserId });

    }catch(err){
        console.log("error : " + err);
    }finally{
        await client.close();
    }

});

app.post('/login', async(req, res)=> {
    const client= new MongoClient(uri);
    const { email, password } = req.body;

    try{
        await client.connect();
        const database= client.db('app-data');
        const users= database.collection('users');

        const user= await users.findOne({ email });

        const correctPassword= await bcrypt.compare(password, user.hashed_password);

        if(user && correctPassword){
            const token= jwt.sign(user, email, {
                expiresIn: 60 * 24
            })
            res.status(201).json({ token, userId: user.user_id });
        }
        res.status(400).send('Invalid Credentials');
    }catch(err){
        console.log("error : " + err);
    }finally{
        await client.close();
    }
});*/


app.post('/message', async(req, res)=> {
    console.log(req.body);
    res.send("yo");
    const client= new MongoClient(uri);
    /*const questionResponse= [
        req.body.question,
        req.body.response
    ];*/

    //const options = { ordered: true };

    const question= req.body.questionMessage;
    const response= req.body.responseMessage;

    try{
        await client.connect();
        const database= client.db('pioupiou-data');
        const messages= database.collection('messages');
        const insertedQuestion= await messages.insertOne(question);
        const insertedResponse= await messages.insertOne(response);
        //const insertedMessage= await messages.insertMany(questionResponse, options);
        res.send(insertedQuestion, insertedResponse);
        //res.status(status).send(body);
        
    }catch(err){
        console.log("error : " + err);
    }finally{
        await client.close();
    }
});

//PUT

app.put('/user', async(req, res)=>{
    const client= new MongoClient(uri);
    const formData= req.body.formData;

    try{
        await client.connect();
        const database= client.db('app-data');
        const users= database.collection('users');

        const query= { user_id: formData.user_id};
        const updateDocument={
            $set: {
                first_name: formData.first_name,
                dob_day: formData.dob_day,
                dob_month: formData.dob_month,
                dob_year: formData.dob_year,
                show_gender: formData.show_gender,
                gender_identity: formData.gender_identity,
                gender_interest: formData.gender_interest,
                url: formData.url,
                about: formData.about,
                matches: formData.matches
            }
        }

        const insertedUser= await users.updateOne(query, updateDocument);
        res.send(insertedUser);
    }catch(err){
        console.log("error : " + err);
    }finally{
        await client.close();
    }

});

app.put('/add-match', async(req, res)=>{
    const client= new MongoClient(uri);
    const { userId, matchedUserId }= req.body;

    try{
        await client.connect();
        const database= client.db('app-data');
        const users= database.collection('users');

        const query= { user_id: userId };
        const updateDocument= {
            $push: {
                matches: { user_id: matchedUserId }
            }
        }
        const user= await users.updateOne(query, updateDocument);
        res.send(user);


        
    }catch(err){
        console.log("error : " + err);
    }finally{
        await client.close();
    }

});

//DELETE