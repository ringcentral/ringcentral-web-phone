
const $ = require('jquery');
global.scriptOwner = 'Jest Unit Test';
const {setRCWPLoggerCallBack, setRCWPLoggerEnabled, setRCWPLoggerLevel,
       rcWPLoge, rcWPLogw, rcWPLogi, rcWPLogd, 
       rcWPLogemd, rcWPLogwmd, rcWPLogimd, rcWPLogdmd, 
       rcWPLogeme, rcWPLogwme, rcWPLogime, rcWPLogdme} = require("../ringcentral-web-phone-logger");

test('rcWPLoge without label: General logger: Error Logger', () => {
  global.console = {
    warn: jest.fn(),
    log: jest.fn()
  }
  
  rcWPLoge('', 'rcLoge test');
  
  var prefix = [new Date(), 'WebPhone'];
  var label = '';
  if (label) {
    prefix.push(label);
  }
  var content = 'rcLoge test';
  content = ' ' + label + ' ' + content;
  content = prefix.concat(content).join(' | ');

  expect(global.console.log).toHaveBeenCalledWith(content);
});

test('rcWPLoge with label. Error Logger', () => {
  global.console = {
    warn: jest.fn(),
    log: jest.fn()
  }
  
  rcWPLoge('logeLabel', 'rcLoge test');
  
  var prefix = [new Date(), 'WebPhone'];
  var label = '';
  if (label) {
    prefix.push(label);
  }

  var content = 'rcLoge test';
  content = ' ' + 'logeLabel' + ' ' + content;
  content = prefix.concat(content).join(' | ');
  expect(global.console.log).toHaveBeenCalledWith(content);
});


test('rcWPLoge with 300 characters. Error Logger', () => {
  global.console = {
    warn: jest.fn(),
    log: jest.fn()
  }
  
  var longStr = '';
  for (i = 0; i < 30; i++) {
    longStr += '1234567890';
  }
  rcWPLoge('logeLabel', longStr);
  
  var prefix = [new Date(), 'WebPhone'];
  var label = '';
  if (label) {
    prefix.push(label);
  }

  var content = longStr;
  content = ' ' + 'logeLabel' + ' ' + content;
  content = prefix.concat(content).join(' | ');
  expect(global.console.log).toHaveBeenCalledWith(content);
});

test('rcWPLogw with label. Warning Logger.', () => {
  global.console = {
    warn: jest.fn(),
    log: jest.fn()
  }
  
  rcWPLogw('logwLabel', 'rcLogw test');
  
  var prefix = [new Date(), 'WebPhone'];
  var label = '';
  if (label) {
    prefix.push(label);
  }

  var content = 'rcLogw test';
  content = ' ' + 'logwLabel' + ' ' + content;
  content = prefix.concat(content).join(' | ');
  expect(global.console.log).toHaveBeenCalledWith(content);
});

test('rcWPLogi with label. Info Logger.', () => {
  global.console = {
    warn: jest.fn(),
    log: jest.fn()
  }
  
  rcWPLogi('logiLabel', 'rcLogi test');
  
  var prefix = [new Date(), 'WebPhone'];
  var label = '';
  if (label) {
    prefix.push(label);
  }

  var content = 'rcLogi test';
  content = ' ' + 'logiLabel' + ' ' + content;
  content = prefix.concat(content).join(' | ');
  expect(global.console.log).toHaveBeenCalledWith(content);
});

test('rcWPLogd with label. Debug Logger.', () => {
  global.console = {
    warn: jest.fn(),
    log: jest.fn()
  }
  
  rcWPLogd('label', 'rcLogd test');
  
  var prefix = [new Date(), 'WebPhone'];
  var label = '';
  if (label) {
    prefix.push(label);
  }
  var content = 'rcLogd test';
  content = ' ' + 'label' + ' ' + content;
  content = prefix.concat(content).join(' | ');

  expect(global.console.log).toHaveBeenCalledWith(content);
});

test('rcWPLogeme: Media Engine Media: Error Logger.', () => {
  global.console = {
    warn: jest.fn(),
    log: jest.fn()
  }
  
  rcWPLogeme('rcLogeme test');
  
  var prefix = [new Date(), 'MediaEngine'];
  var label = 'media';
  if (label) {
    prefix.push(label);
  }
  var content = 'rcLogeme test';
  content = prefix.concat(content).join(' | ');

  expect(global.console.log).toHaveBeenCalledWith(content);
});

