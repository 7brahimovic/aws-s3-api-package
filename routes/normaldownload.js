"use strict";
let aws = require("aws-sdk");

aws.config.setPromisesDependency();
aws.config.update({
  accessKeyId: process.env["AWS_ACCESS_KEY"],
  secretAccessKey: process.env["AWS_SECRET_ACCESS_KEY"],
  region: process.env["AWS_REGION"]
});

const S3 = new aws.S3();

let DownloadNormalFile = function (fileName) {

  var file = S3.getObject({
    Bucket: process.env["AWS_BUCKET_NAME"],
    Key: fileName
    }).createReadStream()
      .on("error", error => {
      });


  return file ;
};

module.exports = DownloadNormalFile;
