(function($){
  console.log($.fn);
  
  var touchX, touchY, movX, movY, go;
  var goUpDown;
  
  // Note:
  // 1. The touchend event is not trigged on some android stock browsers before 4.1 Jelly Bean.
  //      See: https://code.google.com/p/android/issues/detail?id=19827
  // 2. The solution: http://stackoverflow.com/a/23145727
  
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
    var el =   $(document) || $(e.touches[0]);
    if(!go) {
      var absMovX = Math.abs(movX),
          absMoveY = Math.abs(movY);
      if(absMoveY < absMovX) {
        // Swipe Left or Swipe Right
        go = true;
        
        //debugger;
        el.trigger("swipe");
        el.trigger("swipe" + (swipeDirection(touchX, nowX, touchY, nowY)));
        //console.log("direction 1", swipeDirection(touchX, nowX, touchY, nowY), e);
      } else {
        // Swipe Up or Swipe Down
        stop(e);
        if (!goUpDown) {
          goUpDown = true;
          el.trigger("swipe");
          el.trigger("swipe" + (swipeDirection(touchX, nowX, touchY, nowY)));
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
  
  document.addEventListener("touchstart", start, true);
  document.addEventListener("touchmove", move, true);
  document.addEventListener("touchend", stop, true);
  document.addEventListener("touchleave", stop, true);
  document.addEventListener("touchcancel", stop, true);
  
  ['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown'].forEach(function(eventName){
    $.fn[eventName] = function(callback){
      return this.on(eventName, callback);
    };
  });
  
})(Zepto);