test('rcWPLogwme: Media Engine Media: Warning Logger.', () => {
  global.console = {
    warn: jest.fn(),
    log: jest.fn()
  }
  
  rcWPLogwme('rcLogwme test');
  
  var prefix = [new Date(), 'MediaEngine'];
  var label = 'media';
  if (label) {
    prefix.push(label);
  }
  var content = 'rcLogwme test';
  content = prefix.concat(content).join(' | ');

  expect(global.console.log).toHaveBeenCalledWith(content);
});

test('rcWPLogime: Media Engine Media: Info Logger.', () => {
  global.console = {
    warn: jest.fn(),
    log: jest.fn()
  }
  
  rcWPLogime('rcLogime test');
  
  var prefix = [new Date(), 'MediaEngine'];
  var label = 'media';
  if (label) {
    prefix.push(label);
  }
  var content = 'rcLogime test';
  content = prefix.concat(content).join(' | ');

  expect(global.console.log).toHaveBeenCalledWith(content);
});

test('rcWPLogdme: Media Engine Media: debug Logger.', () => {
  global.console = {
    warn: jest.fn(),
    log: jest.fn()
  }
  
  rcWPLogdme('rcLogdme test');
  
  var prefix = [new Date(), 'MediaEngine'];
  var label = 'media';
  if (label) {
    prefix.push(label);
  }
  var content = 'rcLogdme test';
  content = prefix.concat(content).join(' | ');

  expect(global.console.log).toHaveBeenCalledWith(content);
});

test('rcWPLogemd: Media Engine Device: Error Logger.', () => {
  global.console = {
    warn: jest.fn(),
    log: jest.fn()
  }
  
  rcWPLogemd('rcLogemd test');
  
  var prefix = [new Date(), 'MediaEngine'];
  var label = 'device';
  if (label) {
    prefix.push(label);
  }
  var content = 'rcLogemd test';
  content = prefix.concat(content).join(' | ');

  expect(global.console.log).toHaveBeenCalledWith(content);
});

test('rcWPLogwmd: Media Engine Device: Warning Logger.', () => {
  global.console = {
    warn: jest.fn(),
    log: jest.fn()
  }
  
  rcWPLogwmd('rcLogwmd test');
  
  var prefix = [new Date(), 'MediaEngine'];
  var label = 'device';
  if (label) {
    prefix.push(label);
  }
  var content = 'rcLogwmd test';
  content = prefix.concat(content).join(' | ');

  expect(global.console.log).toHaveBeenCalledWith(content);
});

test('rcWPLogimd: Media Engine Device: Info Logger.', () => {
  global.console = {
    warn: jest.fn(),
    log: jest.fn()
  }
  
  rcWPLogimd('rcLogimd test');
  
  var prefix = [new Date(), 'MediaEngine'];
  var label = 'device';
  if (label) {
    prefix.push(label);
  }
  var content = 'rcLogimd test';
  content = prefix.concat(content).join(' | ');

  expect(global.console.log).toHaveBeenCalledWith(content);
});

test('rcWPLogdmd: Media Engine Device: Debug Logger.', () => {
  global.console = {
    warn: jest.fn(),
    log: jest.fn()
  }
  
  rcWPLogdmd('rcLogdmd test');
  
  var prefix = [new Date(), 'MediaEngine'];
  var label = 'device';
  if (label) {
    prefix.push(label);
  }
  var content = 'rcLogdmd test';
  content = prefix.concat(content).join(' | ');

  expect(global.console.log).toHaveBeenCalledWith(content);
});

test('setRCWPLoggerCallBack: Hook webphone logger to the application', () => {
  global.console = {
    warn: jest.fn(),
    log: jest.fn()
  }

  var content = 'rcLogd test';
  targetName = 'debug';
  label = '';
  date = new Date();

  this.hooker = function(date, targetName, category, label, content) {
    if (typeof content === 'string') {
      var prefix = [date, category];
      if (label) {
        prefix.push(label);
      }
      content = prefix.concat(content).join(' | ');
    }
    expect(global.console.log).toHaveBeenCalledWith(content);
    return content;
  }

  setRCWPLoggerCallBack(this.hooker);
  rcWPLogd('', 'rcLogd test');  
});


