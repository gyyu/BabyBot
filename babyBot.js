const setting = require('./Settings/botSetting.json')
const wordList = require('./Settings/botWords.json')
const ChatRecorder = require('./chatRecorder.js')
const botRecorder = require('./botStateRecorder.js')
const NormalState = require('./babyBotNormalState.js')
const CryingState = require('./babyBotCryingState.js')
const NappingState = require('./babyBotNappingState.js')
const HungryState = require('./babyBotHungryState.js')
const DiaperChangingState = require('./babyBotDiaperChangingState.js')
const lists = require('./Settings/botLists.json')
// const users = require('./Settings/userLists.json')
// const fs = require('fs')

// let list = users;
// let userExist = false;

// // Status point variables
// let defaultPoints = 0;
// let followerPoints = 1;
// let modPoints = 2;
// let subPoints = 3;

let goodbyeList = lists.botLists["possible"]["goodbye"]; 
let cursewordList = lists.botLists["possible"]["cursewords"];

class BabyBot {

  constructor (botRef) {
    this.startTime = (new Date).getTime()
    this.beginingAge = setting.age
    this.secToYear = setting.secToYear
    this.secToMonth = setting.secToMonth
    this.secToDay = setting.secToDay
    this.babyBotChannel = botRef
    botRecorder.backupJson(setting, "setting")
    botRecorder.backupJson(wordList, "wordList")
    this.chatRecorder = new ChatRecorder()
    this.getAgeGroup()
    this.checkAgeGroupIntervalID = setInterval(this.getAgeGroup.bind(this), 5000)
    this.currentState = new NormalState(this)
  }

  say(msg, target = "channel", type = 'chat'){

    this.babyBotChannel.toHandler(msg, target, type)

  }

  changeState () {
    this.currentState.clearIntervals()
    let len = setting.stateNames.length
    let ran = Math.floor(Math.random() * len)
    let stateName = setting.stateNames[ran]
        
    console.log(stateName)

    switch (stateName) {

      case  'Hungry':

        this.currentState = new HungryState(this)
        break

      case 'Crying':

        this.currentState = new CryingState(this)
        break

      case 'Diaper-Changing':

        this.currentState = new DiaperChangingState(this)
        break

      case 'Normal':

        this.currentState = new NormalState(this)
        break

      // default:
      // this.currentState = new CryingState(this)

    }
  }

  changeToNappingState(){
    this.currentState.clearIntervals()
    if(!(this.currentState instanceof NappingState)){

      this.currentState = new NappingState(this)

    }

  }

  changeToNormalState(){
    this.currentState.clearIntervals()
    if(!(this.currentState instanceof NormalState)){

      this.currentState = new NormalState(this)

    } 

  }

  getAgeInDay () {
    let currentTime = (new Date).getTime()
    let ageInSeconds = (currentTime - this.startTime) / 1000

    let ageInDay = Math.round(ageInSeconds / this.secToDay)
    let currentAge = this.beginingAge + ageInDay

    return currentAge
  }

  getAgeInYMD () {
    let currentAge = this.getAgeInDay()

    let currentAgeInYear = Math.floor(currentAge / this.secToYear)
    let remainMonth = currentAge - currentAgeInYear * this.secToYear

    let currentAgeInMonth = Math.floor(remainMonth / this.secToMonth)
    let remainDay = remainMonth - currentAgeInMonth * this.secToMonth

    let currentAgeInDay = Math.floor((remainDay % this.secToMonth))

    return [currentAgeInYear, currentAgeInMonth, currentAgeInDay]
  }

  getAgeGroup(){
    
    let ageInDay = this.getAgeInDay()
    
    if( ageInDay >= this.secToYear * 3){

      clearInterval(this.checkAgeGroupIntervalID)
      this.say(setting.fullyGrownMessage)
      this.currentState.clearIntervals()
      setTimeout(function(){
        this.saveAndExit()
      }.bind(this), setting.exitDelay)

    }else if(ageInDay >= this.secToYear *2){

      this.ageGroup = "2"
    
    }else if(ageInDay >= this.secToYear){
     
      this.ageGroup = "1"

    }else if(ageInDay >= 0){

      this.ageGroup = "0"
    
    }

  }

  onOffline(){

    this.say(setting.exitMessage[this.ageGroup])
    this.currentState.clearIntervals()
    this.currentState.saveStatus()
    setTimeout(function(){
      this.saveAndExit()
    }.bind(this), setting.exitDelay)

  }

  onJoin(username){
    this.username = username
    this.say(setting.greetingMessage[this.ageGroup])

  }

