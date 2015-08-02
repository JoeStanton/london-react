export default class Bugsnag {
  static notify(error) {
    fetch('https://notify.bugsnag.com/', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this._build(error))
    }).then(console.log).catch(console.log);
  }
  static _build(error) {
    return {
      apiKey: process.env.BUGSNAG_KEY,
      notifier: {
        name: 'React Native',
        version: '1.0.11',
        url: 'https://github.com/bugsnag/bugsnag-ruby'
      },
      events: [{
        payloadVersion: '2',
        exceptions: [{
          errorClass: error.constructor.name || error.name || 'Error',
          message: error.message,
          stacktrace: this._processStackTrace(error)
        }],
        context: 'auth/session#create',
        severity: 'error',
        user: {
          id: '19',
          name: 'Simon Maynard',
          email: 'simon@bugsnag.com'
        },
        app: {
          version: '1.1.3',
          releaseStage: 'production',
        },

        device: {
          osVersion: '2.1.1',
          hostname: 'web1.internal'
        },

        metaData: {
          someData: {
            key: 'value',
            setOfKeys: {
              key: 'value',
              key2: 'value'
            }
          },
        }
      }]
    };
  }
  static _processStackTrace(error) {
    return [{
      file: 'controllers/auth/session_controller.rb',
      lineNumber: 1234,
      columnNumber: 123,
      method: 'create',
      inProject: true,
    }];

    let blah = stacktrace.parse(error);
    return callSites.map(function(callSite) {
      return {
         file: callSite.getFileName(),
         method: callSite.getMethodName() || callSite.getFunctionName() || 'none',
         lineNumber: callSite.getLineNumber(),
         columnNumber: callSite.getColumnNumber()
      };
    });
  }
}
