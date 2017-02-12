(function() {
  "use strict";

  var CONTAINERS_URL = "/api/containers/";
  var FILE_MODE_BITS = parseInt("0664", 8);
  var uuid = require("uuid");

  module.exports = function (Artwork) {
    Artwork.oldUpload = function oldUpload(req, cb) {
      var fileName = uuid.v1();
      var container = "common";
      var model = {
        uuid: fileName,
        filename: fileName + ".png",
        container: container,
        url: CONTAINERS_URL + "common/download/" + fileName + ".png",
        type: "image/png",
        title: fileName,
        width: -1,
        height: -1
      };
      var options = {
        container: container,
        encoding: "utf8",
        remote: fileName + ".png",
        mode: FILE_MODE_BITS,
        flags: "w+"
      };

      /** @param {WriteStream} */
      var streamOut = Artwork.app.models.Container.uploadStream(
        container, fileName + ".png", options,
        function (err, fileObj) {
          if (err) {
            cb(err);
          } else {
            var fileInfo = fileObj.files.file[0];
            var newModel = Object.assign({}, fileInfo, model);

            newModel.url =
              CONTAINERS_URL + fileInfo.container +
              "/download/" + fileInfo.name;

            Artwork.create(newModel, cb);
          }
        }
      );

      req.pipe(streamOut);

      console.log("Got a write stream!?:");
      console.log(JSON.stringify(streamOut));
      console.log("", streamOut);

      return model;
    };

    Artwork.upload = function (req, title, imageChainId, data, cb) {
      var fileName = uuid.v1();
      var container = "common";
      var model = {
        uuid: fileName,
        filename: fileName + ".png",
        container: container,
        url: CONTAINERS_URL + "common/" + fileName + ".png",
        type: "image/png",
        title: title,
        imageChainId: imageChainId,
        owner: req.accessToken.userId
      };
      var options = {
        container: container,
        encoding: "base64",
        remote: fileName + ".png",
        mode: FILE_MODE_BITS,
        flags: "w+"
      };

      var streamOut =
        Artwork.app.models.Container.uploadStream(
          container, fileName + ".png", options);

      streamOut.once(
        "finish",
        function (err, fileObj) {
          if (err) {
            cb(err);
          } else {
            console.log(
              "Successfully wrote file output for " + JSON.stringify(model) +
              ".  Options were " + JSON.stringify(options)
            );
            Artwork.create(model, cb);
          }
        }
      );

      const maxRepeatFail = 3;
      const dataSize = data.length;
      const writeUnit = 1024;

      var failCount = 0;
      var currentIndex = 0;
      var nextIndex = Math.min(dataSize, writeUnit);
      var writeMessage;

      function doSomeWrites() {
        writeMessage = data.substring(currentIndex, nextIndex);
        while ((currentIndex < dataSize) && streamOut.write(writeMessage)) {
          writeMessage = data.substring(currentIndex, nextIndex);
          currentIndex = nextIndex;
          nextIndex = Math.min(nextIndex + writeUnit, dataSize);
          failCount = 0;
        }

        if (currentIndex < dataSize) {
          if (failCount >= maxRepeatFail) {
            var errorMessage =
              "Failed to write data body of size " + data.length +
              " for " + JSON.stringify(model) +
              ".  Options were " + JSON.stringify(options);
            console.error(errorMessage);
            cb(errorMessage);
          } else {
            failCount += 1;
            streamOut.once("drain", doSomeWrites);
          }
        } else {
          streamOut.end(function (err, data) {
            console.log("Finished writing data and closed writeStream.");
          });
        }
      }

      doSomeWrites();
    };


    Artwork.remoteMethod(
      "oldUpload",
      {
        description: "Uploads a file",
        accepts: [
          {arg: "context", type: "object", http: {source: "context"}},
          {arg: "req", type: "object", http: {source: "req"}},
          {arg: "data", type: "string", http: {source: "body"}}
        ],
        returns: {
          arg: "artStub", type: "object", root: true
        },
        http: {verb: "post"}
      }
    );

    Artwork.remoteMethod(
      "upload",
      {
        description: "Uploads a file",
        accepts: [
          {arg: "req", type: "object", http: {source: "req"}},
          {arg: "title", type: "string", http: {source: "form"}},
          {arg: "imageChainId", type: "string", http: {source: "form"}},
          {arg: "data", type: "string", http: {source: "form"}}
        ],
        returns: {type: "object", root: true},
        http: {verb: "post"}
      }
    );
  };
}).call();
