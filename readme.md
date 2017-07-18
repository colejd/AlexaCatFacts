# Alexa Cat Facts
*An Alexa skill for sending cat facts to an unfortunate friend of yours*

This is an Alexa skill that, when activated, sends a very interesting fact about cats via text message to a predefined phone number of your choice. Depending on your tastes you can add emojis and sassy text snippets to your facts.

## Installation

I made this by modifying an Alexa skill example from https://github.com/alexa/alexa-cookbook/tree/master/aws/Amazon-SNS. For most of the setup you'll want to follow the instructions in that link.

This is the code for the actual Lambda skill. Run `npm install` in the root directory of this project to get everything the package needs to run. Archive the contents of the folder and upload it to your Lambda skill (if you're on OSX, see [here](https://stackoverflow.com/a/34640743). You'll need to create an environment variable on the same page called `PHONE_NUMBER`, which holds a phone number in the `+12223334444` format. This will be the number Alexa sends texts to.


### Fact Sources
- https://user.xmission.com/~emailbox/catstuff.htm
- https://www.factretriever.com/cat-facts

I got a few of these from a pastebin I can't find anymore. If these are yours and you'd like credit, please contact me.

