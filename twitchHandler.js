const tmi = require('tmi.js')
const setting = require('./Settings/connectionSetting.json')
const opts = setting.opts

class TwitchHandler {
  
  constructor () {

  }

  initialize(botChannelRef){

    
    this.babyBotChannel = botChannelRef

    // Create a client with our options:
    let client = new tmi.client(opts)

    // Register our event handlers (defined below):
    client.on('message', this.onMessageHandler.bind(this))
    client.on('connected', this.onConnectedHandler.bind(this))
    client.on('disconnected', this.onDisconnectedHandler.bind(this))
    client.on('join', this.onJoinHandler.bind(this))

    // Connect to Twitch:
    client.connect()

    this.client = client
    
  }

  // // Helper to send the correct type of message:
  sendMessage (target, messageType, message) {
  
    if(target === ""){

      target = opts.channels[0]
    
    }
    
    if (messageType === 'whisper') {
      this.client.whisper(target, message)
    } else {
      
      this.client.say(target, message)
    }
  }

  checkStreamIsOffLine () {
    this.client.api({
      url: setting.channelUrl, headers: setting.headers

    }, function (err, res, body) {
      console.log(body.stream)

      if (body.stream) {
        return
      }else {
        clearInterval(this.checkStreamIntervalID)
        exitMessage = babyBotService.getExitMessage()
        //sendMessage(opts.channels[0], opts, exitMessage)
        babyBotService.saveAndExit()
      }
    })
  }

  onJoinHandler (target, username, self) {

    if (self) {
      this.babyBotChannel.onJoinSuccessful(target)
    }

    console.log(username + ' enters the chat')
  }

  // // Called every time a message comes in:
  onMessageHandler (target, context, msg, self) {
  
    this.babyBotChannel.toBot( target, context, msg, self)
    
  }

  // Called every time the bot connects to Twitch chat:
  onConnectedHandler (addr, port) {

    console.log(`* Connected to ${addr}:${port}`)

  }

  // Called every time the bot disconnects from Twitch:
  onDisconnectedHandler (reason) {

    console.log(`Womp womp, disconnected: ${reason}`)
    process.exit(1)
   
  }

}

module.exports = TwitchHandler

