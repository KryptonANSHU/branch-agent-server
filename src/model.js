const fs = require('fs');
const path = require('path');
const {parse} = require('csv-parse')
const Customer = require('./database/db')


const messages = [];

function loadMessages () {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, 'data', 'MessageData.csv' ))
        .pipe(parse({
            comment:"#",
            columns: true
        }))
        .on('data', async (data) => {
            messages.push(data)
            await saveMessage(messages)
        })
        .on('error', (err) => {
            console.log(err)
            reject(err);
        })
        .on('end', () => {
            console.log(messages.length,'- messages')
        })
    })
}

console.log(messages.length)

// a function to save messages to the database
async function saveMessage(payload) {

    try{
  
     const message =  await Customer({
        messages: payload
     })

     await message.save()
    } catch(err){
      console.error(`Could not save message: ${err}`)
    }
  }

module.exports = loadMessages