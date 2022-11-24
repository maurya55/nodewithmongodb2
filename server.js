const express = require("express");
const app = express();
const mongoose = require("mongoose");
require('dotenv').config()
const amqplib = require("amqplib");


const port = 4300;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', require("./router.js"));




app.use((req, res, next) => {
    return res.status(401).json({
        message: "not found"
    })
})


app.use((err, req, res, next) => {
    console.log(err.msg)
    return res.status(401).json({
        message: err.message
    })
})


async function rabbit() {
    const queue = 'tasks';
    // const conn = await amqplib.connect('amqp://localhost');
    const conn = await amqplib.connect('amqps://xkqumufe:flJcTjPT68JSo4pVt2Fk249iWCtNi4GH@rabbit.lmq.cloudamqp.com/xkqumufe');

    // const conn = await amqplib.connect({
    //     protocol: 'amqp',
    //     port: 5672,
    //     host: "localhost:2000/",
    //     // username: config.user,
    //     // password: config.password,
    //     frameMax: 4096
    // });

    const ch1 = await conn.createChannel();
    await ch1.assertQueue(queue);  
  
    // Listener
    ch1.consume(queue, (msg) => {
        // console.log(msg)
        if (msg !== null) {
            let message = JSON.parse(msg.content.toString())
            // console.log(message);
            if (message.sendTo == "nodeWithMongodb2") { 
                console.log('Recieved:', message);
                ch1.ack(msg);
            }
        } else {
            console.log('Consumer cancelled by server');
        }
    });
 
    // Sender
    const ch2 = await conn.createChannel();

    

    setInterval(() => {
        let message = {
            sendTo: "nodeWithMongodb",
            data: `data send from nodeWithMongodb2 ${Date.now()}`,
        }
        ch2.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    }, 1200);
}
rabbit();

// mongoose.connect('mongodb://localhost:27018/nodewithmongodb', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }, function (err) {
//     if (err) throw err;
// });

mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

var db = mongoose.connection;
db.on('error', function (err) { console.log( "Db Error ", err) });
db.on('open', function callback() {
    console.log("Db connected successfully");
});

app.listen(port, () => {

    console.log(`server is listen on port ${port} `)

})