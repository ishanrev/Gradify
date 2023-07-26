
// const helmet = require('helmet');
const mongoose = require('mongoose');
const morgan = require('morgan');
const dotenv = require('dotenv');
const express = require('express');
const { v4: uuid } = require('uuid')
const authRoute = require("./routes/authRoute")
const usersRoute = require("./routes/usersRoute")
const connectionRoute = require("./routes/connectionRoute")
const statsRoute = require("./routes/statsRoute")
const path = require('path');
const crypto = require('crypto');
const cors = require('cors')
const imageRouter = require("./routes/fileRoute")
// const nodemailer = require('nodemailer')
const sockets = []
const rooms = {}
const socketIds = {}
const games = {}
const friendRequests = {}

//File management system
const methodOverride = require('method-override');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');



const PORT = process.env.PORT;
dotenv.config();

const app = express();
const http = require("http").createServer(app);
const io = require('socket.io')(http,
    {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(helmet());
app.use(methodOverride('_method'));
app.use(morgan("common"));
app.use(cors())
// app.get('/', async (req, res) => {
//     res.send("hi")
// })
app.get('/bob/bob', async (req, res) => {
    res.send("hi bob")
})
mongoose.connect(process.env.MONGOOSE_URL, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (!err) {

        console.log("connected to MongoDB");
    }
    else
        console.log(err);
});

// create storage engine
const storage = new GridFsStorage({ 
    url: process.env.MONGOOSE_URL,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({ storage });
//IO connection

io.on("connection", (socket) => {
    sockets.push(socket.id)
    socket.on("save userId", ({ userId }) => {
        socketIds[userId] = socket.id
        console.log(socketIds)
    })
    socket.on("message sent", ({ toId }) => {
        if (socketIds[toId] !== null && socketIds[toId] !== undefined) {
            io.sockets.to(socketIds[toId]).emit("update connection", {})
        }
    })
    console.log('socket connection has officially been established')

})
app.use('/api/fileUpload', imageRouter(upload));
app.use('/api/auth', authRoute)
app.use('/api/user', usersRoute)
app.use('/api/connection', connectionRoute)
app.use('/api/stats', statsRoute)

const __dirname1 = path.resolve();
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname1, "/client/build")));
    // Step 2:
    app.get("*", function (request, response) {
        response.sendFile(path.resolve(__dirname1, "client", "build", "index.html"));
    });
} else {
    app.get("/", (req, res) => {
        res.send("hello da");
        // console.log('hi baby doll')
    });
}


http.listen(PORT || 3001, () => {
    for (var x = 0; x < 3; x++) {
        console.log("----------------------------------------");
    }
    console.log("successfully started on Port " + PORT);
});

