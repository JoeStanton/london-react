export default class Parse {
  static async registerInstallation(deviceToken) {
    let payload = {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Parse-Application-Id': process.env.PARSE_APP_ID,
        'X-Parse-REST-API-Key': process.env.PARSE_APP_KEY
      },
      body: JSON.stringify({
        'appName': 'London React',
        'appVersion': process.env.VERSION,
        'deviceType': 'ios',
        'deviceToken': deviceToken
      })
    };

    let response = await fetch('https://api.parse.com/1/installations', payload);
    let json = await response.json();

    if (response.ok) {
      return json;
    } else {
      throw new Error(json.error);
    }
  }
}
