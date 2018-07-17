const napState = require('./nappingState.json')


class NappingState {

  constructor (botRef) {

    this.botRef = botRef
    this.napingResponse = napState.response
    this.sendSleepyMessage()
    setTimeout(this.botRef.changeToNormalState.bind(this.botRef), napState.stateDuration)
    
}

  onCommand (cmdName) {

    let ageGroup = this.botRef.getAgeGroup()
    let response

    if(!this.napingResponse[cmdName]){
            
        cmdName = "NoCommandFound"

    }

    let listLength = this.napingResponse[cmdName][ageGroup].length
    let ranNum = Math.floor(Math.random() * listLength)

    response = this.napingResponse[cmdName][ageGroup][ranNum]
    return ['chat', response]
        
  }

  sendSleepyMessage(){

    this.botRef.babyBotChannel.toHandler("","", napState.nappingMessage)

  }

}

module.exports = NappingState