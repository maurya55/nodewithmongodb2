const User = require('./userModel');
const { createClient } = require('redis');
const client = createClient();

module.exports = {


    checkName: async function (req, res) {

        try {

            await User.create({
                name: req.body.name,
                email: req.body.email
            })

            return res.status(200).json({
                message: "data store successfully"
            })
        }
        catch (err) {
            return res.status(500).json({
                message: err.message
            })
        }


    },

    getApiData: async function (req, res) {
        try {
            await client.connect();
            let redisstatus;
            console.log(await client.get('userData'));
            var getData = JSON.parse(await client.get('userData'));

            if (!getData) {
                redisstatus = "set";
                getData = await User.find({});
                await client.set('userData', JSON.stringify(getData));
            }
            else {
                redisstatus = "delete";
                await client.del('userData');
            }
            await client.disconnect();
            return res.status(200).json({
                redisstatus,
                message: "get data",
                data: getData
            })
        }
        catch (err) {
            return res.status(500).json({
                message: err.message
            })
        }
    }
}
