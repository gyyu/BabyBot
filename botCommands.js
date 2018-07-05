let knownCommands = { introduce, feed, teach };
var timers = [300000, 600000, 900000];
var randomTime = timers[Math.floor(Math.random() * timers.length)];

var learnedCurseWords = [];
var uniqueCurseWords = [];
var curseWordCounter = uniqueCurseWords.length;

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

  // Split the message into individual words with the first character (! or @) being removed
  const parse = msg.slice(1).split(' ')
  // The command name is the first (0th) one:
  const commandName = parse[0]
  // The rest (if any) are the parameters:
  const params = parse.shift()

  // If the command is known, let's execute it:
  if (commandName in knownCommands) {
    // Retrieve the function by its name:
    const command = knownCommands[commandName]
    // Then call the command with parameters:
    command(target, context, params)
    console.log(`* Executed ${commandName} command for ${context.username}`)
   
    // No command was said, but the bot was tagged, we should put whatever is said into a knowledge database or say what the user wants the bot to say
  } else if (commandName === username) {
    // Lets go through each word in the message and look for keywords such as curse words.
    for ( var i = 0; i < parse.length; i++ ) {

      // Keyword code can go here. Might be worth turning all this into a function.

      // This will look for curse words in the message and add it to a list of curse words that the bot knows
      for ( var e = 0; e < possibleCurseWords.length; e++ ) {
        if ( parse[i] === possibleCurseWords[e]) {
          // Push the new curse words to the learned list 
          learnedCurseWords.push(parse[i]);
          // Have to do this to avoid duplicate curse words learned. Have to find a cleaner way of oding it
          uniqueCurseWords = learnedCurseWords.filter(function(item, i, ar){ return ar.indexOf(item) === i; });
        }
      }
    }
  }
    else {
    console.log(`* Unknown command ${commandName} from ${context.username}`)
    }
  }