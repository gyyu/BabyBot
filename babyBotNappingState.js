const napState = require('./Settings/nappingState.json')

class NappingState {

  constructor (botRef) {

    this.botRef = botRef
    this.napingResponse = napState.response
    this.sendSleepyMessage()
    console.log(napState.stateDuration)
    setTimeout(this.botRef.changeToNormalState.bind(this.botRef), napState.stateDuration)
    
}

  onCommand (cmdName) {

    let ageGroup = this.botRef.getAgeGroup()
    let response

    if(!this.napingResponse[cmdName]){
            
      return ['','chat', "/me babyBot is sleeping right now. It can't hear you! Plus, that's not a valid command."]

    }

    // let listLength = this.napingResponse[cmdName][ageGroup].length
    // let ranNum = Math.floor(Math.random() * listLength)

    // response = this.napingResponse[cmdName][ageGroup][ranNum]
    return ['','chat', "/me babyBot is sleeping right now. It can't hear you!"]
        
  }

  sendSleepyMessage(){

    let msg = ["","", napState.nappingMessage]
    this.botRef.say(msg)

  }

}

module.exports = NappingState