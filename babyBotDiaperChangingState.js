const diaperChangeState = require('./Settings/diaperChangeState.json')


class DiaperChangingState {

  constructor (botRef) {

    this.botRef = botRef
    this.diaperChangeResponse = diaperChangeState.response
    this.requestDiaperChangeMessage()
    this.requestChangingIntervalID = setInterval(this.requestDiaperChangeMessage.bind(this), diaperChangeState.messageInterval)
    
}

  onCommand (cmdName) {

    let ageGroup = this.botRef.getAgeGroup()
    
    if(!this.diaperChangeResponse[cmdName]){
            
        cmdName = "NoCommandFound"

    }

    let listLength = this.diaperChangeResponse[cmdName][ageGroup].length
    let ranNum = Math.floor(Math.random() * listLength)

    let response = this.diaperChangeResponse[cmdName][ageGroup][ranNum]

    if (cmdName === 'Change') {
        clearInterval(this.requestChangingIntervalID)
        this.botRef.changeToNormalState()      
    }

    return ["","chat", response]
  }

  requestDiaperChangeMessage(){

    let msg = ["","",diaperChangeState.cryingMessage]
    this.botRef.say(msg)
    
  }

}

module.exports = DiaperChangingState