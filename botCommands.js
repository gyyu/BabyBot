let knownCommands = { introduce, feed, teach };
var timers = [300000, 600000, 900000];
var randomTime = timers[Math.floor(Math.random() * myArray.length)];

var learnedCurseWords = [];
var curseWordCounter = learnedCurseWords.length;

// Pulling list of curse words from a text file and putting them into an array
var possibleCurseWords = require('fs').readFileSync(listofbadwords.txt, 'utf-8')
    .split('\n')
    .filter(Boolean);

// Bot will do something every 5 mins (in milliseconds), we should probably make a list of possible intervals and rotate through them
function requestFeed (channel, user, message, self) {
  setInterval( ()=> {
    client.say("channel", "Feed me");
  }, randomTime);
}

// Bot will do something every 5 mins (in milliseconds), we should probably make a list of possible intervals and rotate through them
function requestNap (channel, user, message, self) {
  setInterval( ()=> {
    client.say("channel", "I am going to sleep now. Please don't yell or I will start crying");
  }, randomTime);
}

// Helper function to send the correct type of message:
function sendMessage (target, context, message) {
  if (context['message-type'] === 'whisper') {
    client.whisper(target, message)
  } else {
    client.say(target, message)
  }
}

function failedBot (target, context, message) {
  if (curseWordCounter == possibleCurseWords.length) {
    sendMessage('channel', 'message', 'you have failed in raising me,')
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
   
    // No command was said, but the bot was tagged, we should put whatever is said into a knowledge database or say what the user wants the bot to say
  } else if (commandName === username) 
  {
    if (parse.includes('say')) {
      msg.slice(1) // Remove the 'say' keyword, send everything after it, the tagged username should already be removed
      sendMessage('channel', 'message', msg)
      // If the message contains a curse word and it's not part of the learned curse words, add it.
      if (parse.some(r=> possibleCurseWords.indexOf(r) >= 0) === true && !(parse.some(r=> learnedCurseWords.indexOf(r) >= 0)))
      {
        learnedCurseWords.push(parse)
      }
    } 
    else {
    console.log(`* Unknown command ${commandName} from ${context.username}`)
    }
  }
}