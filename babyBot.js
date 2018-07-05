const tmi = require('tmi.js')
const chatRecorder = require('./chatRecorder.js')
const setting = require("./settings.json")
const opts = setting.opts

let startTime;

let knownCommands = { "growthReport" : growthReport }

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

function checkIfOffLine() {
  client.api({
    
    url : setting.channelUrl, headers : setting.headers

  }, function(err, res, body){

    console.log(body.stream)

    if(body.stream){ 
      
      return 
    
    }else{

      saveAndExit()

    }

  });
}

function saveAndExit(){

  sendMessage(opts.channels[0], opts, setting.exitMsg)
      
  setTimeout(function() {

    chatRecorder.saveMsg()
    process.exit(1)

  }, setting.exitTimeout)

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

function onUnhostHandler(target, context){

    checkIfOffLine()

}

function onJoinHandler(target, username,self){

  if (self){

    sendMessage(opts.channels[0], opts, setting.greetingMsg)

  }

  console.log(username + " enters the chat")

}

// Called every time a message comes in:
function onMessageHandler (target, context, msg, self) {
  
  let chatMsg = `[${target} (${context['message-type']})] ${context.username}: ${msg}`
  chatRecorder.storeMsg(chatMsg)
  console.log(chatMsg)

  // Ignore messages from the bot or messages that are not commands
  if (self || msg.substr(0, 1) !== setting.commandPrefix) {return} 

  // Split the message into individual words:
  const parse = msg.slice(1).split(' ')
  // The command name is the first (0th) one:
  const commandName = parse[0]
  // The rest (if any) are the parameters:
  const params = parse.splice(1)
  
  // If the command is known, let's execute it:
  if (knownCommands[commandName]) {
    
    //get function 
    const command = knownCommands[commandName]
    command(target, context, params)

    console.log(`* Executed ${commandName} command for ${context.username}`)
  
  } else {
    
    sendMessage(target, context, setting.noCommandFoundMsg)
    console.log(`* Unknown command ${commandName} from ${context.username}`)
  
  }
}

// Called every time the bot connects to Twitch chat:
function onConnectedHandler (addr, port, self) {

  console.log(`* Connected to ${addr}:${port}`)

  
  startTime = (new Date).getTime()
  console.log(startTime)

  setInterval(checkIfOffLine, setting.checkOfflineInterval)

}

// Called every time the bot disconnects from Twitch:
function onDisconnectedHandler (reason) {
  console.log(`Womp womp, disconnected: ${reason}`)
  saveAndExit()
}