test('setRCWPLoggerEnabled: enabled = false then true', () => {
  global.console = {
    warn: jest.fn(),
    log: jest.fn()
  }
  
  setRCWPLoggerCallBack(null);
  var enabled = false;
  setRCWPLoggerEnabled(enabled);
  rcWPLogdmd('rcLogdmd test');
  expect(global.console.log).not.toHaveBeenCalled();

  var enabled = true;
  setRCWPLoggerEnabled(enabled);

  (function(){
    rcWPLogimd('rcLogimd test');
  
    var prefix = [new Date(), 'MediaEngine'];
    var label = 'device';
    if (label) {
      prefix.push(label);
    }
    var content = 'rcLogimd test';
    content = prefix.concat(content).join(' | ');
  
    expect(global.console.log).toHaveBeenCalledWith(content);
  })();

});

test('setRCWPLoggerLevel: level = "error" ', () => {
  global.console = {
    warn: jest.fn(),
    log: jest.fn()
  }
  
  setRCWPLoggerCallBack(null);
  var enabled = true;
  setRCWPLoggerEnabled(enabled);
  setRCWPLoggerLevel('error');
  rcWPLogwmd('rcLogdmd test');
  rcWPLogimd('rcLogdmd test');
  rcWPLogdmd('rcLogdmd test');
  expect(global.console.log).not.toHaveBeenCalled();

  (function(){
    rcWPLogemd('test level');
  
    var prefix = [new Date(), 'MediaEngine'];
    var label = 'device';
    if (label) {
      prefix.push(label);
    }
    var content = 'test level';
    content = prefix.concat(content).join(' | ');
  
    expect(global.console.log).toHaveBeenCalledWith(content);
  })();
});

test('setRCWPLoggerLevel: level = "warn" ', () => {
  global.console = {
    warn: jest.fn(),
    log: jest.fn()
  }
  
  setRCWPLoggerCallBack(null);
  var enabled = true;
  setRCWPLoggerEnabled(enabled);
  setRCWPLoggerLevel('warn');
  rcWPLogimd('rcLogdmd test');
  rcWPLogdmd('rcLogdmd test');
  expect(global.console.log).not.toHaveBeenCalled();

  (function(){
    rcWPLogwmd('test level');
  
    var prefix = [new Date(), 'MediaEngine'];
    var label = 'device';
    if (label) {
      prefix.push(label);
    }
    var content = 'test level';
    content = prefix.concat(content).join(' | ');
  
    expect(global.console.log).toHaveBeenCalledWith(content);
  })();
});

test('setRCWPLoggerLevel: level = "info" ', () => {
  global.console = {
    warn: jest.fn(),
    log: jest.fn()
  }
  
  setRCWPLoggerCallBack(null);
  var enabled = true;
  setRCWPLoggerEnabled(enabled);
  setRCWPLoggerLevel('info');
  rcWPLogdmd('rcLogdmd test');
  expect(global.console.log).not.toHaveBeenCalled();

  (function(){
    rcWPLogimd('test level');
  
    var prefix = [new Date(), 'MediaEngine'];
    var label = 'device';
    if (label) {
      prefix.push(label);
    }
    var content = 'test level';
    content = prefix.concat(content).join(' | ');
  
    expect(global.console.log).toHaveBeenCalledWith(content);
  })();
});

test('setRCWPLoggerLevel: level = "debug" ', () => {
  global.console = {
    warn: jest.fn(),
    log: jest.fn()
  }
  
  setRCWPLoggerCallBack(null);
  var enabled = true;
  setRCWPLoggerEnabled(enabled);
  setRCWPLoggerLevel('debug');

  (function(){
    rcWPLogdmd('test level');
  
    var prefix = [new Date(), 'MediaEngine'];
    var label = 'device';
    if (label) {
      prefix.push(label);
    }
    var content = 'test level';
    content = prefix.concat(content).join(' | ');
  
    expect(global.console.log).toHaveBeenCalledWith(content);
  })();
});