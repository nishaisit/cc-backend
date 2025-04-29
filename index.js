const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http");
const {Server} = require("socket.io");
const mainRouter = require("./routes/main.router")

const yargs = require("yargs");
const {hideBin} = require("yargs/helpers");

const {initRepo} = require("./controllers/init");
const {addRepo} = require("./controllers/add");
const {commitRepo} = require("./controllers/commit");
const {pullRepo} = require("./controllers/pull");
const {pushRepo} = require("./controllers/push");
const {revertRepo} = require("./controllers/revert");

dotenv.config();

yargs(hideBin(process.argv))
  .command("start", "Server Started!!", {}, startServer)
  .command("init", "Initialised new repo", {}, initRepo)
  .command(
    "add <file>",
    "Add file to the repository",
    (yargs)=>{
       yargs.positional("file",{
           describe:"File to add at staging area",
            type: "string",
        });
    },
    (argv)=>{
        addRepo(argv.file);
    }
)
  .command(
    "commit <message>",
    "Commit the staged files",
    (yargs)=>{
        yargs.positional("message",{
            describe:"Commit message",
             type: "string",
         });
    },
    (argv)=>{
        commitRepo(argv.message);
    }
)
  .command("pull", "Pull commits from S3", {}, pullRepo)
  .command("push","Push commits to S3", {}, pushRepo)
  .command(
    "revert <commitId>",
    "Revert to a specific commit",
    (yargs)=>{
        yargs.positional("commitId",{
            describe:"Commit Id to revert to",
             type: "string",
         });
    },
    (argv)=>{
        revertRepo(argv.commitId);
    }
)
  .demandCommand(1, "You need to write atleast one command")
  .help().argv;


function startServer(){
    const app = express();
    const port = process.env.PORT || 3000;

    app.use(bodyParser.json());
    app.use(express.json());

    const mongoURI = process.env.MONGO_URI;

    mongoose
      .connect(mongoURI)
      .then(()=> console.log("MongoDB Connected!"))
      .catch((err)=> console.error("Unable to Connect : ", err));

    app.use(cors({origin: "*"}));
    app.use("/", mainRouter);
    // app.get("/",(req, res)=>{
    //     res.send("WELCOME!!!!!!!");
    // });
    
    let user = "test";
    const httpServer = http.createServer(app);
    const io =  new Server(httpServer,{
        cors:{
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.on("Connection",(socket)=>{
        socket.on("JOINROOM", (userId)=>{
            user = userId;
            console.log("======");
            console.log(user);
            console.log("======");
            socket.join(userId);
        });
    });

    const db = mongoose.connection;

    db.once("open", async()=>{
       console.log("CRUD operations called"); 
    });

    httpServer.listen(port,()=>{
       console.log(`Server is running on PORT ${port}`); 
    });
}