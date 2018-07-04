const tmi = require('tmi.js')
const chatRecorder = require('./chatRecorder.js')
const setting = require("./settings.json")

let startTime;

// Valid commands start with:
let commandPrefix = '!'
// Define configuration options:
let opts = {
  identity: {
    username: 'kisakanatest',
    password: 'oauth:' + '3w1uj02qrf6imeyoldjg6y8ti3bbmg'
  },
  channels: [
    'kisakana'
  ]
}

// These are the commands the bot knows (defined below):
let knownCommands = { growthReport }

//Function called when !growthReport command is called
function growthReport (channel, context){

  age = calculateAge()

  console.log(age)

  reportMessage = "I'm " + age + " years old!"

  sendMessage(channel, context, reportMessage)

}

//Calculates the bot's age
function calculateAge(){

    currentTime = (new Date).getTime()
    ageInSeconds =  currentTime - startTime
    convertedAge = ageInSeconds / setting.ageConversion
    return convertedAge.toFixed(2)
}


// Helper function to send the correct type of message:
function sendMessage (target, context, message) {
  if (context['message-type'] === 'whisper') {
    client.whisper(target, message)
  } else {
    client.say(target, message)
  }
}

// Create a client with our options:
let client = new tmi.client(opts)

// Register our event handlers (defined below):
client.on('message', onMessageHandler)
client.on('connected', onConnectedHandler)
client.on('disconnected', onDisconnectedHandler)
client.on("join", onJoinHandler)
client.on("unhost", onUnhostHandler)


// Connect to Twitch:
client.connect()


function onUnhostHandler(channel, viewers){

  console.log("End hosting")


}




function onJoinHandler(target, username){

  console.log(opts.identity.username)

}



// Called every time a message comes in:
function onMessageHandler (target, context, msg, self) {

  let chatMsg = `[${target} (${context['message-type']})] ${context.username}: ${msg}`
  chatRecorder.storeMsg(chatMsg)
  console.log(chatMsg)

  // Ignore messages from the bot or messages that are not commands
  if (self || msg.substr(0, 1) !== commandPrefix) {return} 

  // Split the message into individual words:
  const parse = msg.slice(1).split(' ')
  // The command name is the first (0th) one:
  const commandName = parse[0]
  // The rest (if any) are the parameters:
  const params = parse.splice(1)

  // If the command is known, let's execute it:
  if (commandName in knownCommands) {
    // Retrieve the function by its name:
    const command = knownCommands[commandName]
    // Then call the command with parameters:
    command(target, context, params)
    console.log(`* Executed ${commandName} command for ${context.username}`)
  } else {
    sendMessage(target, context, setting.noCommandFoundMsg)
    console.log(`* Unknown command ${commandName} from ${context.username}`)
  }
}

// Called every time the bot connects to Twitch chat:
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`)
  startTime = (new Date).getTime()
  console.log(startTime)
}

// Called every time the bot disconnects from Twitch:
function onDisconnectedHandler (reason) {
  console.log(`Womp womp, disconnected: ${reason}`)
  process.exit(1)
}