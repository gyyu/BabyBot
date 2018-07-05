let knownCommands = { introduce, feed, teach }
var timers = [300000, 600000, 900000]
var randomTime = timers[Math.floor(Math.random() * myArray.length)];
var learnedCurseWords = []

// pulling list of curse words from a text file and putting them into an array
var possibleCurseWords = require('fs').readFileSync(listofbadwords.txt, 'utf-8')
    .split('\n')
    .filter(Boolean);

// Send a message to the server when the bot has connected 
client.on('connected', function(addr,port) {
  console.log("[bot] Bot was started")
});

// Send a message to the chat when the bot has connected
client.on('connected', function(addr,port) {
  client.say("user can go here", "Hi I am blank bot here to blank blank")
});

// What to do if a command is detected
client.on('chat', function(channel, user, message, self) {
  if(message === "you suck!")
   sendMessage('channel', 'message', 'you suck too')
});


// Tags user that it is responding to when it reads the message hi
client.on('chat', function(channel, user, message, self) {
  if(message === "Hi")
    client.say("channel", user['display-name'] + "Hi")
});

// what to do if the introduce command is detected, 2 ways to do it.
function introduce (target, context) {
  sendMessage('channel', 'message', 'introduce blank i am blank intro blank')
  client.say("user can go here", "introduce blank i am blank intr blank")
}

// Bot will do something every 5 mins (in milliseconds), we should probably make a list of possible intervals and rotate through them
setInterval( ()=> {
  client.say("channel", "Feed me");
}, timers);

// Bot will do something every 5 mins (in milliseconds), we should probably make a list of possible intervals and rotate through them
setInterval( ()=> {
  client.say("channel", "I am going to sleep now. Please don't yell or I will start crying");
}, timers);

// Helper function to send the correct type of message:
function sendMessage (target, context, message) {
  if (context['message-type'] === 'whisper') {
    client.whisper(target, message)
  } else {
    client.say(target, message)
  }
}

// Called every time a message comes in:
function onMessageHandler (target, context, msg, self) {
  if (self) { return } // Ignore messages from the bot

  // This isn't a command since it has no prefix:
  if (msg.substr(0, 1) !== commandPrefix) {
    console.log(`[${target} (${context['message-type']})] ${context.username}: ${msg}`)
    return
  }

  // Split the message into individual words:
  const parse = msg.slice(1).split(' ')
  // The command name is the first (0th) one:
  const commandName = parse[0]
  // The rest (if any) are the parameters:
  const params = parse.splice(1)

  // If the command is known, let's execute it:
  if (commandName in knownCommands) {
    // Retrieve the function by its name:
    const command = knownCommands[commandName]
    // Then call the command with parameters:
    command(target, context, params)
    console.log(`* Executed ${commandName} command for ${context.username}`)
  } else if (commandName === username) 
  {
    // No command was said, but the bot was tagged do something here
  } else {
    console.log(`* Unknown command ${commandName} from ${context.username}`)
  }
}


