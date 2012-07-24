var myScrollbar = (function() {
  var _config = {};

  function start(config){
    config = config || {};
    _config.wrapper    = config.wrapper    || "wrapper";
    _config.content    = config.content    || "content";
    _config.scrollbarw = config.scrollbarw || "scrollbar_wrapper";
    _config.scrollbar  = config.scrollbar  || "scrollbar";
  }

  function getConfig() {
    return _config;
  }

  return {
    start: start,
    getConfig: getConfig
  }
})();

myScrollbar.start()
