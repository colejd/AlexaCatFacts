// Adapted from
// https://github.com/alexa/alexa-cookbook/tree/master/aws/Amazon-SNS

var strings = require("strings.json");

// Your skill's AWS region goes here
var AWSregion = 'us-east-1';

// The max length a constructed fact can be (limit for regular text messages)
const maxMessageLength = 160; 

// Gets a random element from an array or object.
function getRandomElement(arr) {
    if(arr.isArray) {
        return arr[Math.floor(Math.random() * arr.length)];
    } else {
        var keys = Object.keys(arr)
        return arr[keys[keys.length * Math.random() << 0]];
    }
}

function makeFakeFact() {
    // TODO: This function should replace numbers from the facts list with random numbers.
}

// Tacks some emoji onto the string and returns it, or gives the unmodified
// version if we don't have enough characters to fit the modified version
// in a text message.
function addEmojiDecorators(string) {
    var randomEmoji = getRandomElement(strings.emoji);
    var candidateString = "";

    // Pick between our choices by generating a random int 
    // in the range [0, numChoices)
    var numChoices = 2;
    var choice = Math.floor(Math.random() * (numChoices));

    if (choice == 0) {
        // Surround text with some emoji.
        // Example:
        // :cat: A group of cats is called a 'clowder'. :cat:
        candidateString = randomEmoji + " " + string + " " + randomEmoji;
    }
    else {
        // Replace all spaces with some emoji.
        // Example:
        // If :clap: emojis :clap: aren't :clap: good :clap: for :clap:
        // society :clap: then :clap: what :clap: is :clap: this?
        candidateString = string.replace(/ /g, randomEmoji);
    }

    return (candidateString.length < maxMessageLength) ? candidateString : string;

}

// Constructs a text message composed of a cat fact and a random 
// prefix / postfix / emoji pattern, all gated by RNG.
function makeMessage() {
    var randomBaseFact = getRandomElement(strings.catFacts);
    var randomPrefix = getRandomElement(strings.prefixes);
    var randomPostfix = getRandomElement(strings.postfixes);

    var fact = randomBaseFact;
    var machineReadableText = randomBaseFact;

    // Throw in some emojis, why not
    var emojiIncludeChance = 0.2; // Chance to pass. [0 - 1] range.
    if(Math.random() < emojiIncludeChance) {
        fact = addEmojiDecorators(fact);
    }

    // Try to add the selected prefix if there's room and RNG passes
    var prefixIncludeChance = 0.75; // Chance to pass. [0 - 1] range.
    var withPrefix = randomPrefix + " " + fact;
    if(withPrefix.length <= maxMessageLength && Math.random() < prefixIncludeChance) {
        fact = withPrefix;
        machineReadableText = randomPrefix + " " + machineReadableText;
    }

    // Add the selected postfix if there's room and RNG passes
    var postfixIncludeChance = 0.75; // Chance to pass. [0 - 1] range.
    var withPostfix = fact + " " + randomPostfix;
    if(withPostfix.length <= maxMessageLength && Math.random() < postfixIncludeChance) {
        fact = withPostfix;
       machineReadableText = machineReadableText + " " + randomPostfix;
    }

    return {
        "text": fact,
        "machineReadableText": machineReadableText // Basically just the text without the emojis
    }

}

//////////////////////////
/////// Skill Code ///////
//////////////////////////

var Alexa = require('alexa-sdk');

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);

    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit('MyIntent');
    },

    'MyIntent': function () {
        sendTxtMessage(myResult=>{

            var say = myResult;
            this.emit(':tell', say);

        });


    },

    'AMAZON.HelpIntent': function () {    
        this.emit(":tell", "I should work without any prompting.");
    },

    'AMAZON.StopIntent': function () {

    }

};

///////////////////////////////
/////// Helper Function ///////
///////////////////////////////

function sendTxtMessage(callback) {

    var AWS = require('aws-sdk');
    AWS.config.update({region: AWSregion});

    var SNS = new AWS.SNS();

    var message = makeMessage();
    var params = {
        PhoneNumber: process.env.PHONE_NUMBER,
        Message: message.text
    }

    SNS.publish(params, function(err, data){

        console.log('Sending message to ' + params.PhoneNumber.toString() + "..." );
        console.log('Message: ' + params.Message);

        if (err) {
            console.log(err, err.stack);
            callback('Error sending text message.');
        } else {
            //var randomConfirmation = getRandomElement(strings.confirmations);
            var response = "I sent the following cat fact: " + message.machineReadableText;
            callback(response);
        }

        

    });
}
