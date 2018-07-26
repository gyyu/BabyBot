const cryState = require('./Settings/cryingState.json')
const BabyBotStateParent = require('./babyBotStateParent.js')


class CryingState extends BabyBotStateParent{

  constructor (botRef) {

    super(botRef)
    this.cryingResponse = cryState.response
    this.stateMessage = cryState.message
    this.counter = 0
    this.sendMessage("","", this.stateMessage)  
    this.cryingIntervalID =setInterval(this.sendMessage.bind(this, "","", this.stateMessage), cryState.messageInterval)
}

  onCommand (cmdName, param= "", cmdUser ="") {

    let ageGroup = this.getAgeGroup()
    let response

    if(!this.cryingResponse[cmdName]){
             
      cmdName = "NoCommandFound"

    }

    if(!this.holder && cmdName === 'Hold'){
        
        this.startTime = (new Date).getTime()
        this.holder = cmdUser
        clearInterval(this.cryingIntervalID)

        this.holdTimeDurationID = setTimeout(this.endCryingState.bind(this), cryState.requiredHoldingTime - this.counter)
        
        let listLength = this.cryingResponse[cmdName][ageGroup].length
        let ranNum = Math.floor(Math.random() * listLength)

        response = this.cryingResponse[cmdName][ageGroup][ranNum]

        // The user did something positive so give him positive points
        // addPoints(this.holder, cmdName)

        this.sendMessage(this.holder,'whisper', response)
      
    }else if(!this.holder && cmdName === "Nap"){

      clearTimeout(this.cryingIntervalID)
      this.toNappingState()
      
    }else if(!this.holder){

      let listLength = this.cryingResponse[cmdName][ageGroup].length
      let ranNum = Math.floor(Math.random() * listLength)

      response = this.cryingResponse[cmdName][ageGroup][ranNum]

      this.sendMessage("","", response)

    }else if(this.holder && cmdUser !== this.holder){

      this.sendMessage("","", "/me " + this.holder + " is holding the bot. It can't hear you.")

    }else if(cmdUser === this.holder){

      this.sendMessage(this.holder, "whisper", "I can't hear you, please whisper to me :)")

    }
}

onWhisperCommand(cmdName, param= "", cmdUser =""){

  console.log("Put baby Down" + cmdUser + " " + cmdUser)

  if(cmdUser === this.holder && cmdName === "PutDown"){
    
   
    this.holder = null

    clearTimeout(this.holdTimeDurationID)

    this.endTime = (new Date).getTime()
    this.counter += (this.endTime - this.startTime)
  
    if(this.counter < cryState.requiredHoldingTime){
      
      this.cryingIntervalID = setInterval(this.sendMessage.bind(this, "","", this.stateMessage), cryState.messageInterval)
    
    }else{

      this.endCryingState()

    }

    this.sendMessage("","", "/me " +cmdUser+ " has put down the bot")

  }else{

    this.sendMessage(this.holder,"whisper", "I don't understand, why are you telling me to do things now :'(")

  }


}

  endCryingState(){

    this.sendMessage(this.holder,"whisper",cryState.endingMessage)
    this.toNormalState()

  }

}

module.exports = CryingState