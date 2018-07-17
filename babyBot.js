const setting = require('./Settings/botState.json')
const chatRecorder = require('./chatRecorder.js')
const NormalState = require('./babyBotNormalState.js')
const CryingState = require('./babyBotCryingState.js')
const NappingState = require('./babyBotNappingState.js')
const DiaperChangingState = require('./babyBotDiaperChangingState.js')

class BabyBot {

  constructor (botRef) {
    this.currentState = new NormalState(this)
    this.startTime = (new Date).getTime()
    this.beginingAge = setting.age
    this.secToYear = setting.secToYear
    this.secToMonth = setting.secToMonth
    this.secToDay = setting.secToDay
    this.held = false
    this.babyBotChannel = botRef

  }

  changeState () {

    let len = setting.stateNames.length
    let ran = Math.floor(Math.random() * len)
    let stateName = setting.stateNames[ran]
    console.log(stateName)

    switch (stateName) {
      case 'Crying':

        this.currentState = new CryingState(this)
        break

      case 'Napping':

        this.currentState = new NappingState(this)
        break

      case 'Diaper-Changing':

        this.currentState = new DiaperChangingState(this)
        break

      case 'Normal':

        this.currentState = new NormalState(this)
        break

    }
  }

  changeToNormalState(){

    
    if(!(this.currentState instanceof NormalState)){
      console.log("Normal State")
      this.currentState = new NormalState(this)

    }
    

  }

  getCurrentAgeInDay () {
    let currentTime = (new Date).getTime()
    let ageInSeconds = (currentTime - this.startTime) / 1000

    let ageInDay = Math.round(ageInSeconds / this.secToDay)
    let currentAge = this.beginingAge + ageInDay

    return currentAge
  }

  getAgeInYMD () {
    let currentAge = this.getCurrentAgeInDay()

    let currentAgeInYear = Math.floor(currentAge / secToYear)
    let remainMonth = currentAge - currentAgeInYear * secToYear

    let currentAgeInMonth = Math.floor(remainMonth / secToMonth)
    let remainDay = remainMonth - currentAgeInMonth * secToMonth

    let currentAgeInDay = Math.floor((remainDay % secToMonth))

    console.log(currentAgeInYear + ' ' + currentAgeInMonth + ' ' + currentAgeInDay)

    return [currentAgeInYear, currentAgeInMonth, currentAgeInDay]
  }

  getCommandResponse (cmd) {

    return this.currentState.onCommand(cmd)

}

  onJoin(channelName){

    
    this.babyBotChannel.toHandler(channelName, '', setting.greetingMessage)

  }


  onMessage ( channelName, context, msg, self) {

      let chatMsg = `[${channelName} (${context['message-type']})] ${context.username}: ${msg}` // + JSON.stringify(context)
      // saveChatMessage(chatMsg)
      console.log(chatMsg)

      let msgType = context["message-type"]
      this.commandUser = context.username
      // Ignore messages from the bot
      if (self) {return}

      if(msgType === "chat"){

        let prefix = msg.substr(0, 1)
        let parseMessage
        let commandResponse

        if (prefix === setting.commandPrefix) {

            parseMessage = msg.slice(1).split(' ')
            const commandName = parseMessage[0]
            commandResponse = this.getCommandResponse(commandName)

            this.babyBotChannel.toHandler(commandResponse[0], commandResponse[1], commandResponse[2])

            

        }else if (prefix === setting.tagPrefix) {

            parseMessage = msg.slice(1).split(' ')
            const taggedUser = parseMessage[0]

            if (taggedUser === setting.username) {

                this.learnFromMessage(parseMessage, true)

            }else {

                this.learnFromMessage(parseMessage, false)

            }

            responseMessage = this.getResponseToKeywords(parseMessage)
            this.babyBotChannel.toHandler(channelName,responseMessage[0], responseMessage[1])

        }else {

            console.log(msg)

        }
        
    }else{
      //from whisper
    }
          
  }


  saveChatMessage (msg) {
    chatRecorder.storeMsg(msg)
  }

  learnFromMessage (msg, weighted) {
    if (weighted) {
      console.log('Weight each word')
    }else {
      console.log('no weight')
    }
  }

  getResponseToKeywords (msg) {
    console.log(msg)
    let response = "I don't understand"
    let keywords = setting.keywords
    let firstWord
    let secondWord

    for (var i = 0; i < msg.length; i++) {
      firstWord = msg[i]

    //   // This code loops through goodbye list and if it encounters a word from that list in the user's message, someone is saying 
    //   // goodbye so the bot should say something too. We would have to do this for every list so I'm trying to find a simpler way of doing it. 
    //   for ( var e = 0; e < goodbyeList.length; e++) {
    //     if (msg[i] === goodbyeList[e]) {
    //       console.log("no don't leave me")
    //     }
    //   }

    //   for ( var e = 0; e < cursewordList.length; e++) {
    //     if (msg[i] === cursewordList[e]) {
    //       console.log(msg[i] + '?')
    //     }
    //   }

      if (keywords[firstWord] && i + 1 <= msg.length) {
        secondWord = msg[i + 1]

        if (keywords[firstWord][secondWord]) {
          let arrLen = keywords[firstWord][secondWord].length
          let randomNumber = Math.floor((Math.random() * arrLen))
          response = keywords[firstWord][secondWord][randomNumber]
        }else {
          response = firstWord + ' what?'
        }
      }else {
        response = firstWord + ' what?'
      }
    }

    return response
  }


  getAgeGroup(){

    let ageInDay = this.getCurrentAgeInDay()

    if (0 <= ageInDay < 720) {

        return "0"
               
    }else if (720 <= ageInDay < 1440) {
  
        return "1"

    }else if (1440 < ageInDay) {


        return "2"

    }

  }

}

module.exports = BabyBot
