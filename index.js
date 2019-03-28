const screenshot = require('screenshot-desktop')
const nodemailer = require('nodemailer')
const schedule = require('node-schedule')
const fs = require('fs')

// 配置邮件相关
const transporter = nodemailer.createTransport({
    host:"",
    secure:true,
    port:465,
    auth: {
        user: "",
        pass: ""
    },
    debug: true // include SMTP traffic in the logs
});

// 定时规则
let rule = new schedule.RecurrenceRule();
rule.second = 10;
// 定时
schedule.scheduleJob(rule, function(){
	// 截图
	screenshot().then((img) => {
		fs.writeFile('out.jpg', img, function(err){
			if (err) {
				throw err
			}
			console.log('written to out.jpg')
		})
		const message = {
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
		// send
		transporter.sendMail(message, (error, info) => {
			if (error) {
				console.log('Error occurred', error.message)
				return
			}
			console.log(`Message sent successfully! Server responded with "${info.response}"`)
			transporter.close()
		})
	}).catch((err) => {
		throw err
	})
})
