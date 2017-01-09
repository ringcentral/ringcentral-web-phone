(function() {

    var fs = require('fs');
    var pkg = require('./package.json');
    var version = require('./src/ringcentral-web-phone').version;

    pkg.version = version;

    fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2));

    console.log('Current version is', version);

})();