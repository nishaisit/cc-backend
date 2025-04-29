const express = require("express");
const repoController = require("../controllers/repoCtrls");

const repoRouter = express.Router();

repoRouter.post("/repo/create", repoController.createRepo);
repoRouter.get("/repo/all", repoController.getAllRepo);
repoRouter.get("/repo/:id", repoController.fetchRepoById);
repoRouter.get("/repo/name/:name", repoController.fetchRepoByName);
repoRouter.get("/repo/user/:userId", repoController.fetchReposforCurrUser);
repoRouter.put("/repo/update/:id", repoController.updateRepoById);
repoRouter.patch("/repo/toggle/:id", repoController.toggleVisibilityById);
repoRouter.delete("/repo/delete/:id", repoController.deleteRepoById);

module.exports = repoRouter;