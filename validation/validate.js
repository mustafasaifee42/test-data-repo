const { validateData, parseCsvString } = require('@undp-data/data-utils');
const fs = require('fs');
const path = require('path');


const dataDir = path.resolve(__dirname, '../data');
const schemaDir = path.resolve(__dirname, '../schema');
const logPath = path.resolve(__dirname, '../validation.log');

const allowedExtensions = ['.csv', '.xlsx', '.json', '.xls'];

const files = fs.readdirSync(dataDir);

let invalidFiles = [];
let validFiles = [];


console.log('');
console.log('---');
console.log('');
console.log('Validation all data files');

files.filter(file => {
  const ext = path.extname(file).toLowerCase();
  return allowedExtensions.includes(ext);
}).forEach(file => {
  
  const filePath = path.join(dataDir, file);
  const fileNameWithoutExt = path.basename(file, path.extname(file));
  const fileWithJsonExt = path.format({
    name: fileNameWithoutExt,
    ext: '.json',
  });

  const schemaPath = path.join(schemaDir, fileWithJsonExt);
    
  console.log('');
  console.log(`📊 Validating ${file}`);
  if (fs.existsSync(schemaPath)) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
      const validationErrors = validateData(parseCsvString(content), schema);
      if(validationErrors.length !== 0) {
        console.log('');
        console.log(`❌ ${file} failed validation. Total ${validationErrors.length} errors:`);
        validationErrors.forEach((el,i) => {
          console.log(`Error ${i + 1}: ${JSON.stringify(el)}`)
        });
        console.log('');
        invalidFiles.push({file, err: validationErrors});
      } else {
        console.log('');
        console.log(`✅ ${file} is valid!`);
        validFiles.push(file);
        console.log('');
      }      
    } catch (error) {
      console.log('');
      console.log(`🔥 Error reading file ${filePath}: ${error.message}`);
      console.log('');
      invalidFiles.push({file, err: error.message});
      process.exit(1);

    }
  } else {
    console.log('');
    console.log(`🔥 Schema file does not exist for ${file}. No validation required.`);
    validFiles.push(file);
    console.log('');
  }
});

if(invalidFiles.length > 0) {
  console.log('');
  console.log(`❌ Following files failed validation:`);
  invalidFiles.forEach(d => { console.log(d); });
  console.log('');
  console.log('---');
  console.log('');
  const formattedDate = new Date().toLocaleString();
  const logContent = `Updated on: ${formattedDate} UTC
Status: ❌ Validation failed. Files reverted to their previous valid version.

---

🚩 Files with issues (${invalidFiles.length})

${invalidFiles.map(d => `📄 ${d.file}
${d.err.map(e => (`Row: ${e.index + 1} | Column: ${e.column} | ⚠️ Error: ${e.error}
`).join('\n'))}
`).join('\n')}

---

`;
  fs.writeFileSync(logPath, logContent, 'utf8');
  console.log('---');
  console.log('');
  console.log(`✅ validation.log updated at ${formattedDate}`);
  console.log('');
  process.exit(1);
}

console.log('');
console.log(`🎉 All files are valid`);
console.log('');
console.log('---');
console.log('');
const formattedDate = new Date().toLocaleString();
const logContent = `Updated on: ${formattedDate} UTC
Status: ✅ Validation Successful.
`;
fs.writeFileSync(logPath, logContent, 'utf8');
console.log('---');
console.log('');
console.log(`✅ validation.log updated at ${formattedDate}`);
console.log('');
process.exit(0);