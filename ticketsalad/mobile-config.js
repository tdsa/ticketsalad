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

App.appendToConfig(`
  <splash src="../../../public/splash/Default@2x~universal~anyany.png"/>
`);

// Set up resources such as icons and launch screens.
/*App.icons({
  'iphone': 'resources/icons/icon-60x60.png',
  'iphone_2x': 'resources/icons/icon-60x60@2x.png',
  'ipad': 'resources/icons/icon-72x72.png',
  'ipad_2x': 'resources/icons/icon-72x72@2x.png',

  // Android
  'android_ldpi': 'resources/icons/icon-36x36.png',
  'android_mdpi': 'resources/icons/icon-48x48.png',
  'android_hdpi': 'resources/icons/icon-72x72.png',
  'android_xhdpi': 'resources/icons/icon-96x96.png'
});

App.launchScreens({
  'iphone_2x': 'splash/Default@2x~iphone.png',
  'iphone5': 'splash/Default~iphone5.png',
  // More screen sizes and platforms...
});*/

// Set PhoneGap/Cordova preferences.
App.setPreference('BackgroundColor', '0xff0000ff');
App.setPreference('HideKeyboardFormAccessoryBar', true);
App.setPreference('Orientation', 'default');
App.setPreference('Orientation', 'all', 'ios');
