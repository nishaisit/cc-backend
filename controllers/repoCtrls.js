const mongoose = require("mongoose");
const Repository = require("../models/repository");
const User = require("../models/user");
const Issue = require("../models/issue");

async function createRepo(req, res) {
    const {owner, name, issues, content, description, visibility} = req.body;

    try{
        if(!name){
            return res.status(400).json({error:"Repository name required"});
        }

        if(!mongoose.Types.ObjectId.isValid(owner)){
            return res.status(400).json({error:"Invalid User ID"});
        }

        const newRepository = new Repository({ 
            name, 
            description,
            visibility,
            owner,
            content,
            issues   
        });

        const result = await newRepository.save();

        res.status(201).json({
            message: "Repository created!",
            repositoryId: result._id
        });
    }catch(err){
        console.error("Error during Creating Repo!! : ", err.message);
        res.status(500).send("Server error!");
    }
}

async function getAllRepo(req, res) {
    try{
        const repositories = await Repository.find({})
        .populate("owner")
        .populate("issues");

        res.json(repositories);
    }catch(err){
        console.error("Error during fetching Repositories : ", err.message);
        res.status(500).send("Server error!");
    }
}

async function fetchRepoById(req, res) {
    const {id} = req.params;
    try{
        const repositories = await Repository.find({_id: id})
        .populate("owner")
        .populate("issues"); 

        res.json(repositories);
    }catch(err){
        console.error("Error during fetching Repository : ", err.message);
        res.status(500).send("Server error!");
    }
}

async function fetchRepoByName(req, res) {
    const {name} = req.params;   //extract the name if gives an error
    try{
        const repositories = await Repository.find({name})
        .populate("owner")
        .populate("issues");

        res.json(repositories);

    }catch(err){
        console.error("Error during fetching Repository : ", err.message);
        res.status(500).send("Server error!");
    }
}

async function fetchReposforCurrUser(req, res) {
    const {userId} = req.user;

    try{
        const repositories = await Repository.find({owner: userId});

        if(!repositories || repositories.length == 0){
            return res.status(404).json({error:"User Repo not found!"});
        }
        console.log(repositories);
        res.json({message:"Repositories found!!", repositories});
    }catch(err){
        console.error("Error during fetching the user Repo : ", err.message);
        res.status(500).send("Server error!");
    }
}

async function updateRepoById(req, res) {
    const {id} = req.params;
    const {content, description} = req.body;

    try{
        const repository = await Repository.findById(id);
        if(!repository){
            return res.status(404).json({error:"Repo not found!"});
        }

        repository.content.push(content);
        repository.description = description;

        const updatedRepository = await repository.save();

        res.json({
            message: "Repository Updated!!!",
            repository: updatedRepository,
        });
    }catch(err){
        console.error("Error during Updating Repo : ", err.message);
        res.status(500).send("Server error!");
    }
}

async function toggleVisibilityById(req, res) {
    const {id} = req.params;

    try{
        const repository = await Repository.findById(id);
        if(!repository){
            return res.status(404).json({error:"Repo not found!"});
        }

        repository.visibility =! repository.visibility;

        const updatedRepository = await repository.save();

        res.json({
            message: "Repository visibility toggled successfully!!!",
            repository: updatedRepository,
        });
    }catch(err){
        console.error("Error during toggling visibility : ", err.message);
        res.status(500).send("Server error!");
    }
}

async function deleteRepoById(req, res) {
    const {id} = req.params;

    try{
        const repository = await Repository.findByIdAndDelete(id);
        if(!repository){
            return res.status(404).json({message:"Repo not found!"});
        }

        res.json({message: "Repo Deleted Successfully"});
    }catch(err){
        console.error("Error during deletion : ", err.message);
        res.status(500).send("Server error!");
    }
}

module.exports = {
    createRepo,
    getAllRepo,
    fetchRepoById,
    fetchRepoByName,
    fetchReposforCurrUser,
    updateRepoById,
    toggleVisibilityById,
    deleteRepoById,
};