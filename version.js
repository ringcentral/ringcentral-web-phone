const fs = require('fs');
const pkg = require('./package.json');
const version = require('./dist/index').version;

pkg.version = version;

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');

console.log('Current version is', version);
