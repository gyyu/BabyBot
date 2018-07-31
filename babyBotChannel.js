
module.exports = class BabyBotChannel{

    setMethods(toBotMethod, toHandlerMethod, joinSuccessMethod, offlineMethod){
        this.msgToBot = toBotMethod
        this.msgToHandler = toHandlerMethod
        this.onJoin = joinSuccessMethod
        this.offLine = offlineMethod
    }
  
    toBot( channelName, context, msg, self){
       
        this.msgToBot(channelName, context, msg, self)

    }


    toHandler(target, type, msg){

        this.msgToHandler(target, type, msg)

    }

    onJoinSuccessful(username){

        this.onJoin(username)

    }


    onStreamOffline(){

        this.offLine()

    }



}

