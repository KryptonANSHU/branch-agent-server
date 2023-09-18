const express = require('express');
const http = require('http');
const { Server }  = require('socket.io')
// const loadMessages = require('./model');
const mongoose = require('mongoose');
const { createMessage } = require('./database/db')
const chatRouter = require('./routes/routes')
const cors = require('cors')
const { getMessages } = require('./database/db')



const app = express();
const httpServer = http.createServer(app);

const MONGO_URL ="mongodb+srv://komakechivan555:ZeZL6onS4skz94SI@socket-cluster.lzh1d7d.mongodb.net/?retryWrites=true&w=majority"
  
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET","POST"],
        credentials: true
      }
});

async function connectDb () {
    await mongoose.connect(MONGO_URL).then(() => {
        console.log("DB connected")
    })
    // await loadMessages();
}



app.use(express.json());
app.use(cors())
app.use('/', chatRouter)




// Socket.io connection event
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

      socket.on("join_room", (room) => {
        console.log(`UserJoined: ${room}`)
        socket.join(room);
      });


        // When a customer sends a message
      socket.on("send_message", async (data) => {
        try {
          // Assuming data contains room and message
          const { room, content } = data;
          console.log(room, content);

          // Save the message to the database (you can use your createMessage function here)
          const message =  await createMessage(room, content );
          const savedMessage = await message.save();

          // console.log(savedMessage)

          // Broadcast the message to all users in the room, including the sender
          io.to(room).emit("receive_message", savedMessage)

          
        } catch (error) {
          console.error(error);
        }
      });


    // When an agent responds to a message
    // socket.on("send_message", async (data) => {
    //   try {
    //     // Assuming data contains room and message
    //     const { room, content } = data;
    //     console.log(room, content)

    //     // Save the message to the database (you can use your createMessage function here)
    //    const message =  await createMessage(room, content, 'agent');
    //    const savedMessage = await message.save();

    //     // Broadcast the message to all users in the room, including the sender
    //     io.to(room).emit("receive_message", savedMessage,);

    //   } catch (error) {
    //     console.error(error);
    //   }
    // });

});


httpServer.listen(8000, () => {
    console.log('listening on port 8000...')
})

connectDb()





// ZeZL6onS4skz94SI

// mongodb+srv://komakechivan555:ZeZL6onS4skz94SI@socket-cluster.lzh1d7d.mongodb.net/?retryWrites=true&w=majority