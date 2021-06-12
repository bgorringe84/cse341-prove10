const fs = require('fs');

const deleteFile = (filepath) => {
   fs.unlink(filePath, (err) => {
      if (err) {
         throw (err);
      }
   });
}

exports.deleteFile = deleteFile;