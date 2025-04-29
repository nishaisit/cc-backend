const mongoose = require("mongoose");
const Repository = require("../models/repository");
const User = require("../models/user");
const Issue = require("../models/issue");

async function createIssue(req, res) {
    const {title, description} = req.body;
    const {id} = req.params;

    try{
        const issue = new Issue({
            title, 
            description,
            repository: id,
        });

        await issue.save();

        res.status(201).json(issue);
    }catch(err){
        console.error("Error during Creation : ", err.message);
        res.status(500).send("Server error!");
    }
}

async function updateIssueById(req, res) {
    const {title, description, status} = req.body;
    const {id} = req.params;
    try{
        const issue = await Issue.findById(id);

        if(!issue){
            return res.status(404).json({error:"Issue not found!"});
        }

        issue.title = title;
        issue.description = description;
        issue.status = status;

        await issue.save();

        res.json(issue, {message:"Issue updated"});
    }catch(err){
        console.error("Error during Updation : ", err.message);
        res.status(500).send("Server error!");
    }
}

async function deleteIssueById(req, res) {
    const {id} = req.params;

    try{
        const issue = Issue.findByIdAndDelete(id);

        if(!issue){
            return res.status(404).json({error:"Issue not found!"});  
        }
        res.json({message: "Issue deleted"});
    }catch(err){
        console.error("Error during Deletion : ", err.message);
        res.status(500).send("Server error!");
    }
}

async function getAllIssue(req, res) {
    const {id} = req.params;

    try{
        const issues = Issue.find({repository: id});
        if(!issues){
            return res.status(404).json({error:"Issue not found!"});  
        }

        res.status(200).json(issues);
    }catch(err){
        console.error("Error during issue fetching : ", err.message);
        res.status(500).send("Server error!");
    }
}

async function getIssueById(req, res) {
    const {id} = req.params;
    try{
        const issue = await Issue.findById(id);

        if(!issue){
            return res.status(404).json({error:"Issue not found!"});
        }

        res.json(issue);
    }catch(err){
        console.error("Error during Updation : ", err.message);
        res.status(500).send("Server error!");
    }
}

module.exports ={
    createIssue,
    updateIssueById,
    deleteIssueById,
    getAllIssue,
    getIssueById,
};