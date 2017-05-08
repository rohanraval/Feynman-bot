'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
//app.get('/', function (req, res) {
//	res.send(req.query['hub.challenge'])
//})

// for Facebook verification
app.get('/webhook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'helloworld') {
		res.send(req.query['hub.challenge'])
	}
	res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})

//API endpoint
app.post('/webhook/', function (req, res) {
	let quotes = [
	"For a successful technology, reality must take precedence over public relations, for Nature cannot be fooled.",
	"Physics is like sex: sure, it may give some practical results, but that's not why we do it.",
	"What I cannot create, I do not understand."
	];
	var quote = quotes[Math.floor(Math.random() * quotes.length )]
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
	    let event = req.body.entry[0].messaging[i]
	    let sender = event.sender.id
	    if (event.message && event.message.text) {
		    let text = event.message.text
		    sendTextMessage(sender, quote)
	    }
    }
    res.sendStatus(200)
})

const token = "EAABvLuCowpMBADWk0o2wEdSY24fhXKlPaoS9ZAwQmyBumBPMYjSpglJSVxvOUADhONzMCkbQpZBBCJFjnmGwUzZBAGeOpIfND3v2mTZAZBdQD8h0ABxWejBNPOjsS1ymgvQQp8qIvkUfalZB9ZBz6UJZCOamu0WjWAVHEkdcLjfykgZDZD"

// echo message to user
function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
	    url: 'https://graph.facebook.com/v2.6/me/messages',
	    qs: {access_token:token},
	    method: 'POST',
		json: {
		    recipient: {id:sender},
			message: messageData,
		}
	}, function(error, response, body) {
		if (error) {
		    console.log('Error sending messages: ', error)
		} else if (response.body.error) {
		    console.log('Error: ', response.body.error)
	    }
    })
}