/**
 * Plugin core
 */

const log = require('fancy-log');
const through2 = require('through2');

const FtpClient = require('./client')
const PLUGIN_NAME = 'gulp-deploy-ftp';

/**
 * @param {string} remotePath: Remote path
 * @param {string} host: Ftp server host
 * @param {int} port: Ftp server port
 * @param {string} user: Ftp login user
 * @param {string} pass: Ftp login password
 */
const gulpDeployFtp = (remotePath='', host='localhost', port=21, user='', pass='') => {
  if (!remotePath.length) {
    log.error(PLUGIN_NAME, 'remotePath must be setted');
    throw;
  }

  return through2.obj(
    // Transform function.
    (file, enc, cb) => {
      if (!file.isBuffer() && !file.isStream()) {
        log.error(`${PLUGIN_NAME} Unsupported file type`);
        throw;
      }

      remotePath = `${remotePath}/${file.basename}`
      let _cli = new FtpClient(remotePath, host, port, user, pass);

      _cli.upload(file.contents).then((rst) => {
        log.info(`${PLUGIN_NAME} ${rst}`);
        cb(null, file)
      }).catch((err) => {
        log.error(`${PLUGIN_NAME} ${err}`);
        throw;
      })
    }
  );
};

// Exporting the plugin main function
module.exports = gulpDeployFtp;
