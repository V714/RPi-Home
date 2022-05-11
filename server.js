const express = require('express')
const cors = require('cors')
const app = express()
const http = require('http').createServer(app)
const { exec } = require('child_process')
const bodyParser = require('body-parser')
const { MongoClient } = require('mongodb')


app.use(cors({credentials: true, origin: '*'}))
app.use(bodyParser.json())


const dburl = String("mongodb://127.0.0.1:27017/")
let db = null
let client = null

app.listen(4004, async() => {
	client = await MongoClient.connect(dburl)
	db = await client.db("home")
		await db.collection('homeDevices', function (err, collection){
			if(err) throw err;
			collection.deleteMany({})
			collection.insert({name: 'busy',state:false})
			collection.insert({name:'sleep',state:false})
			collection.insert({name:'door',state:false})
			collection.insert({name:'window',state:'Open'})
			})
})
app.get('/door', async(req,res) => {
	exec ('python3 /home/pi/rpihomeserver/src/api/scripts/door.py', (err, stdout, stderr) => {
		if(err) { console.error(err) }
		else {
				if(stdout == 1) { 
					res.json({door:true})
				}
				else { res.json({door:false})}
			}
		
	})

})

app.get('/doorsLights', async(req,res)=>{
	db.collection('homeDevices', async function(err,collection){
		if(err)throw err;
		const devices = await collection.find({}).toArray()
		res.json({busy:devices[0].state,sleep:devices[1].state})
	})

})

app.get('/checkWindow', async(req,res)=>{
	db.collection('homeDevices', async function(err,collection){
		if(err)throw err;
		const devices = await collection.find({name:"window"}).toArray()
		res.json({window:devices[0].state})
	})

})

app.post('/window', async(req,res)=>{
	const json = req.body
		db.collection('homeDevices', async function(err,collection){
	if(err)throw err;
	const devices = await collection.find({name:"window"}).toArray()
	const windowState = devices[0].state
	if(json.up&&windowState=="Closed"){
		
	var child = exec(`python3 /home/pi/rpihomeserver/src/api/scripts/shutterUp.py`)
	child.stdout.on('data', function (data) {
  console.log('stdout: ' + data.toString());
});

child.stderr.on('data', function (data) {
  console.log('stderr: ' + data.toString());
});
		collection.updateOne({name:"window"},{ $set: {state: 'Busy'}})
	child.on('exit', function() {
		
		collection.updateOne({name:"window"},{ $set: {state: 'Open'}})
	})	

	res.json({window:"Open"})
	}
		
			else if(!json.up&&windowState=="Open"){
		
	var child = exec(`python3 /home/pi/rpihomeserver/src/api/scripts/shutterDown.py`)

	child.stdout.on('data', function (data) {
  console.log('stdout: ' + data.toString());
});

child.stderr.on('data', function (data) {
  console.log('stderr: ' + data.toString());
});
		collection.updateOne({name:"window"},{ $set: {state: 'Busy'}})
	child.on('exit', function() {
		
		collection.updateOne({name:"window"},{ $set: {state: 'Closed'}})
	})	

	res.json({window:"Open"})
	}
			else{
			res.json({window:"Can't"})}

	})
	

})
app.post('/doorsLights', async(req,res)=>{
	const json = req.body
		db.collection('homeDevices', async function(err,collection){
	if(err)throw err;
	
	let busy = null
	let sleep = null
	const devices = await collection.find({}).toArray()
	busy = devices[0]
	sleep = devices[1]
	let farg = 0
	let sarg = 0
	if(json.light == 'yellow'){
		farg = !busy.state ? 1 : 0;
		sarg = sleep.state ? 1 : 0;
		console.log(farg)
		collection.updateOne({name:"busy"},{ $set: {state: !busy.state}})
	} else {
		farg = busy.state ? 1 : 0;
		sarg = !sleep.state ? 1 : 0;
		collection.updateOne({name:"sleep"},{ $set: {state: !sleep.state}})
	}
	var child = exec(`python3 /home/pi/rpihomeserver/src/api/scripts/doorsLights.py ${farg} ${sarg}`)

	res.json({busy:farg,sleep:sarg})
	})

})

