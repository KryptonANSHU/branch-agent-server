const { response } = require('express');
const mongoose = require('mongoose');



const messageSchema = new mongoose.Schema({
    room: {
        type: String,
    },
    content: {
        type: String,
    },
    // sender: String,

}, { timestamps: true})



const Message = mongoose.model('Message', messageSchema);

// Create a message

async function createMessage(room, content) {
    try {
      const newMessage = new Message({
        room: room,
        content: content,
      });
  
      await newMessage.save(); // Save the message to the database
      return newMessage;
    } catch (error) {
      throw error;
    }
  }

// Getting all messages
async function getMessages (req, res) {
  try {
    const messages = await Message.find({})
    if(messages.length > 0) {
     return res.status(200).json(messages)
    } else {
      return res.json({ message: 'Start a new chat'})
    }
  } catch (error) {
    res.status(500).json(error)
  }
}

// Get messages for a specific room base on room number -- customerId
async function getRoomMessages (req, res) {
  try {
    const { id } = req.params
    console.log('roomi', id)
    const messages = await Message.find({room: id});
    if(messages.length > 0) {
      return res.status(200).json(messages)
    } else {
      return res.json({ message: 'Start new chat'})
    }
  } catch (error) {
    res.status(500).json(error)
  }
}

module.exports = {
    Message,
      createMessage,
      getMessages,
      getRoomMessages
    };
