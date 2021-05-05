let archiver = require('archiver');
let aws = require("aws-sdk");
require("dotenv").config();

aws.config.setPromisesDependency();
aws.config.update({

    accessKeyId: process.env["AWS_ACCESS_KEY"],
    secretAccessKey: process.env["AWS_SECRET_ACCESS_KEY"],
    region: process.env["AWS_REGION"]
});
const S3 = new aws.S3();

let createZipFile = function (fileName) {
    let zip = new archiver.create('zip');
    return new Promise(function (resolve, reject) {
        S3.getObject({
            Bucket: process.env["AWS_BUCKET_NAME"],
            Key: fileName
        }, function (err, data) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                zip.append(data.Body, {
                    name: fileName
                })
                zip.finalize();
                resolve(zip);
            }
        })
    })
}
module.exports = createZipFile;