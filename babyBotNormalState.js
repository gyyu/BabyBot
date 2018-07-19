const normalState = require('./Settings/normalState.json')


class NormalState {

    constructor (botRef) {
  
      this.botRef = botRef
      this.normalResponse = normalState.response

      let len = normalState.eventInterval.length
      let ran = Math.floor(Math.random()* len)
      setTimeout(this.botRef.changeState.bind(this.botRef), normalState.eventInterval[ran])
    }
  
    onCommand (cmdName) {
     
      let ageGroup = this.botRef.getAgeGroup()
      let response
  
      if(!this.normalResponse[cmdName]){
             
          cmdName = "NoCommandFound"
  
      }
  
      let listLength = this.normalResponse[cmdName][ageGroup].length
      let ranNum = Math.floor(Math.random() * listLength)
  
      response = this.normalResponse[cmdName][ageGroup][ranNum] 
      return ['','chat', response]
          
      
    }
        
  
  }

  module.exports = NormalState