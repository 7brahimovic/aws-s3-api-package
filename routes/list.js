let aws = require("aws-sdk");
const createJSON = require("./createJSON");
var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
var directorytree = require("directory-tree");

router.use(bodyParser.json());

aws.config.setPromisesDependency();
aws.config.update({
  accessKeyId: process.env["AWS_ACCESS_KEY"],
  secretAccessKey: process.env["AWS_SECRET_ACCESS_KEY"],
  region: process.env["AWS_REGION"],
});
const S3 = new aws.S3();

var params = {
  Bucket: process.env["AWS_BUCKET_NAME"],
  // Prefix: "public/",
};

// let ListFile = function () {
//     S3.listObjectsV2(params, function (err, data) {
//         if (err) {
//             console.log(err, err.stack);
//         } else {
//             createJSON(data);
//         }
//     });
// }

router.get("/", async function (req, res) {
  S3.listObjectsV2(params, function (err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      var jsonFromAWS = JSON.stringify(data, "Key", 6);
      var jsonContent = JSON.parse(jsonFromAWS).Contents;
      var result = AddingIsFolderKey(toTree(jsonContent));

      console.log(result);
      res.send(result);

      // console.log(toTree(files));
      // res.send(toTree(files));

      // console.log(JSON.stringify(toTree(new111)));
      // res.send(toTree(new111));
    }
  });

  function AddingIsFolderKey(root) {
    var objs = Object.values(root);

    objs.forEach((obj) => {
      var keys = Object.keys(obj);
      //  if(keys.length>6)

      //if(JSON.stringify(obj["DownloadLink"]).match("/"))?????
      //if(toString(obj["DownloadLink"]).includes("/"))
      if (keys.length > 6) {
        obj["IsFolder"] = "True";

        AddingIsFolderKey(obj);
      } else {
        obj["IsFolder"] = "False";
      }
    });

    // for (var obj in objs) {
    //   obj["IsFolder"] = "False";
    //   var keys = Object.keys(obj);

    //   for(var key in keys){
    //     if(key.toString() != "Key" ||
    //     "LastModified" ||
    //     "ETag" ||
    //     "Size" ||
    //     "StorageClass" ||
    //     "DownloadLink" ||
    //     "IsFolder") {
    //       obj["IsFolder"] = "True";
    //     }
    //   }

    // }
    // for (var obj in root) {

    //   obj["IsFolder"] = "False";
    //   var keys = Object.keys(obj);

    // for (var i = 0; i < keys.length; i++) {
    //   var val = obj[keys[i]];
    //   if (
    //     val != "Key" ||
    //     "LastModified" ||
    //     "ETag" ||
    //     "Size" ||
    //     "StorageClass" ||
    //     "DownloadLink" ||
    //     "IsFolder"
    //   ) {
    //     obj["IsFolder"] = "True";
    //   }

    // }

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
});

module.exports = router;
