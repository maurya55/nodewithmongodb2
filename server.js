const express = require("express");
const app = express();
const mongoose = require("mongoose");
require('dotenv').config()



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