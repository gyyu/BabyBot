const tmi = require('tmi.js')
const chatRecorder = require('./chatRecorder.js')
const botStateRecorder = require('./botStateRecorder')
const setting = require('./Settings/settings.json')
const opts = setting.opts
const botState = require('./Settings/botState.json')

let startTime
let beginingAge = botState.age
let currentAge

let knownCommands = { "growthReport" : growthReport }

//Function called when !growthReport command is called
function growthReport (channel, context){

  
  let ageYMD = getAgeInYMD()
  
  reportMessage = "I'm " + ageYMD[0] + "-year " + ageYMD[1] + "-month and " + ageYMD[2] + "-day old!"

  sendMessage(channel, context, reportMessage)

}

function getAgeInYMD(){

  let currentAgeInYear = Math.floor(currentAge / 720)
  let remainMonth = currentAge - currentAgeInYear * 720

  let currentAgeInMonth = Math.floor(remainMonth / 30)
  let remainDay = remainMonth - currentAgeInMonth * 30

  let currentAgeInDay = Math.floor((remainDay % 30))

  console.log(currentAgeInYear + " " + currentAgeInMonth + " " + currentAgeInDay)

  return [currentAgeInYear, currentAgeInMonth, currentAgeInDay]

}


function updateAge(){

  currentAge = beginingAge + calculateAge()
  console.log(currentAge)
}

//Calculates the bot's age
function calculateAge(){

    currentTime = (new Date).getTime()
    ageInSeconds =  (currentTime - startTime) / 1000
    ageInDay = Math.round(ageInSeconds / 2)
    console.log("Age in Day " + ageInDay)

    
    return ageInDay
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

    botStateRecorder.backupState()
    updateAge()
    botState.age = currentAge
    botStateRecorder.saveState(botState)
    chatRecorder.saveMsg()
    process.exit(1)

  }, setting.exitTimeout)

}

function checkKeywords(keyword,msg){

  if(msg.includes(keyword)){

    sendMessage(opts.channels[0], opts, setting.responses[keyword])

  }

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

// Connect to Twitch:
client.connect()

function onJoinHandler(target, username,self){

  if (self){

    sendMessage(opts.channels[0], opts, setting.greetingMsg)

  }

  console.log(username + " enters the chat")

}

// Called every time a message comes in:
function onMessageHandler (target, context, msg, self) {
  
  let chatMsg = `[${target} (${context['message-type']})] ${context.username}: ${msg}` + JSON.stringify(context)
  chatRecorder.storeMsg(chatMsg)
  console.log(chatMsg)
  //console.log(context)

  // Ignore messages from the bot or messages that are not commands
  if (self) {return} 
  
  if (msg.substr(0, 1) !== setting.commandPrefix) {
   
    
    setting.keywords.forEach(function(keyword){

      checkKeywords(keyword,msg)
    })

  }else{

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
}

// Called every time the bot connects to Twitch chat:
function onConnectedHandler (addr, port, self) {

  console.log(`* Connected to ${addr}:${port}`)

  
  startTime = (new Date).getTime()
  

  setInterval(checkIfOffLine, setting.checkOfflineInterval)
  setInterval(updateAge, setting.checkAgeInterval)

}

// Called every time the bot disconnects from Twitch:
function onDisconnectedHandler (reason) {
  console.log(`Womp womp, disconnected: ${reason}`)
  saveAndExit()
}