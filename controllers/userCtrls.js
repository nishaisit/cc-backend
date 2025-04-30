const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {MongoClient} = require("mongodb");
const dotenv = require("dotenv");
var ObjectId = require("mongodb").ObjectId;

dotenv.config();
const uri = process.env.MONGO_URI;

let client;

async function connectClient() {
    if(!client){
        client = new MongoClient(uri, {
            useNewUrlParser: true, 
            useUnifiedTopology: true
        });
        await client.connect();
    }
}

async function signUp(req, res) {
    const {username, email, password} = req.body;
    try{
        await connectClient();
        const db = client.db("codecollab-base");
        const userCollection = db.collection("users");

        const user = await userCollection.findOne({username});
        if(user){
            return res.status(400).json({message:"User already exists!"}); 
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            username,
            email,
            password: hashedPassword,
            repositories: [],
            followedUsers: [],
            starRepos: []
        }

        const result = await userCollection.insertOne(newUser);

        const token = jwt.sign({id: result.insertId}, process.env.JWT_SECRET_KEY, {expiresIn: "1h"});
        res.json({token, userId: result.insertId});
    }catch(err){
        console.error("Error during signup : ", err.message);
        res.status(500).send("Server error");
    }

};

async function login(req, res) {
    const {email, password} = req.body;
    try{
        await connectClient();
        const db = client.db("codecollab-base");
        const userCollection = db.collection("users");
        
        const user = await userCollection.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid Credentials"}); 
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid Credentials"});
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: "1h"});
        res.json({token, userId: user._id});
    }catch(err){
        console.error("Error during login : ", err.message);
        res.status(500).send("Server error!");
    }
};

async function getAllUsers(req, res) {
    try{
        await connectClient();
        const db = client.db("codecollab-base");
        const usersCollection = db.collection("users");

        const users = await usersCollection.find({}).toArray();
        res.json(users);
    }catch(err){
        console.error("Error while fetching : ", err.message);
        res.status(500).send("Server error!");
    }
};

async function getUserProfile(req, res) {
    const currentId = req.params.id;

    try{
        await connectClient();
        const db = client.db("codecollab-base");
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({
            _id: new ObjectId(currentId)
        });

        if(!user){
            return res.status(404).json({message:"User Not Found!"}); 
        }

        res.send(user);
    }catch(err){
        console.error("Error : ", err.message);
        res.status(500).send("Server error!");
    }
};

async function updateUserProfile(req, res) {
    const currentId = req.params.id;
    const {email, password} = req.body;

    try{
        await connectClient();
        const db = client.db("codecollab-base");
        const usersCollection = db.collection("users");

        let updateFields = {email};
        if(password){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            updateFields.password = hashedPassword;
        }

        const result = await usersCollection.findOneAndUpdate(
            {
                _id: new ObjectId(currentId)
            },
            {$set: updateFields},
            {returnDocument: "after"}
        );

        if(!result.value){
            return res.status(404).json({message:"Something went wrong, try again!"}); 
        }

        res.send(result.value);
    }catch(err){
        console.error("Error during updating : ", err.message);
        res.status(500).send("Server error!");
    }
};

async function deleteUserProfile(req, res) {
    const currentId = req.params.id;
    try{
        await connectClient();
        const db = client.db("codecollab-base");
        const userCollection = db.collection("users");

        const result = await userCollection.deleteOne({
            _id: new ObjectId(currentId)
        });

        if(result.deleteCount == 0){
            return res.status(404).json({message:"Something went wrong, try again!"});  
        }
    }catch(err){
        console.error("Error during deleting : ", err.message);
        res.status(500).send("Server error!");
    }
};

module.exports = {
    getAllUsers,
    signUp,
    login,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile
};