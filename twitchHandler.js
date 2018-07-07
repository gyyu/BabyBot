const tmi = require('tmi.js')
const babyBotService = require('./babyBotService.js')
const setting = require('./Settings/connectionSetting.json')
const opts = setting.opts

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
        
        exitMessage = babyBotService.getExitMessage()
        sendMessage(opts.channels[0], opts, exitMessage)
        babyBotService.saveAndExit()
  
      }
  
    });
  }


  function checkKeywords(keyword,msg){

    if(msg.includes(keyword)){
  
      sendMessage(opts.channels[0], opts, setting.responses[keyword])
  
    }
  
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
  
  let chatMsg = `[${target} (${context['message-type']})] ${context.username}: ${msg}` + JSON.stringify(context)
  babyBotService.saveChatMessage(chatMsg)
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
function onConnectedHandler (addr, port, ) {

  console.log(`* Connected to ${addr}:${port}`)

  
  babyBotService.initializeBabyBot()
  
  setInterval(checkStreamIsOffLine, setting.checkOfflineInterval)

}

// Called every time the bot disconnects from Twitch:
function onDisconnectedHandler (reason) {
  console.log(`Womp womp, disconnected: ${reason}`)
  babyBotService.saveAndExit()
}