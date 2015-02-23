function $(id) {
  return document.getElementById(id);
}

var storage = chrome.storage.sync;

function load_options() {
  storage.get(null, function(options) {
    if (chrome.runtime.lastError) {
      $("message").textContent = chrome.runtime.lastError;
    } else {
      $("time-period").value = options.time_period;
      $("browsing-history").checked = options.browsing_history;
      $("download-history").checked = options.download_history;
      $("cache").checked = options.cache;
      $("cookies").checked = options.coookies;
      $("passwords").checked = options.passwords;
      $("form-data").checked = options.form_data;
      $("hosted-apps-data").checked = options.hosted_apps_data;
    }
  });
}

function save_options() {
  var options = {};
  options.time_period = $("time-period").value;
  options.browsing_history = $("browsing-history").checked;
  options.download_history = $("download-history").checked;
  options.cache = $("cache").checked;
  options.coookies = $("cookies").checked;
  options.passwords = $("passwords").checked;
  options.form_data = $("form-data").checked;
  options.hosted_apps_data = $("hosted-apps-data").checked;

  storage.set(options, function() {
    if (chrome.runtime.lastError) {
      $("message").textContent = chrome.runtime.lastError;
    } else {
      $("message").textContent = "Options saved.";
      setTimeout(function() {
        $("message").textContent = "";
      }, 1000);
    }
  });
}

document.addEventListener("DOMContentLoaded", load_options);
document.getElementById("save").addEventListener("click", save_options);
