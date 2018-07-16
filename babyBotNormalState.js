const normalResponse = require('./normalResponse.json')


class NormalState {

    constructor (botRef) {
  
      this.botRef = botRef
      this.normalResponse = normalResponse.response
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
      
      if (cmdName === 'Hold') {
          
          return ['whisper', response]
          
      }else {
          
          return ['chat', response]
          
      }
    }
    
      
  
  }

  module.exports = NormalState