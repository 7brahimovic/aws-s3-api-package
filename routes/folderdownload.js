require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
var router = express.Router();
const folderdownloader = require("./folderdownloader");
const downloadFile = require("./normaldownload");
const GetType = require("./type");

router.use(bodyParser.json());

router.get("/", async function (req, res) {

    if (req.query.fileName) {
        let foldername = req.query.fileName;

        let timestamp = new Date().getTime();
        let fileName = `${foldername}.zip`;

        let zip = await folderdownloader(foldername);
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