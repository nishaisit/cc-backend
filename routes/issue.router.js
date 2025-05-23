const express = require("express");
const issueController = require("../controllers/issueCtrls");

const issueRouter = express.Router();

issueRouter.post("/issue/create", issueController.createIssue);
issueRouter.put("/issue/update/:id", issueController.updateIssueById);
issueRouter.delete("/issue/delete/:id", issueController.deleteIssueById);
issueRouter.get("/issue/all", issueController.getAllIssue);
issueRouter.get("/issue/:id", issueController.getIssueById);

module.exports = issueRouter;