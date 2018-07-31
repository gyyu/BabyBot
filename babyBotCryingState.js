const cryState = require('./Settings/cryingState.json')
const BabyBotStateParent = require('./babyBotStateParent.js')


class CryingState extends BabyBotStateParent{

  constructor (botRef) {

    super(botRef)
    this.cryingResponse = cryState.response
    this.stateMessage = cryState.message
    this.counter = 0
    this.botFeeling = cryState.botFeeling
    this.sendMessage(this.stateMessage)  
    this.cryingIntervalID =setInterval(this.sendMessage.bind(this,this.stateMessage), cryState.messageInterval)
}

  onCommand (cmdName, param= "", cmdUser ="") {

    let ageGroup = this.ageGroup
    let response

    if(!this.cryingResponse[cmdName]){
             
      cmdName = "noCommandFound"

    }

    if(!this.holder && cmdName === 'hold'){
        
        this.startTime = (new Date).getTime()
        this.holder = cmdUser
        clearInterval(this.cryingIntervalID)

        this.holdTimeDurationID = setTimeout(this.endCryingState.bind(this), cryState.requiredHoldingTime - this.counter)
        
        let listLength = this.cryingResponse[cmdName][ageGroup].length
        let ranNum = Math.floor(Math.random() * listLength)

        response = this.cryingResponse[cmdName][ageGroup][ranNum]

        // The user did something positive so give him positive points
        // addPoints(this.holder, cmdName)

        this.gettingBetterID = setInterval(function(){

          if(this.botFeeling.length != 0){
            this.sendMessage(this.botFeeling.shift(), this.holder,'whisper')
          }
        
        }.bind(this), cryState.moodChangeInterval)
      
    }else if(!this.holder && cmdName === "nap"){

      clearInterval(this.cryingIntervalID)
      this.toNappingState()
      
    }else if(!this.holder){

      let listLength = this.cryingResponse[cmdName][ageGroup].length
      let ranNum = Math.floor(Math.random() * listLength)

      response = this.cryingResponse[cmdName][ageGroup][ranNum]

      this.sendMessage(response)

    }else if(this.holder && cmdUser !== this.holder){

      this.sendMessage("/me " + this.holder + " is holding the bot. It can't hear you.")

    }else if(cmdUser === this.holder){

      this.sendMessage("I can't hear you, please whisper to me :)", this.holder, "whisper")

    }
}

onWhisperCommand(cmdName, param= "", cmdUser =""){

  if(cmdUser === this.holder && cmdName === "putdown"){
    this.holder = null
    this.clearIntervals()

    this.endTime = (new Date).getTime()
    this.counter += (this.endTime - this.startTime)
    console.log(this.counter)
    if(this.counter < cryState.requiredHoldingTime){
      
      this.cryingIntervalID = setInterval(this.sendMessage.bind(this, this.stateMessage), cryState.messageInterval)
    
    }else{

      this.endCryingState()

    }

    this.sendMessage( "/me " +cmdUser+ " has put down the bot")

  }else{

    this.sendMessage( "I don't understand, why are you telling me to do things now :'(", this.holder,"whisper")

  }

}

onTagged(msg, cmdUser = ""){

  if(this.holder && cmdUser != this.holder){

    this.sendMessage("/me " + this.holder + " is holding the bot. It can't hear you.")

  }else if(cmdUser === this.holder){

    this.sendMessage("I can't hear you, please whisper to me :)", this.holder, "whisper")

  }else{

    this.this.sendMessage(cryState.message + " Somebody hold me please :(")

  }

}

  endCryingState(){

    this.clearIntervals()

    setTimeout(function(){this.sendMessage(cryState.endingMessage,this.holder,"whisper")}.bind(this), 2000)
    this.toNormalState()

  }

  clearIntervals(){

    clearTimeout(this.holdTimeDurationID)
    clearInterval(this.cryingIntervalID)
    clearInterval(this.gettingBetterID)

  }

  saveStatus(){}

  onMessage(){}

}

module.exports = CryingState