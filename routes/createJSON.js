var fs = require("fs");

var outputFilename = "list111.json";

let createJSON = function (myData) {
  var jsonFromAWS = JSON.stringify(myData, "Key", 6);

  var new111 = JSON.parse(jsonFromAWS).Contents;

  var keys = [];
  for (var k in jsonFromAWS) {
    if (k == "Contents") keys.p
    console.log(keys);
  }

    jsonFromAWS.array.forEach((element) => {});

  fs.writeFile(
    outputFilename,
    JSON.stringify(new111, "FileName", 3),
    function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("JSON saved to " + outputFilename);
      }
    }
  );

  return new111;
};

module.exports = createJSON;
