
module.exports = class BabyBotChannel{

    setMethods(toBotMethod, toHandlerMethod, joinSuccessMethod){
        this.msgToBot = toBotMethod
        this.msgToHandler = toHandlerMethod
        this.onJoin = joinSuccessMethod
    }
  
    toBot( channelName, context, msg, self){
       
        this.msgToBot(channelName, context, msg, self)

    }


    toHandler(target, type, msg){

        this.msgToHandler(target, type, msg)

    }

    onJoinSuccessful(target){

        this.onJoin(target)

    }





}

