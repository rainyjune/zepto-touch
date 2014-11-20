/***
 * Zepto swipe module.
 * @author rainyjune <rainyjune@live.cn>
 * Known issue: swipe down and swipe up works not good enough on Android 4.1- devices.
 */
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
  
  var touchX, touchY, movX, movY, goLeftRight;
  var goUpDown;
  var nowX = null, nowY = null;
  
  var horizontalOffset = 20,
      verticalOffset = 30;
  
  // Note:
  // 1. The touchend event is not trigged on some android stock browsers before 4.1 Jelly Bean.
  //      See: https://code.google.com/p/android/issues/detail?id=19827
  // 2. The solution: http://stackoverflow.com/a/23145727
  
  
  // Resources
  // 1. Pointer and gesture events in Internet Explorer 10 (http://msdn.microsoft.com/en-us/library/ie/hh673557(v=vs.85).aspx)
  
  if (isAndroidBrowser() && getAndroidVersion() < 4.1) {
    //alert("4.1--");
    $(document).on("touchstart", start);
    $(document).on("touchmove", move);
    $(document).on("touchend", stop);
    $(document).on("touchleave", stop);
    $(document).on("touchcancel", stop);
  } else if (window.navigator.msPointerEnabled) {
    //alert("windows");
    $(document).on("MSPointerDown", pointerDown);
    $(document).on("MSPointerMove", pointerMove);
    $(document).on("MSPointerUp", pointerUp);
    $(document).on("MSPointerCancel", pointerCancel);
  } else if (('ontouchstart' in document.documentElement) || ('ontouchstart' in window)){
    $(document).on("touchstart", touchstartHandler);
    $(document).on("touchmove", touchmoveHandler);
    $(document).on("touchend", touchendHandler);
    $(document).on("touchleave touchcancel", touchendHandler);
  } else {
    $(document).on("mousedown", mousestartHandler);
    $(document).on("mousemove", mousemoveHandler);
    $(document).on("mouseup", touchendHandler);
  }
  
  function mousestartHandler(event) {
    initAllVar();
    touchX = event.clientX;
    touchY = event.clientY;
  }
  
  function mousemoveHandler(event) {
    nowX = event.clientX,
    nowY = event.clientY;
  }
  
  function touchstartHandler(event) {
    initAllVar();
    //debugger;
    /*
    touchX = event.touches[0].pageX;
    touchY = event.touches[0].pageY;
    */
    touchX = event.touches[0].clientX;
    touchY = event.touches[0].clientY;
  }
  
  function touchmoveHandler(event) {
    /*
    nowX = event.touches[0].pageX,
    nowY = event.touches[0].pageY;
    */
    nowX = event.touches[0].clientX,
    nowY = event.touches[0].clientY;
  }
  
  function touchendHandler(event) {
    if (nowX === null || nowY === null) {
      return ;
    }
    movX = Math.abs(touchX - nowX);
    movY = Math.abs(touchY - nowY);
    var el = $(event.target) || $(document);
    if (movX > horizontalOffset || movY > verticalOffset) {
      el.trigger("swipeMy");
      //alert("Movex:" + movX + " movey: " + movY);
      el.trigger("swipe" + (swipeDirection(touchX, nowX, touchY, nowY)) + "My");
      //console.error("ie direction", swipeDirection(touchX, nowX, touchY, nowY));
    }
  }
  
  function pointerDown(event) {
    initAllVar();
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
    if (nowX === null || nowY === null) {
      return ;
    }
    console.info('pointerUp', event.clientX, event.clientY);
    movX = Math.abs(touchX - nowX);
    movY = Math.abs(touchY - nowY);
    var el = $(event.target) || $(document);
    if (movX > horizontalOffset || movY > verticalOffset) {
      el.trigger("swipeMy");
      el.trigger("swipe" + (swipeDirection(touchX, nowX, touchY, nowY)) + "My");
      //console.error("ie direction", swipeDirection(touchX, nowX, touchY, nowY));
    }
  }
  function pointerCancel(event) {
    //console.info('pointerCancel', event.clientX, event.clientY);
    pointerUp(event);
  }
  
  function isAndroidBrowser() {
    var ua = navigator.userAgent;
    return (ua.indexOf("Android") >= 0) || (ua.indexOf("android") >= 0);
  }
  
  /**
   * Get 2 digit version of Android
   */
  function getAndroidVersion() {
    var ua = navigator.userAgent;
    return parseFloat(ua.slice(ua.indexOf("Android")+8));
  }

  function swipeDirection(x1, x2, y1, y2) {
    return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down');
  }
  
  function prevent(e){
    e.preventDefault();
  }
  
  function start(e) {
    initAllVar();
    goLeftRight = false;
    goUpDown = false;
    document.addEventListener("touchmove", prevent, false);
    /*
    touchX = e.touches[0].pageX;
    touchY = e.touches[0].pageY;
    */
    touchX = e.touches[0].clientX;
    touchY = e.touches[0].clientY;
  }
  
  function move(e) {
    /*
    var nowX = e.touches[0].pageX,
        nowY = e.touches[0].pageY;
    */
    var nowX = e.touches[0].clientX,
        nowY = e.touches[0].clientY;
    movX = nowX - touchX;
    movY = nowY - touchY;
    // TODO
    var el = $(e.target) || $(document);
    if(!goLeftRight) {
      var absMovX = Math.abs(movX),
          absMoveY = Math.abs(movY);
      if(absMoveY < absMovX) {
        //alert("MOVEX: " + absMovX + " MOVEY: " + absMoveY);
        // Swipe Left or Swipe Right
        if (absMovX < horizontalOffset) {
          return ;
        }
        goLeftRight = true;
        
        //debugger;
        el.trigger("swipeMy");
        el.trigger("swipe" + (swipeDirection(touchX, nowX, touchY, nowY)) + "My");
        //console.log("direction 1", swipeDirection(touchX, nowX, touchY, nowY), e);
      } else {
        // Swipe Up or Swipe Down
        stop(e);
        if (!goUpDown) {
          if (absMoveY < verticalOffset) {
            return ;
          }
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
  
  function initAllVar() {
    //return ;
    touchX = 0,
    touchY = 0,
    movX = 0,
    movY = 0,
    goLeftRight = false;
    goUpDown = false;
    nowX = null,
    nowY = null;
  }
  
  ['swipeMy', 'swipeLeftMy', 'swipeRightMy', 'swipeUpMy', 'swipeDownMy'].forEach(function(eventName){
    $.fn[eventName] = function(callback){
      return this.on(eventName, callback);
    };
  });
  
}));