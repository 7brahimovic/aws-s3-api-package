require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
var router = express.Router();
const multizipFile = require("./multizipper");
const downloadFile = require("./normaldownload");
const GetType = require("./type");

router.use(bodyParser.json());

router.get("/", async function (req, res) {

    if (req.query.fileNames) {
        let fileKeys = req.query.fileNames;

        let namelist = fileKeys.split(',');

        let timestamp = new Date().getTime();
        let fileName = `${timestamp}.zip`;

        let zip = await multizipFile(namelist);
        res.setHeader("Content-Type", "application/zip");
        res.setHeader("Content-Disposition", "attachment; filename=" + fileName);
        zip.pipe(res);


    } else {
        return res.status(400).json({
            message: "fileNames is required",
        });
    }
});

module.exports = router;