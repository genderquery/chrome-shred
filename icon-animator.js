function _setInterval(func, delay, context) {
  return window.setInterval(function() {
    func.call(context);
  }, delay);
}

function _setTimeout(func, delay, context) {
  return window.setTimeout(function() {
    func.call(context);
  }, delay);
}

var IconAnimator = (function() {

  // TODO: support 19/38 px icons 
  var IconAnimator = function(frames, interval) {
    if (!Array.isArray(frames)) {
      throw new TypeError("'frames' must be an Array");
    }
    if (!Number.isInteger(interval)) {
      throw new TypeError("'interval' must be an Integer");
    }
    this._frames = frames;
    this._interval = interval;
    this._intervalId = 0;
    this._frameCount = 0;
  };

  IconAnimator.prototype._animate = function() {
    var frame = ++this._frameCount % this._frames.length;
    chrome.browserAction.setIcon({"path": this._frames[frame]});
  };

  IconAnimator.prototype.run = function() {
    if (!this._intervalId) {
      this._intervalId = _setInterval(this._animate, this._interval, this);
    }
  };

  IconAnimator.prototype.stop = function() {
    window.clearInterval(this._intervalId);
    this._intervalId = 0;
    this._frameCount = 0;
  };

  IconAnimator.prototype.finish = function() {
    if (this._frameCount >= this._frames.length) {
      this.stop();
    } else {
      _setTimeout(function() {
        this.finish();
      }, this._interval, this);
    }
  };

  return IconAnimator;

})();

