var storage = chrome.storage.sync;

var MILLISECONDS_IN_HOUR = 3600000;
var TimePeriod = Object.freeze({
  "LAST_HOUR": 0,
  "LAST_DAY": 1,
  "LAST_WEEK": 2,
  "FOUR_WEEKS": 3,
  "EVERYTHING": 4
});

var frames = [
  "images/icon-19-frame1.png",
  "images/icon-19-frame2.png",
  "images/icon-19-frame3.png",
  "images/icon-19-frame4.png"
];

var animator = new IconAnimator(frames, 500);

chrome.browserAction.onClicked.addListener(function(tab) {
  animator.run();
  storage.get(null, function(options) {
    if (chrome.runtime.lastError) {
      chrome.browserAction.setTitle({"title": chrome.runtime.lastError});
      chrome.browserAction.setIcon({"path": "images/icon-19-error.png"});
    } else {
      chrome.browserAction.setTitle({"title": "Shed"});
      var currentTime = Date.now();
      var removalOptions = {};
      var dataToRemove = {};

      var timePeriodValue = parseInt(options.time_period);
      switch (timePeriodValue) {
        case TimePeriod.LAST_HOUR:
          removalOptions.since = currentTime - MILLISECONDS_IN_HOUR;
          break;
        case TimePeriod.LAST_DAY:
          removalOptions.since = currentTime - MILLISECONDS_IN_HOUR * 24;
          break;
        case TimePeriod.LAST_WEEK:
          removalOptions.since = currentTime - MILLISECONDS_IN_HOUR * 24 * 7;
          break;
        case TimePeriod.FOUR_WEEKS:
          removalOptions.since = currentTime - MILLISECONDS_IN_HOUR * 24 * 7 * 4;
          break;
        case TimePeriod.EVERYTHING:
          removalOptions.since = 0;
          break;
      }

      removalOptions.originTypes = {
        "unprotectedWeb": true,
        "protectedWeb": false,
        "extension": false
      };

      dataToRemove = {
        "appcache": false,
        "cache": false,
        "cookies": false,
        "downloads": false,
        "fileSystems": false,
        "formData": false,
        "history": false,
        "indexedDB": false,
        "localStorage": false,
        "serverBoundCertificates": false,
        "passwords": false,
        "pluginData": false,
        "serviceWorkers": false,
        "webSQL": false
      };

      if (options.browsing_history) {
        dataToRemove.history = true;
      }
      if (options.download_history) {
        dataToRemove.downloads = true;
      }
      if (options.cache) {
        dataToRemove.cache = true;
      }
      if (options.cookies) {
        dataToRemove.appcache = true;
        dataToRemove.cache = true;
        dataToRemove.cookies = true;
        dataToRemove.fileSystems = true;
        dataToRemove.indexedDB = true;
        dataToRemove.localStorage = true;
        dataToRemove.pluginData = true;
        dataToRemove.serviceWorkers = true;
        dataToRemove.webSQL = true;
        removalOptions.originTypes.unprotectedWeb = true;
      }
      if (options.passwords) {
        dataToRemove.passwords = true;
      }
      if (options.form_data) {
        dataToRemove.formData = true;
      }
      if (options.hosted_apps_data) {
        dataToRemove.appcache = true;
        dataToRemove.cache = true;
        dataToRemove.cookies = true;
        dataToRemove.fileSystems = true;
        dataToRemove.indexedDB = true;
        dataToRemove.localStorage = true;
        dataToRemove.pluginData = true;
        dataToRemove.serviceWorkers = true;
        dataToRemove.webSQL = true;
        removalOptions.originTypes.protectedWeb = true;
      }
      chrome.browsingData.remove(removalOptions, dataToRemove, function() {
        animator.finish();
      }); 
    }
  });
});
