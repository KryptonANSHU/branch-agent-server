const express = require('express');
const { createMessage, getMessages, getRoomMessages } = require('../database/db')

const chatRouter = express.Router();

// Route for customers to send messages
chatRouter.post('/customer/send-message', async (req, res) => {
    try {
      const { room, message } = req.body; // Assuming you send the room and message in the request body
      const newMessage = await createMessage(room, message, 'customer'); // Create a new message
      res.status(200).json(newMessage);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// Route for agents to respond to messages
chatRouter.post('/agent/respond-to-message', async (req, res) => {
    try {
      const { room, message } = req.body; // Assuming you send the room and message in the request body
      const newMessage = await createMessage(room, message, 'agent'); // Create a new message
      res.status(200).json(newMessage);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

chatRouter.get('/messages', getMessages)
chatRouter.get('/messages/:id', getRoomMessages)
  
module.exports = chatRouter