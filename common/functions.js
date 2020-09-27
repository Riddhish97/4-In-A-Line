//class for common function
var _this;
let ObjectId = require('mongoose').Types.ObjectId;
class commonFunctions {
	/**
	 * constructor
	 */
	constructor() {
		_this = this;
	}

	fileLogs(logName) {
		return require('simple-node-logger').createRollingFileLogger({
			logDirectory: 'logs',
			fileNamePattern: logName + '_<DATE>.log',
			dateFormat: 'YYYY_MM_DD',
			timestampFormat: 'YYYY-MM-DD HH:mm:ss'
		});
	}
};

module.exports = commonFunctions;