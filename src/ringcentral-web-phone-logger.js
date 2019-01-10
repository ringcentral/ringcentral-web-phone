
(function(root, loggerFactory) {
  
  root.rcWPLoggerFactory = loggerFactory();
  root.rcWPLogger = root.rcWPLoggerFactory.getLogger('WebPhone', '');
  root.rcWPLoggerme = root.rcWPLoggerFactory.getLogger('MediaEngine', 'media');
  root.rcWPLoggermd = root.rcWPLoggerFactory.getLogger('MediaEngine', 'device');

  root.setRCWPLoggerCallBack = function(callback) {
    //callback = function(date, targetName, category, label, content);
    root.rcWPLoggerFactory.setConnector (callback);
  }

  root.setRCWPLoggerEnabled = function(enabled) {
    root.rcWPLoggerFactory.setEnable(enabled); 
  }

  root.setRCWPLoggerLevel = function(level) {
    root.rcWPLoggerFactory.setLevel(level);
  }

  root.configRCWPLogger = function(config) {
    if (typeof config !== 'undefined' && config.hasOwnProperty('connector')) {
      root.setRCWPLoggerCallBack(config['connector']);
    }
    if (typeof config !== 'undefined' && config.hasOwnProperty('enabled')) {
      root.setRCWPLoggerEnabled(config['enabled']);
    }
    if (typeof config !== 'undefined' && config.hasOwnProperty('level')) {
      root.setRCWPLoggerLevel(config['level']);
    }
    return config;
  } 

  root.rcWPLoggerConfig = function() {
    var config = {'connector': root.rcWPLoggerFactory.connector,
                  'enabled': root.rcWPLoggerFactory.enabled,
                  'level': root.rcWPLoggerFactory.level};
    return config;
  }

  root.rcWPSIPConnector = function (targetName, category, label, content) {
    if (typeof root.rcWPLoggerFactory.connector !== 'undefined' && root.rcWPLoggerFactory.connector) {
      root.rcWPLoggerFactory.connector(new Date(), targetName, category, label, content);
    }
  }

  //general logger
  root.rcWPLoge = function (label, content) {
    root.rcWPLogger.error(`${label} ${content}`);
  } 

  root.rcWPLogw = function (label, content) {
    root.rcWPLogger.warn(`${label} ${content}`);
  } 
  
  root.rcWPLogi = function (label, content) {
    root.rcWPLogger.info(`${label} ${content}`);
  } 

  root.rcWPLogd = function (label, content) {
    root.rcWPLogger.debug(`${label} ${content}`);
  } 

  //MediaEngine Media Logger
  root.rcWPLogeme = function(content) {
    root.rcWPLoggerme.error(content);   
  }

  root.rcWPLogwme = function(content) {
    root.rcWPLoggerme.warn(content);   
  }

  root.rcWPLogime = function(content) {
    root.rcWPLoggerme.info(content);   
  }

  root.rcWPLogdme = function(content) {
    root.rcWPLoggerme.debug(content);   
  }
  

  //MediaEngine Device Logger
  root.rcWPLogemd = function(content) {
    root.rcWPLoggermd.error(content);   
  }
  
  root.rcWPLogwmd = function(content) {
    root.rcWPLoggermd.warn(content);   
  }
  
  root.rcWPLogimd = function(content) {
    root.rcWPLoggermd.info(content);   
  }
  
  root.rcWPLogdmd = function(content) {
    root.rcWPLoggermd.debug(content);   
  }
  
}(this, function() {

  function RCLoggerFactory () {

    var levels = {
      'error': 0,
      'warn': 1,
      'info': 2,
      'debug': 3
    }

    this.loggers = {};
    this.level = 3;
    this.enabled = true;
    this.connector = null;

    function Logger(logger, category, label) {
      this.logger = logger;
      this.category = category;
      this.label = label;
    }

    RCLoggerFactory.prototype.setEnable = function (value) {
      if (typeof value === 'boolean') {
        this.enabled = value;
      } else {
        this.print('error', 'webphone', 'logger', 'invalid "enabled" parameter value: ' + JSON.stringify(value));
      }
    }

    RCLoggerFactory.prototype.setLevel = function(value) {
      if (value >= 0 && value <= 3) {
        this.level = value;
      } else if (value > 3) {
        this.level = 3;
      } else if (levels.hasOwnProperty(value)) {
        this.level = levels[value];
      } else {
        this.print('error', 'webphone', 'logger', 'invalid "level" parameter value: ' + JSON.stringify(value));
      }
    }
    
    RCLoggerFactory.prototype.setConnector = function(value) {
      if (!value || value === "" || value === undefined) {
        this.connector = null;
      } else if (typeof value === 'function') {
        this.connector = value;
      } else {
        this.print('error', 'webphone', 'logger', 'invalid "connector" parameter value: ' + JSON.stringify(value));
      }
    }

    RCLoggerFactory.prototype.print = function (target, category, label, content) {
      if (typeof content === 'string') {
        var prefix = [new Date(), category];
        if (label) {
          prefix.push(label);
        }
        content = prefix.concat(content).join(' | ');
      }
      console.log(content);
    }

    Object.keys(levels).forEach(function (targetName) {
      Logger.prototype[targetName] = function (content) {
          this.logger[targetName](this.category, this.label, content);
      };
      RCLoggerFactory.prototype[targetName] = function (category, label, content) {
          if (this.level >= levels[targetName]) {
              if (this.enabled) {
                  this.print(console[targetName], category, label, content);
              }
              if (this.connector) {
                  var date = new Date();
                  this.connector(date, targetName, category, label, content);
              }
          }
      };
    });

    RCLoggerFactory.prototype.getLogger = function (category, label) {
      if (label && this.level === 3) {
          return new Logger(this, category, label);
      } else if (this.loggers[category]) {
          return this.loggers[category];
      } else {
          var logger = new Logger(this, category);
          this.loggers[category] = logger;
          return logger;
      }
    };

  }

  return new RCLoggerFactory();
}))
