require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
var router = express.Router();

const zipFile = require("./zipper");
const downloadFile = require("./normaldownload");
const GetType = require("./type");
let aws = require("aws-sdk");


router.use(bodyParser.json());
aws.config.setPromisesDependency();
aws.config.update({
  accessKeyId: process.env["AWS_ACCESS_KEY"],
  secretAccessKey: process.env["AWS_SECRET_ACCESS_KEY"],
  region: process.env["AWS_REGION"]
});
const S3 = new aws.S3();


router.get("/", async function (req, res) {
  if (req.query.fileNames) {
    let fileKeys = req.query.fileNames;

    let namelist = fileKeys.split(",");
    console.log(namelist);

    for (const name of namelist) {
        S3.deleteObject({
            Bucket: process.env["AWS_BUCKET_NAME"],
            Key: name
        }, function(err,data){
            if(err)
            console.log(err,err.stack);

            else
            console.log();
        }
        )
    }
  } else {
    return res.status(400).json({
      message: "fileNames is required",
    });
  }
});

module.exports = router;
