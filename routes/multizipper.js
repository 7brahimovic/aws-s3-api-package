let archiver = require("archiver");
let aws = require("aws-sdk");

let stream = require("stream");
require("dotenv").config();

aws.config.setPromisesDependency();
aws.config.update({
  accessKeyId: process.env["AWS_ACCESS_KEY"],
  secretAccessKey: process.env["AWS_SECRET_ACCESS_KEY"],
  region: process.env["AWS_REGION"],
});
const S3 = new aws.S3();

let multizipFile = function (namelist) {
  let zip = new archiver.create("zip");
  return new Promise(function (resolve, reject) {
    for (const name of namelist) {
      // if(name.)

      let streamCreated = false;

      const passThroughStream = new stream.PassThrough();

      if (!streamCreated) {
        let file = S3.getObject({
          Bucket: process.env["AWS_BUCKET_NAME"],
          Key: name,
        })
          .createReadStream()
          .on("error", (error) => {});

        file.on("error", (error) => {}).pipe(passThroughStream);

        streamCreated = true;
      }
      zip.append(passThroughStream, {
        name: name,
      });
    }
    zip.finalize();
    resolve(zip);
  });

  // https://amiantos.net/zip-multiple-files-on-aws-s3/

  // let zip = new archiver.create('zip');
  // return new Promise(function (resolve, reject) {
  //     S3.getObject({
  //         //Bucket: process.env["AWS_BUCKET_NAME"],
  //         Bucket: "dickytest",
  //         Key: fileName
  //     }, function (err, data) {
  //         if (err) {
  //             console.log(err);
  //             reject(err);
  //         } else {
  //             zip.append(data.Body, {
  //                 name: fileName
  //             })
  //             zip.finalize();
  //             resolve(zip);
  //         }
  //     })
  // })
};
module.exports = multizipFile;
