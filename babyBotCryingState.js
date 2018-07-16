const cryState = require('./cryingState.json')


class CryingState {

  constructor (botRef) {

    this.botRef = botRef
    this.cryingResponse = cryState.response
    this.cryingInterval = setInterval(this.sendCryingMessage.bind(this), cryState.messageInterval)
}

  onCommand (cmdName) {

    let ageGroup = this.botRef.getAgeGroup()
    let response

    if(!this.cryingResponse[cmdName]){
            
        cmdName = "NoCommandFound"

    }

    let listLength = this.cryingResponse[cmdName][ageGroup].length
    let ranNum = Math.floor(Math.random() * listLength)

    response = this.cryingResponse[cmdName][ageGroup][ranNum]

    if (cmdName === 'Hold') {
        
        return ['whisper', response]
        
    }else {
        
        return ['chat', response]
        
    }
  }

  sendCryingMessage(){

    this.botRef.babyBotChannel.toHandler("","",cryState.cryingMessage)


  }

}

module.exports = CryingState