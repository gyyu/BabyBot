const napState = require('./nappingState.json')


class NappingState {

  constructor (botRef) {

    this.botRef = botRef
    this.napingResponse = napState.response
    setTimeout(this.botRef.changeState.bind(this.botRef), 1000)
    
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
    return ['chat', response]
        
    
  }

  clearMessageInterval(){

  }
}

module.exports = NappingState