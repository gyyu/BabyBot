const tmi = require('tmi.js')
const setting = require('./Settings/connectionSetting.json')
const opts = setting.opts

class TwitchHandler {

  constructor () {}

  initialize (botChannelRef) {
    this.babyBotChannel = botChannelRef

    // Create a client with our options:
    let client = new tmi.client(opts)
    this.msgQueue = []
    // Register our event handlers (defined below):
    client.on('message', this.onMessageHandler.bind(this))
    client.on('connected', this.onConnectedHandler.bind(this))
    client.on('disconnected', this.onDisconnectedHandler.bind(this))
    client.on('join', this.onJoinHandler.bind(this))

    // Connect to Twitch:
    client.connect()

    this.client = client
    this.checkStreamIntervalID = setInterval(this.checkStreamIsOffLine.bind(this), setting.checkOfflineInterval)
    
  }

  // // Helper to send the correct type of message:
  queueMessage (message, target , messageType = 'chat') {

    if(target === 'channel') {
      target = opts.channels[0]
    }
    
    let msgObj = {
      type: messageType,
      destination: target,
      content: message
    }
    this.msgQueue.push(msgObj)

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
        this.babyBotChannel.onStreamOffline()
      }
    }.bind(this))
  }

  onJoinHandler (target, username, self) {
    if (self) {
      this.babyBotChannel.onJoinSuccessful(username)

      setInterval(function () {
        console.log(this.msgQueue)
        if(this.msgQueue.length != 0){

          let msgObj = this.msgQueue.shift()

          
          if (msgObj.type === 'whisper') {
            this.client.whisper(msgObj.destination, msgObj.content)
          } else {
            this.client.say(msgObj.destination, msgObj.content)
          }
        }
       
      }.bind(this), setting.messageInterval)
    }

    console.log(username + ' enters the chat')
  }

  // // Called every time a message comes in:
  onMessageHandler (target, context, msg, self) {
    this.babyBotChannel.toBot(target, context, msg, self)
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
