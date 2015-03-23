# zepto-touch
Zepto swipe plugin

Tested on 
 * Android 2.3.5 (ZTE Q101T)
 * Android 4.0.3 (Coolpad 8076D)
 * Android 4.2.2 (Sony S36h)
 * Android 4.4.2 (SAMSUNG GT-N7100)
 * iOS 8.0 (iPad)
 * Windows Phone 8.1, IE Mobile v11(Nokia Lumia 530)

Known Issues:
* swipeUp and swipeDown not works on Android 4.0.3, Android 4.4.2. If you want these events available, you should add preventDefault() to your touchstart event handler. But this will make your contents within the element unscrollable.
