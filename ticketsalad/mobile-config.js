// This section sets up some basic app metadata, the entire section is optional.
App.info({
  id: 'com.hackermen.ticketsalad',
  name: 'Ticket Salad',
  description: 'Your way to the world!',
  author: 'Hackermen',
  email: 'tristan.jules@gmail.com',
  website: 'http://www.ticketsalad.com'
});

// Configure cordova file plugin
App.configurePlugin('cordova-plugin-file', {
    iosPersistentFileLocation: 'Library'
});

// Set up resources such as icons and launch screens.
/*App.icons({
  'iphone_2x': 'icons/icon-60@2x.png',
  'iphone_3x': 'icons/icon-60@3x.png',
  // More screen sizes and platforms...
});

App.launchScreens({
  'iphone_2x': 'splash/Default@2x~iphone.png',
  'iphone5': 'splash/Default~iphone5.png',
  // More screen sizes and platforms...
});

// Set PhoneGap/Cordova preferences.
App.setPreference('BackgroundColor', '0xff0000ff');
App.setPreference('HideKeyboardFormAccessoryBar', true);
App.setPreference('Orientation', 'default');
App.setPreference('Orientation', 'all', 'ios');*/
