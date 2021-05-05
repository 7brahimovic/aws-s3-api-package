require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
var router = express.Router();
const zipFile = require("./zipper");
const downloadFile = require("./normaldownload");
const GetType = require("./type");
let fs = require("fs");
let aws = require("aws-sdk");
const path = require("path");

var multer = require("multer");
const cors = require("cors");

router.use(bodyParser.json());
var origins = {
  origin: ["http://localhost:9000"],
  optionsSuccessStatus: 200,
  credentials: false,
};
router.use(cors(origins));

router.use(cors());

aws.config.setPromisesDependency();
aws.config.update({
  accessKeyId: process.env["AWS_ACCESS_KEY"],
  secretAccessKey: process.env["AWS_SECRET_ACCESS_KEY"],
  region: process.env["AWS_REGION"],
});

const S3 = new aws.S3();

var dist = "public/tempstorage";
var namearray = [];

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dist);
  },
  filename: function (req, file, cb) {
    var temp = dist + "/" + file.originalname;
    namearray.push(temp);

    cb(null, file.originalname);
  },
});

// uploadtoS3(temp);
var upload = multer({ storage: storage }).array("file");

router.post("/", function (req, res) {
  upload(req, res, function (err) {
    console.log(namearray);
    namearray.forEach((name) => {
      uploadtoS3(name);
    });

    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    namearray = [];
    return res.status(200).send(req.file);
  });
});

function uploadtoS3(temp) {
  console.log(temp);
  var filename = temp.split("/").pop();
  fs.readFile(temp, function (err, data) {
    if (err) throw err;
    console.log("file");

    S3.upload(
      {
        Bucket: process.env["AWS_BUCKET_NAME"],
        Body: data,
        Key: filename,
      },
      function (err, data) {
        fs.unlink(temp, function (err) {
          if (err) {
            console.error(err);
          }
          console.log("Temp File Delete");
        });
        console.log("PRINT FILE:", filename);
      }
    );
  });
}

// router.get("/", async function (req, res) {
//   const fileName = req.query.filename;

//   fs.readFile("public/tempstorage/1613015462029-45334.JPG", function (err, data) {
//     if (err) throw err;
//     console.log(fileName);

//     S3.upload(
//       {
//         Bucket: "dickytest",
//         Body: data,
//         Key: fileName,
//       },
//       function (err, data) {
//         fs.unlink(fileName, function (err) {
//           if (err) {
//             console.error(err);
//           }
//           //will delete
//           console.log("Temp File Delete");
//         });
//         console.log("PRINT FILE:", fileName);
//         if (err) {
//           console.log("ERROR MSG: ", err);
//           res.status(500).send(err);
//         } else {
//           console.log("Successfully uploaded data");
//           res.status(200).end();
//         }
//       }
//     );
//   }
//   )
// }
// )

module.exports = router;
