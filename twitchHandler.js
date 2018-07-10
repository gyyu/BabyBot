const tmi = require('tmi.js')
const babyBotService = require('./babyBotService.js')
const setting = require('./Settings/connectionSetting.json')
const opts = setting.opts

let checkStreamIntervalID
let getRandomEventIntervalID
let parseMessage

// Helper function to send the correct type of message:
function sendMessage (target, context, message) {

    if (context['message-type'] === 'whisper') {
      client.whisper(target, message)
    } else {
      client.say(target, message)
    }
}

function checkStreamIsOffLine() {
        
    client.api({
      
      url : setting.channelUrl, headers : setting.headers
  
    }, function(err, res, body){
  
      console.log(body.stream)
  
      if(body.stream){ 
        
        return 
      
      }else{

          clearInterval(checkStreamIntervalID)
          exitMessage = babyBotService.getExitMessage()
          sendMessage(opts.channels[0], opts, exitMessage)
          babyBotService.saveAndExit()
    
      }
  
    });
  }


function callRandomEvent(){

    eventMessage = babyBotService.getRandomEvent()
    sendMessage(opts.channels[0], opts, eventMessage)
    //clearInterval(getRandomEventIntervalID)
}


// Create a client with our options:
let client = new tmi.client(opts)

// Register our event handlers (defined below):
client.on('message', onMessageHandler)
client.on('connected', onConnectedHandler)
client.on('disconnected', onDisconnectedHandler)
client.on("join", onJoinHandler)

// Connect to Twitch:
client.connect()

function onJoinHandler(target, username,self){

  if (self){

    greetingMessage = babyBotService.getGreetingMessage()
    sendMessage(opts.channels[0], opts, greetingMessage)

  }

  console.log(username + " enters the chat")

}

// Called every time a message comes in:
function onMessageHandler (target, context, msg, self) {
  
  let prefix = msg.substr(0,1)
  
  let chatMsg = `[${target} (${context['message-type']})] ${context.username}: ${msg}` //+ JSON.stringify(context)
  babyBotService.saveChatMessage(chatMsg)
  console.log(chatMsg)

  // Ignore messages from the bot or messages that are not commands
  if (self) {return} 

  switch(prefix){

    case setting.commandPrefix:

      parseMessage = msg.slice(1).split(' ')
      
      const commandName = parseMessage[0]
      
      commandMessage = babyBotService.executeCommand(commandName, parseMessage)
      sendMessage(opts.channels[0], opts, commandMessage)

      break

    case setting.tagPrefix:
      

      parseMessage = msg.slice(1).split(' ')
      const taggedUser = parseMessage[0]

      if(taggedUser === opts.identity.username){

        babyBotService.learnFromMessage(parseMessage, true)
        

      }else{


        babyBotService.learnFromMessage(parseMessage, false)
        

      }

      responseMessage = babyBotService.getResponse(parseMessage)
      sendMessage(opts.channels[0], opts, responseMessage)
      break

    default:
      console.log("Default")
      parseMessage = msg.split(' ')
      responseMessage = babyBotService.getResponse(parseMessage)
      sendMessage(opts.channels[0], opts, responseMessage)


  }

  

}

// Called every time the bot connects to Twitch chat:
function onConnectedHandler (addr, port ) {

  console.log(`* Connected to ${addr}:${port}`)

  
  checkStreamIntervalID = setInterval(checkStreamIsOffLine, setting.checkOfflineInterval)
  getRandomEventIntervalID = setInterval(callRandomEvent, setting.getRandomEventInterval)

}

// Called every time the bot disconnects from Twitch:
function onDisconnectedHandler (reason) {
  console.log(`Womp womp, disconnected: ${reason}`)
  babyBotService.saveAndExit()
}