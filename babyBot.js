const setting = require('./Settings/botState.json')
const chatRecorder = require('./chatRecorder.js')
const NormalState = require('./babyBotNormalState.js')
const CryingState = require('./babyBotCryingState.js')
const NappingState = require('./babyBotNappingState.js')
const HungryState = require('./babyBotHungryState.js')
const DiaperChangingState = require('./babyBotDiaperChangingState.js')
const lists = require('./Settings/botLists.json')
<<<<<<< HEAD
// const users = require('./Settings/userLists.json')
// const fs = require('fs')

// let list = users;
// let userExist = false;

// // Status point variables
// let defaultPoints = 0;
// let followerPoints = 1;
// let modPoints = 2;
// let subPoints = 3;

let taggedCounter = 0; // used to measure the number of times the bot interacts, when it hits a certain number, it will take a nap 
let goodbyeList = lists.botLists["possible"]["goodbye"]; 
let cursewordList = lists.botLists["possible"]["cursewords"];
=======
const wordObjects = require('./Settings/botWords.json')

let taggedCounter = 0; // used to measure the number of times the bot interacts, when it hits a certain number, it will take a nap 
let goodbyeList = lists.botLists["possible"]["goodbye"]; 
let cursewordList = lists.botLists["possible"]["cursewords"]
>>>>>>> b9f87fb8ec18ebad2050ecdd176e035e33ec75b0

class BabyBot {

  constructor (botRef) {
    this.currentState = new NormalState(this)
    this.startTime = (new Date).getTime()
    this.beginingAge = setting.age
    this.secToYear = setting.secToYear
    this.secToMonth = setting.secToMonth
    this.secToDay = setting.secToDay
    this.babyBotChannel = botRef

  }

  say(target, type, msg){

    this.babyBotChannel.toHandler(target, type, msg)

  }

  changeState () {

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
      // this.currentState = new HungryState(this)

    }
  }

  changeToNappingState(){

    if(!(this.currentState instanceof NappingState)){

      this.currentState = new NappingState(this)

    }

  }

  changeToNormalState(){
 
    if(!(this.currentState instanceof NormalState)){

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

  onJoin(channelName){

    this.babyBotChannel.toHandler(channelName, '', setting.greetingMessage)

  }


  onMessage (channelName, context, msg, self) {

      let chatMsg = `[${channelName} (${context['message-type']})] ${context.username}: ${msg}` // + JSON.stringify(context)
      // saveChatMessage(chatMsg)
      console.log(chatMsg)
<<<<<<< HEAD
      console.log(context)

      // A user has sent a message. Lets see if they are in our reputation database, if not, add them.
      // checkForUser(context.username, , true, true);

=======
      console.log(msg.length)
>>>>>>> b9f87fb8ec18ebad2050ecdd176e035e33ec75b0
      let msgType = context["message-type"]
 
      // Ignore messages from the bot
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

            if (taggedUser === setting.username) {

                this.learnFromMessage(newMsg, wordObjects.heavyWeight)

            }else {

                this.learnFromMessage(newMsg, wordObjects.lightWeight)

            }

            let responseMessage = this.getResponseToKeywords(newMsg)
            this.babyBotChannel.toHandler("","", responseMessage)

        }else{
         
          this.currentState.onMessage(msg.split(' '))
          let newMsg = this.stripMsg(msg.split(' '))
          this.learnFromMessage(newMsg, wordObjects.lightWeight)
          

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
          this.learnFromMessage(newMsg, wordObjects.heavyWeight)

        }
      }
          
    }

  }

  stripMsg(msg){

    let resultMsg = msg.filter(word => !wordObjects.meaninglessWords[word.toLowerCase()])
    return resultMsg

  }

  saveChatMessage (msg) {
    chatRecorder.storeMsg(msg)
  }

  learnFromMessage (msg, weight) {
    msg.forEach(function(word){
      if(wordObjects.learnedWords[word.toLowerCase()]){
        wordObjects.learnedWords[word.toLowerCase()] += weight
      }else{
        wordObjects.learnedWords[word.toLowerCase()] = weight
      }
    })

  }

  getResponseToKeywords (msg) {
    console.log(msg)
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

<<<<<<< HEAD
      // This code loops through goodbye list and if it encounters a word from that list in the user's message, someone is saying 
      // goodbye so the bot should say something too. We would have to do this for every list so I'm trying to find a simpler way of doing it. 
      for ( var e = 0; e < goodbyeList.length; e++) {
        if (msg[i] === goodbyeList[e]) {
          // do some if statements that check at status and based on status a different message will be sent
          if (getUserStatus(useranme) = "high") console.log("no don't leave me");
      }
=======
    // for ( var e = 0; e < cursewordList.length; e++) {
    //   if (msg[i] === cursewordList[e]) {
    //     console.log(msg[i] + '?')
    //   }
    // }
>>>>>>> b9f87fb8ec18ebad2050ecdd176e035e33ec75b0

    for (var i = 0; i < msg.length; i++) {
      firstWord = msg[i]

      if (keywords[firstWord] && i + 1 < msg.length) {
        secondWord = msg[i + 1]

        if(keywords[firstWord][secondWord] && keywords[firstWord][secondWord].length != 0) {
          
          let arrLen = keywords[firstWord][secondWord].length
          let randomNumber = Math.floor((Math.random() * arrLen))
          response = keywords[firstWord][secondWord][randomNumber]
<<<<<<< HEAD
        }else {
          response = firstWord + ' what?'
        }
      }else {
        response = firstWord + ' what?'
      }
    }

    return response
  }
}
=======
>>>>>>> b9f87fb8ec18ebad2050ecdd176e035e33ec75b0

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
