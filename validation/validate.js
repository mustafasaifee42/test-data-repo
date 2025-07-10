const fs = require('fs');
const path = require('path');

const logDir = path.resolve(__dirname, 'log');
const logFile = path.join(logDir, 'validation.log');

function log(message) {
  fs.appendFileSync(logFile, message + '\n');
  console.error(message);
}

if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
const content = fs.readFileSync('data.csv', 'utf8');
console.log(content)

log('❌ Validation failed: Missing required field');

process.exit(1);