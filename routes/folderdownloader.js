const fs = require("fs");
const join = require("path").join;
const AWS = require("aws-sdk");
const s3Zip = require("s3-zip");

AWS.config.setPromisesDependency();
AWS.config.update({
  accessKeyId: process.env["AWS_ACCESS_KEY"],
  secretAccessKey: process.env["AWS_SECRET_ACCESS_KEY"],
  region: process.env["AWS_REGION"]
});
const bucket = process.env["AWS_BUCKET_NAME"];
const folder = "public/";
const s3 = new AWS.S3();

let DownloadFolder = function (folderName) {
  var params = {
    Bucket: bucket,
    Prefix: folderName,
  };

  const filesArray = [];

  return new Promise(function (resolve, reject) {
    s3.listObjectsV2(params, function (err, data) {
      if (err) {
        console.log(err, err.stack);
      } else {
        var jsonFromAWS = JSON.stringify(data, "Key", 6);
        var jsonContent = JSON.parse(jsonFromAWS).Contents;
        var result = AddingIsFolderKey(toTree(jsonContent));

        console.log(result);

        jsonContent.map((x) => filesArray.push(x.Key));

        console.log(filesArray);

        var zip = s3Zip
          .archive(
            {
              region: process.env["AWS_REGION"],
              bucket: process.env["AWS_BUCKET_NAME"],
              preserveFolderStructure: true,
            },
            "",
            filesArray
          )

          resolve(zip);
      }
    });
  });

};

module.exports = DownloadFolder;

function AddingIsFolderKey(root) {
  var objs = Object.values(root);

  objs.forEach((obj) => {
    var keys = Object.keys(obj);

    if (keys.length > 6) {
      obj["IsFolder"] = "True";

      AddingIsFolderKey(obj);
    } else {
      obj["IsFolder"] = "False";
    }
  });

  return objs;
}

function toTree(files) {
  const root = {};
  for (const { Key, LastModified, ETag, Size, StorageClass } of files) {
    var DownloadLink = Key;

    Key.match(/[^\/]+/g).reduce((acc, folder) => {
      if (!acc) {
        acc = {};
      }
      return (
        acc[folder] ||
        (acc[folder] = {
          Key: folder,
          LastModified: LastModified,
          ETag: ETag,
          Size: Size,
          StorageClass: StorageClass,
          DownloadLink: DownloadLink,
        })
      );
    }, root);
  }

  return root;
}
