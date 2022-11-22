const express = require('express');
const router = express.Router();
const controller=require('./controller');



router.post("/storeApi",controller.checkName)
router.get("/getApi",controller.getApiData)

module.exports = router

