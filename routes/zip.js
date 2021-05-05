require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
var router = express.Router();
const zipFile = require("./zipper");
const downloadFile = require("./normaldownload");
const GetType = require("./type");

router.use(bodyParser.json());

router.get("/", async function (req, res) {
  if (req.query.fileName) {
    let fileKey = req.query.fileName;
    let timestamp = new Date().getTime();

    let newname = fileKey;

    if (fileKey.includes(".zip")) {
      let file = await downloadFile(fileKey);
      res.setHeader("Content-Type", "application/zip");
      res.setHeader("Content-Disposition", "attachment; filename=" + fileKey);
      file.pipe(res);
      
    } else {
      newname = newname.substring(0, newname.indexOf("."));
      // if ((newname = "")) {
      //   newname = "without-name";
      // }

      let fileName = `${newname}.zip`;
      let zip = await zipFile(fileKey);
      res.setHeader("Content-Type", "application/zip");
      res.setHeader("Content-Disposition", "attachment; filename=" + fileName);
      zip.pipe(res);

    }
  } else {
    return res.status(400).json({
      message: "fileName is required",
    });
  }
});

module.exports = router;
