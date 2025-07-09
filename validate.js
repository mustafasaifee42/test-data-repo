const fs = require('fs');


const content = fs.readFileSync('data.csv', 'utf8');
console.log(content)

process.exit(1);