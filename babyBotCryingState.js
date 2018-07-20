const cryState = require('./Settings/cryingState.json')


class CryingState {

  constructor (botRef) {

    this.botRef = botRef
    this.cryingResponse = cryState.response
    this.sendCryingMessage()
    this.cryingIntervalID = setInterval(this.sendCryingMessage.bind(this), cryState.messageInterval)
    this.counter = 0
}

  onCommand (cmdName) {

    let ageGroup = this.botRef.getAgeGroup()
    let response
    let commandUser = this.botRef.commandUser

    if(!this.holder && cmdName === 'Hold'){
        
        this.startTime = (new Date).getTime()
        this.holder = commandUser
        clearInterval(this.cryingIntervalID)

        this.holdTimeDurationID = setTimeout(this.endCryingState.bind(this), cryState.requiredHoldingTime - this.counter)
        
        let listLength = this.cryingResponse[cmdName][ageGroup].length
        let ranNum = Math.floor(Math.random() * listLength)

        response = this.cryingResponse[cmdName][ageGroup][ranNum]

        return [this.holder,'whisper', response]
      
    }else if(!this.holder){

      let listLength = this.cryingResponse[cmdName][ageGroup].length
      let ranNum = Math.floor(Math.random() * listLength)

      response = this.cryingResponse[cmdName][ageGroup][ranNum]

      return ["","", response]

    }else if(this.holder && commandUser !== this.holder){

      return ["","", "/me " + this.holder + " is holding the bot. It can't hear you."]

    }else if(commandUser === this.holder){

      return [this.holder, "whisper", "I can't hear you, please whisper to me :)"]

    }
}

onWhisperCommand(cmdName){

  if(this.botRef.commandUser === this.holder && cmdName === "PutDown"){
    
    this.holder = null

    clearTimeout(this.holdTimeDurationID)

    this.endTime = (new Date).getTime()
    this.counter += (this.endTime - this.startTime)
  
    if(this.counter < cryState.requiredHoldingTime){
      
      this.cryingIntervalID = setInterval(this.sendCryingMessage.bind(this), cryState.messageInterval)
    
    }else{

      this.endCryingState()

    }

    return ["","", "/me " +this.botRef.commandUser+ " has put down the bot"]

  }else{

    return [this.holder,"whisper", "I don't understand, why are you telling me to do things now :'("]

  }


}

  sendCryingMessage(){

    let msg = ["","",cryState.cryingMessage]
    this.botRef.say(msg)

  }

  endCryingState(){

    let msg = [this.holder,"whisper",cryState.endingMessage]
    this.botRef.say(msg)
    this.botRef.changeToNormalState()

  }

}

module.exports = CryingState