  onMessage (channelName, context, msg, self) {

      let chatMsg = `[${channelName} (${context['message-type']})] ${context.username}: ${msg}` // + JSON.stringify(context)
      this.saveChatMessage(chatMsg)
      console.log(chatMsg)

      msg = msg.toLowerCase()
      let msgType = context["message-type"]
 
      if (self) {return}

      if(msgType === "chat"){

        let prefix = msg.substr(0, 1)
        let parseMessage
     
        if (prefix === setting.commandPrefix) {

            parseMessage = msg.slice(1).split(' ')
            const commandName = parseMessage[0]
            this.currentState.onCommand(commandName, parseMessage[1], context.username)

        }else if (prefix === setting.tagPrefix) {

            parseMessage = msg.slice(1).split(' ')

            const taggedUser = parseMessage[0]

            let newMsg = this.stripMsg(parseMessage.slice(1))

            if (taggedUser === this.username) {

                this.learnFromMessage(newMsg, wordList.heavyWeight)

            }else {

                this.learnFromMessage(newMsg, wordList.lightWeight)

            }

            this.currentState.onTagged(newMsg)

        }else{
         
          this.currentState.onMessage(msg.split(' '))
          let newMsg = this.stripMsg(msg.split(' '))
          this.learnFromMessage(newMsg, wordList.lightWeight)
          
        }
        
    }else if (msgType === "whisper"){

      if(context.username === this.currentState.holder){
        
        let prefix = msg.substr(0, 1)
        let parseMessage

        if (prefix === setting.commandPrefix) {

          parseMessage = msg.slice(1).split(' ')
          const commandName = parseMessage[0]
          this.currentState.onWhisperCommand(commandName, parseMessage[1], context.username)

        }else{

          let newMsg = this.stripMsg(msg.split(' '))
          this.learnFromMessage(newMsg, wordList.heavyWeight)

        }
      }
          
    }

  }

  stripMsg(msg){

    let resultMsg = msg.filter(word => !wordList.meaninglessWords[word.toLowerCase()])
    return resultMsg

  }

  saveChatMessage (msg) {
    
    this.chatRecorder.storeMsg(msg)
    
  }

  learnFromMessage (msg, weight) {
    msg.forEach(function(word){
      if(wordList.learnedWords[word.toLowerCase()]){
        wordList.learnedWords[word.toLowerCase()] += weight
      }else{
        wordList.learnedWords[word.toLowerCase()] = weight
      }
    })

  }

  saveAndExit(){
   
    setting.age = this.getAgeInDay()
    botRecorder.saveJson(setting, "botSetting")
    botRecorder.saveJson(wordList, "botWords")
    this.chatRecorder.saveMsg()
    setTimeout(function(){
      process.exit(1)
    }, 5000)
  }

  getResponseToKeywords (msg) {
    
    let response = "I don't understand"
    let keywords = setting.keywords
    let firstWord
    let secondWord

    // //   // This code loops through goodbye list and if it encounters a word from that list in the user's message, someone is saying 
    // //   // goodbye so the bot should say something too. We would have to do this for every list so I'm trying to find a simpler way of doing it. 
    // for ( var e = 0; e < goodbyeList.length; e++) {
    //   if (msg[i] === goodbyeList[e]) {
    //     console.log("no don't leave me")
    //   }
    // }

      // This code loops through goodbye list and if it encounters a word from that list in the user's message, someone is saying 
      // goodbye so the bot should say something too. We would have to do this for every list so I'm trying to find a simpler way of doing it. 
    //   for ( var e = 0; e < goodbyeList.length; e++) {
    //     if (msg[i] === goodbyeList[e]) {
    //       // do some if statements that check at status and based on status a different message will be sent
    //       if (getUserStatus(useranme) = "high") console.log("no don't leave me");
    //   }
    // }
    for (var i = 0; i < msg.length; i++) {
      firstWord = msg[i]

      if (keywords[firstWord] && i + 1 < msg.length) {
        secondWord = msg[i + 1]

        if(keywords[firstWord][secondWord] && keywords[firstWord][secondWord].length != 0) {
          
          let arrLen = keywords[firstWord][secondWord].length
          let randomNumber = Math.floor((Math.random() * arrLen))
          response = keywords[firstWord][secondWord][randomNumber]

        }else if(keywords[firstWord][secondWord] && keywords[firstWord][secondWord].length === 0){

          response = "I don't think I have a " + firstWord + " " + secondWord + "." 

        }else{

          keywords[firstWord][secondWord] = []
          response = "I don't know too much about this topic, maybe you can tell me more."

        }

      }else if(keywords[firstWord] && i+1 === msg.length){

        response = firstWord + " what?"
      }
    }

    return response
    
  }

  // // Check the user that interacted with the bot and see if they are in our database, if not add them.
  // checkForUser (username, isSub, isMod, isFollower) {
  //   for (i in list){
  //       if (list[i]["username"] === username){
  //           userExist = true;
  //           console.log("\nThe user, " + username + " , is in the list already!\n");
  //           break;
  //       } 
  //   }
  //   if (!userExist){
  //       console.log("\nThe user, " + username + " , is not in the list, adding them now!\n");
  //       addUser(username, isSub, isMod, isFollower);
  //   }
  //   // Save the list so that it has the latest contents
  //   fs.writeFileSync("./userLists.json", JSON.stringify(list));
  // }

  // // The user is not in our database. So lets add them through an object 
  // // and give them the default values. 
  //   addUser (username, isSub, isMod, isFollower) {
  //   userObject = {};
  //   userObject["username"] = username;
  //   userObject["subscriber"] = isSub;
  //   userObject["mod"] = isMod;
  //   userObject["follower"] = isFollower;
  //   userObject["points"] = defaultPoints;
  //   userObject["status"] = low;

  //   // Depending on the user's status in the channel, they will earn
  //   // higher points for being a higher status
  //   if (isSub == true) userObject["points"] += subPoints;
  //   if (isMod == true) userObject["points"] += modPoints;
  //   if (isFollower == true) userObject["points"] += followerPoints;
    
  //   // Add the user to the list
  //   list.push(userObject);
  // }

  // // Get the status for the user so we can interact differently
  // getUserStatus (username) {
  //   for (i in list) {
  //       if (list[i]["username"] === username) {
  //           userStatus = list[i]["status"];
  //           return userStatus;   
  //       }
  //   }
  // }
}

module.exports = BabyBot
