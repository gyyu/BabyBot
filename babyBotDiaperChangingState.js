const diaperChangeState = require('./diaperChangeState.json')


class DiaperChangingState {

  constructor (botRef) {

    this.botRef = botRef
    this.diaperChangeResponse = diaperChangeState.response
    //this.requestChangingIntervalID = setInterval(this.sendCryingMessage.bind(this), diaperChangeState.messageInterval)
    
    let len = diaperChangeState.eventInterval.length
    let ran = Math.floor(Math.random()* len)
    setTimeout(this.botRef.changeState.bind(this.botRef), diaperChangeState.eventInterval[ran])
}

  onCommand (cmdName) {

    let ageGroup = this.botRef.getAgeGroup()
    let response

    if(!this.diaperChangeResponse[cmdName]){
            
        cmdName = "NoCommandFound"

    }

    let listLength = this.diaperChangeResponse[cmdName][ageGroup].length
    let ranNum = Math.floor(Math.random() * listLength)

    response = this.diaperChangeResponse[cmdName][ageGroup][ranNum]

    if (cmdName === 'Hold') {
        
        return ['whisper', response]
        
    }else {
        
        return ['chat', response]
        
    }
  }

  sendCryingMessage(){

    this.botRef.babyBotChannel.toHandler("","",diaperChangeState.cryingMessage)


  }

  clearMessageInterval(){

    

  }
}

module.exports = DiaperChangingState