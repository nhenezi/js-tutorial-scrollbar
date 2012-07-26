var myScrollbar = (function() {
  var _config = {};

  function start(config) {
    
    config = config || {};
    //parse config properties
    _config.content = config.content || "content";
  
    //get node
    _config.content = document.getElementById(_config.content);
    
    //create wrapper and wrap around content
    _config.wrapper = document.createElement("div");
    _config.wrapper = _config.content.parentElement.insertBefore( _config.wrapper, 
                                                                  _config.content);
    _config.wrapper.appendChild(_config.content);
    _config.wrapper.style.height = _config.content.offsetHeight + "px";
    _config.wrapper.style.width  = (_config.content.offsetWidth + 10) + "px";
    _config.wrapper.className    = "myScrollbar_wrapper";
    
    //create scrollbar wrapper
    _config.scrollbarW = document.createElement("div");
    _config.scrollbarW = _config.wrapper.appendChild(_config.scrollbarW);
    _config.scrollbarW.className = "scrollbar_wrapper";
    
    //create scrollbar
    _config.scrollbar  = document.createElement("div");
    _config.scrollbar  = _config.scrollbarW.appendChild(_config.scrollbar);
    _config.scrollbar.className = "scrollbar";
    
    //set size of scrollbar
    _config.scrollbar.style.height = (_config.wrapper.offsetHeight * 1/3) + "px";
    
    //for each pixel movement on scrollbar we have to move _config.ratio pixels in content
    _config.ratio = ((_config.wrapper.scrollHeight - _config.scrollbarW.offsetHeight) 
                     / (_config.scrollbarW.offsetHeight - _config.scrollbar.offsetHeight));
    
    //define events
    _config.scrollbar.events = {
      "mousedown":  enableMoving,
      "mousemove":  moveContent,
      "mouseup":    stopMoving,
      "mouseleave": stopMoving
    };
  
    //bind them
    for (var value in _config.scrollbar.events) {
      _config.scrollbar.addEventListener(value, _config.scrollbar.events[value], false);
    }

  }
  

  function enableMoving(e) {
    e.preventDefault();
    _config.scrollbar.className = "scrollbar draggable";
    _config.scrollbar.startDrag =
      _config.scrollbar.startDrag || (e.clientY - e.layerY + _config.scrollbar.offsetHeight * 1/2);
  }
  
  function stopMoving(e) {
    _config.scrollbar.className = "scrollbar";
  }
  
  function moveContent(e) {
    e.preventDefault();
    if (_config.scrollbar.className === "scrollbar draggable") {
      _config.scrollbar.top =  (e.clientY - _config.scrollbar.startDrag);

      //if we move to far to top
      if (_config.scrollbar.top < 0) {
        _config.scrollbar.top = 0;
      }
      //if we move to far to bottom
      else if (_config.scrollbar.top > _config.scrollbarW.offsetHeight - _config.scrollbar.offsetHeight){
        _config.scrollbar.top = _config.scrollbarW.offsetHeight - _config.scrollbar.offsetHeight;
      }

      _config.scrollbar.style.top = _config.scrollbar.top + "px";
      _config.content.style.top = -(_config.scrollbar.top * _config.ratio) + "px";
    }
  }
  
  function getConfig() {
    return _config;
  }

  return {
    getConfig: getConfig,
    start: start
  };

})();

myScrollbar.start();
