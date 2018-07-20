//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
// Source maps are supported by all recent versions of Chrome, Safari,  //
// and Firefox, and by Internet Explorer 11.                            //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;

(function(){

///////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                           //
// packages/angular-templates/templates-handler.js                                           //
//                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////
                                                                                             //
if (!window.angular) {
  try {
    if (Package['modules-runtime']) {
      var require = Package['modules-runtime'].meteorInstall();
      require('angular');
    }
  } catch(e) {
    throw new Error('angular package is missing');
  }
}

angular.module('angular-templates', []).config([
  '$provide',
  function ($provide) {
    var templatesFileExtension = ['html', 'tpl', 'tmpl', 'template', 'view'];

    $provide.decorator('$templateCache', ['$delegate', '$angularTemplatesSettings',
      function($delegate, $angularTemplatesSettings) {
        var originalGet = $delegate.get;

        $delegate.get = function(templatePath) {
          var originalResult = originalGet(templatePath);

          if (angular.isUndefined(originalResult)) {
            var fileExtension = ((templatePath.split('.') || []).pop() || '').toLowerCase();

            if (templatesFileExtension.indexOf(fileExtension) > -1) {
              function getMsg(type) {
                return '[angular-meteor][err][404] ' + templatePath + ' - HTML template does not exists! You can disable this ' + type + ' by following this guide http://www.angular-meteor.com/api/1.3.11/templates';
              }

              if ($angularTemplatesSettings.error === true) {
                throw new Error(getMsg('error'));
              } else if ($angularTemplatesSettings.warning === true) {
                console.warn(getMsg('warning'));
              }
            }
          }

          return originalResult;
        };

        return $delegate;
    }]);
  }
]).constant('$angularTemplatesSettings', {
  error: true,
  warning: true
});;

///////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
Package._define("angular-templates");

})();
