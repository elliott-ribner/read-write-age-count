const https = require("https");
const fs = require("fs");
const os = require("os");
const crypto = require("crypto");

https.get("https://coderbyte.com/api/challenges/json/age-counting", (resp) => {
  let data = "";
  resp.on("data", (chunk) => {
    data += chunk;
  });

  let writeStream = fs.createWriteStream("output.txt");

  resp.on("end", () => {
    let jsonResp = JSON.parse(data);
    const keyAgeArr = jsonResp.data
      .split(",")
      .map((elem) => elem.trim().substring(4));
    let i = 0;
    while (i < keyAgeArr.length) {
      const ageString = keyAgeArr[i + 1];
      if (ageString === "32") {
        const keyString = keyAgeArr[i];
        writeStream.write(keyString + os.EOL);
      }
      i = i + 2;
    }
    writeStream.end(() => {
      fs.readFile("output.txt", function (err, data) {
        const res = crypto.createHash("sha1").update(data).digest("hex");
        console.log(res);
      });
    });
  });
});
