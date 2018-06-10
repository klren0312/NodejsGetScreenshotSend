const screenshot = require('screenshot-desktop')
const nodemailer = require('nodemailer')
const schedule = require('node-schedule')
const fs = require('fs')

 

var transporter = nodemailer.createTransport({
    host:"",
    secure:true,
    port:465,
    auth: {
        user: "",
        pass: ""
    },
    debug: true // include SMTP traffic in the logs
});

var rule = new schedule.RecurrenceRule();
	rule.second = 10;
	var j = schedule.scheduleJob(rule,function(){
		screenshot()
		.then((img) => {
			fs.writeFile('out.jpg', img,function(err){
				if (err) {
					throw err
				}
				console.log('written to out.jpg')
			});
	
			var message = {
				from:"",
				to:"",
				subject:"桌面截图",
				html:'桌面截图：<img src="cid:test"/>',
	
				attachments:[
					{
						filename: 'out',
						path: __dirname + '/out.jpg',
						cid: 'test' // should be as unique as possible
					}
				]
			}
			transporter.sendMail(message, (error, info) => {
				if (error) {
					console.log('Error occurred');
					console.log(error.message);
					return;
				}
				console.log('Message sent successfully!');
				console.log('Server responded with "%s"', info.response);
				transporter.close();
			});
		})
		.catch((err) => {
			throw err
		})
	});
