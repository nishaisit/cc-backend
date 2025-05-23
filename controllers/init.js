const fs = require("fs").promises;  //promises help to create files
const path = require("path");


async function initRepo(){
    const repoPath = path.resolve(process.cwd(),".codeCollab");
    const commitsPath = path.join(repoPath, "commits");

    try{
        await fs.mkdir(repoPath,{recursive:true});
        await fs.mkdir(commitsPath,{recursive:true});
        await fs.writeFile(
            path.join(repoPath,"config.json"),
            JSON.stringify({bucket:process.env.S3_BUCKET})
        );
        console.log("Repository Initialised Succesfully!!.");
    }catch(err){
        console.error("Error in Initialising Repo", err);
    }
}

module.exports = {initRepo};