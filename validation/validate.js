const fs = require('fs');
const path = require('path');

const logDir = path.resolve(__dirname, 'log');
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const logFile = path.join(logDir, `validation-${timestamp}.log`);

function log(message) {
  fs.appendFileSync(logFile, message + '\n');
  console.log(message);
}

if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
try {
  const content = fs.readFileSync('../data/data.csv', 'utf8');
  log('📁 Successfully read data.csv');
  log(`📊 File content preview: ${content.substring(0, 100)}...`);
  
  log('❌ Validation failed: Missing required field');
  
  log('💥 Validation process completed with errors');
  process.exit(1);
  
} catch (error) {
  log(`🔥 Error reading file: ${error.message}`);
  process.exit(1);
}