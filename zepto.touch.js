(function(factory){
  if (typeof define !== "undefined" && define.cmd) {
    define(function(require, exports, module){
      
      var $ = require('zepto');
      factory($);
    });
  } else {
    var $ = Zepto;
    factory($);
  }
}(function($){
  console.log($.fn);
  
  var touchX, touchY, movX, movY, go;
  var goUpDown;
  var nowX, nowY;
  
  // Note:
  // 1. The touchend event is not trigged on some android stock browsers before 4.1 Jelly Bean.
  //      See: https://code.google.com/p/android/issues/detail?id=19827
  // 2. The solution: http://stackoverflow.com/a/23145727
  
  
  // Resources
  // 1. Pointer and gesture events in Internet Explorer 10 (http://msdn.microsoft.com/en-us/library/ie/hh673557(v=vs.85).aspx)
  
  function swipeDirection(x1, x2, y1, y2) {
    return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down');
  }
  
  function prevent(e){
    e.preventDefault();
  }
  
  function start(e) {
    go = false;
    goUpDown = false;
    document.addEventListener("touchmove", prevent, false);
    touchX = e.touches[0].pageX;
    touchY = e.touches[0].pageY;
  }
  
  function move(e) {
    var nowX = e.touches[0].pageX,
        nowY = e.touches[0].pageY;
    movX = nowX - touchX;
    movY = nowY - touchY;
    // TODO
    var el = $(e.target) || $(document);
    if(!go) {
      var absMovX = Math.abs(movX),
          absMoveY = Math.abs(movY);
      if(absMoveY < absMovX) {
        // Swipe Left or Swipe Right
        go = true;
        
        //debugger;
        el.trigger("swipeMy");
        el.trigger("swipe" + (swipeDirection(touchX, nowX, touchY, nowY)) + "My");
        //console.log("direction 1", swipeDirection(touchX, nowX, touchY, nowY), e);
      } else {
        // Swipe Up or Swipe Down
        stop(e);
        if (!goUpDown) {
          goUpDown = true;
          el.trigger("swipeMy");
          el.trigger("swipe" + (swipeDirection(touchX, nowX, touchY, nowY)) + "My");
          //console.log("direction 2", swipeDirection(touchX, nowX, touchY, nowY), e);
        }
        
      }
    } else {
      /* *************** */
      // cast your spell
      /* *************** */
    }
  }
  
  function stop(e) {
    document.removeEventListener("touchmove", prevent, false);
  }
  
  $(document).on("touchstart", start);
  $(document).on("touchmove", move);
  $(document).on("touchend", stop);
  $(document).on("touchleave", stop);
  $(document).on("touchcancel", stop);
  
  if (window.navigator.msPointerEnabled) {
    $(document).on("MSPointerDown", pointerDown);
    $(document).on("MSPointerMove", pointerMove);
    $(document).on("MSPointerUp", pointerUp);
    $(document).on("MSPointerCancel", pointerCancel);
  }
  
  function pointerDown(event) {
    console.info('pointer down', event.clientX, event.clientY);
    touchX = event.clientX;
    touchY = event.clientY;
  }
  function pointerMove(event) {
    console.info('pointerMove', event.clientX, event.clientY);
    nowX = event.clientX;
    nowY = event.clientY;
  }
  function pointerUp(event) {
    console.info('pointerUp', event.clientX, event.clientY);
    movX = Math.abs(touchX - nowX);
    movY = Math.abs(touchY - nowY);
    var el = $(event.target) || $(document);
    if (movX > 10 || movY > 10) {
      el.trigger("swipeMy");
      el.trigger("swipe" + (swipeDirection(touchX, nowX, touchY, nowY)) + "My");
      //console.error("ie direction", swipeDirection(touchX, nowX, touchY, nowY));
    }
  }
  function pointerCancel(event) {
    //console.info('pointerCancel', event.clientX, event.clientY);
    pointerUp(event);
  }
  
  ['swipeMy', 'swipeLeftMy', 'swipeRightMy', 'swipeUpMy', 'swipeDownMy'].forEach(function(eventName){
    $.fn[eventName] = function(callback){
      return this.on(eventName, callback);
    };
  });
  
}));