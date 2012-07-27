
# Javascript scrollbar


## Idea

If you think about scrollbars, there are actually two things important: Scrollbar itself, and content.
When we move n pixels in scrollbar we want to move k pixels in content (usually k > n). So how do we
add a scrollbar to content? We add a so called wrapper to content, and we add scrollbar to wrapper.
So structure you have looks something like this

    wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww
    wccccccccccccccccccccccccccccccSSw
    wccccccccccccccccccccccccccccccSSw
    wccccccccccccccccccccccccccccccSSw
    wccccccccccccccccccccccccccccccSSw
    wccccccccccccccccccccccccccccccSSw
    wccccccccccccccccccccccccccccccSSw
    wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww
   
   
Where S is scrollbar, w is the wrapper and c is the content. 
We "need" wrapper to "glue" these two things together. I say "need" with quotation marks because we don't
actually need it, but it's much easier with it. 
I'm going to use ```#this_notiation``` to mark an element with id of ```this_notitation``` and ```.this_notation```
to mark an element with class of ```this_notation```.
So how do I make ```#content``` not display any extra
content? We use ```overflow: hidden``` on wrapper. But if I hide overflow, how can I display it again? You set
```position: relative``` and use ```top``` on ```#content``` to manipulate what you see.
Everyhing will be explained if you keep reading on!

## Structure

First things first, if you are using Firefox get [Firebug](http://getfirebug.com/), on Chromium/Chrome
you have Webkit inspector and on Opera Dragonfly. On IE you can go and download another browser. I'm not going to
cover any developer tools here, but if you aren't familiar with them, google ```Webkit inspector/Firebug/Dragonfly tutorial``` and I'm sure you will find something!

Lets begin by defining basic html structure:
```html
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf8">
      <link type="text/css" rel="stylesheet" href="scrollbar.css">
      <title>Javscript Scrollbar tutorial</title>
    </head>
    <body>
    <div id="content">
    </div>
    <script type="application/javascript" src="scrollbar.js"></script>
    </body>
    </html>
```
HTML is pretty self explanatory. ```css #content``` holds scrollable data. Nothing else is needed.
When we add data to ```css #content``` (insert as many ```html <li>``` as you want:
```html
    ...
    <div id="content">
      <ol>
        <li>element</li>
        <li>element</li>
        <li>element</li>
        <li>element</li>
        <li>element</li>
        <li>element</li>
        <li>element</li>
        ...
        ...
        <li>element</li>
        <li>element</li>
        <li>element</li>
        <li>element</li>
        <li>element</li>
        <li>element</li>
        <li>element</li>
        <li>element</li>
        <li>element</li>
        <li>element</li>
      </ol>
    </div>
    ...
```
we can see that ```css #content``` extends and we really do not want that (we want it scrollable, right?).
We can achieve that by adding: 

    #content {width: 200px; height: 150px; overflow: scroll;}
    
but that's not exactly what we wanted. Hiding extra content (and we want to hide it, so we can code our own
scrollbar) can be done with

    #content { ... overflow: hidden;}
    
```width``` and ```height``` are css properties which specify width and height of the content area of an element.
```overflow``` property defines how will extra content will be handled. It's ```overflow: visible``` by default,
which means don't do anything to content, display it outside the box if box is to small (remove ```overflow: hidden``` 
 and test it). ```overflow: hidden``` says just clip content.
[Mozilla developer network](https://developer.mozila.org) has excelent reference on css
([CSS Reference - MDN](https://developer.mozilla.org/en/DOM/CSS)), so make sure you open that and visit it
everytime something is unclear or unfamiliar. 

But what we actually did here is hide all extra content from ```#content``` and that's not exactly what we wanted.
If you set 

    #content { ... position:relative; top:0px}

and use firebug to manipulate ```top```, you should see how we got the scrolling effect, but no extra content is
displayed. That is because we clipped extra content from ```#content```. If you look back at picture, we could 
(and we will) set ```overflow: hidden``` on wrapper and achieve same result, but extra content will be shown.
**Clarify**

Create a new .html file with same structure as above, but add another div, set its class name to "wrapper" 
and place ```#content``` inside it. You structure should look like this:

    ...
    <div clas="wrapper">
      <div id="content>
        ...
      </div>
    </div>

add 

    .wrapper {width: 200px; height: 150px; overflow: hidden}
    #content {width: 200px: height: 150px; position: relative; top: 0px}

to .css file and open .html in web browser. Open Firebug and fiddle with ```top``` property. What do you see?
Exactly what you need. This is how our scrollbar will work, manipulatig ```top``` to change what part of
```#content``` you see and wee need to add visual representation!
Again, [position - MDN](https://developer.mozilla.org/en/CSS/position).

## Javascript

Yay! Get back to old .html file (one without wrapper).
I'll be using [Module pattern](http://www.addyosmani.com/resources/essentialjsdesignpatterns/book/#modulepatternjavascript) ([Another explanation by Ben Cherry](http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth))
to keep global namespace clear as possible (google this and get informed about it, don't polute global namespace):

    var myScrollbar = (function() {
      //code
    })();


We want to allow some kind of customization to our scrollbar (for example, you might want to specify width or colors), so we define ```_config``` variable to hold configuration information and ```start()``` function to initialize and allow
passing object which properties (ones we defined in ```_config```) will be copied to ```_config```.

    var myScrollbar = (function() {
      var _config = {};
    
      function start(config){
        config = config || {};
        _config.content    = config.content    || "content";
      }

      return {
        start: start
      }
    })();

    myScrollbar.start();


Above, we define ```_config``` as an object and we pass ```config``` object to ```myScrollbar.start()``` function.
If you didn't meet with ```||``` operator before, basicaly it says if expression on left side is falsy,
return right side. It's really handy when dealing with default values (because ```undefined``` is falsy in js).
All these things inside function are keep 'private', we do not allow anyone to access them and we return 
object of properties we want public to see and use (public API). 

    var myScrollbar = (function() {
        ...
        
        function getConfig() {
          return _config;
        }
        
        return {
          start: start,
          getConfig: getConfig
        }
    })();
    ...

So if we input ```console.log(myScrollbar.getConfig())``` into javascript console, we get a _config object.


We don't really need names of these elements, what we need is DOM nodes. So let's get them! There is
```document.getElementById()``` function which does exactly that. You give string as parameter and you get
DOM node. So if we implement this, .js file looks something like this:

    var myScrollbar = (function() {
      var _config = {};

      function start(config){
        config = config || {};
        _config.content = config.content || "content";

        //get nodes
        _config.content = document.getElementById(_config.content);
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
    
If you enter ```console.log(myScrollbar.getConfig())``` into console, you see object, but this time instead of strings
there will be DOM nodes!

If you remeber when we talked about idea of scrollbar, we need to construct a wrapper around this content so we can
add scrollbar next to it.

    ...
    function start(config){
      config = config || {};
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

      ...


We create a new element and then insert it before ```_config.content```. After that we move ```_config.content```
into ```_config.wrapper``` and make it same height as ```_config.content```. We need to add a little bit more to
width because of scrollbar. Since we specified scrollbar width as 10px, we are adding 10 to that value.
Good practice would be to add another option to config: scrollbar_width. Also, as you code line by line this part,
```console.log(myScrollbar.getConfig())``` each line so you actualy see what is happening! Great, now 
all we need is scrollbar!

    ...
    //create scrollbar wrapper
    _config.scrollbarW = document.createElement("div");
    _config.scrollbarW = _config.wrapper.appendChild(_config.scrollbarW);
    _config.scrollbarW.className = "scrollbar_wrapper";
    

    //create scrollbar
    _config.scrollbar  = document.createElement("div");
    _config.scrollbar  = _config.scrollbarW.appendChild(_config.scrollbar);
    _config.scrollbar.className = "scrollbar";
    ...
    
First we create empty div, append it to ``_config.wrapper``` and then we add class name to it. That's our
scrollbar_wrapper. Same with scrollbar.

Next step, we want our scrollbar to look like a scrollbar (currently it's just laying there doing nothing),
so we assign some css properties to ```.scrollbar_wrapper```

    .scrollbar_wrapper {background: green; width: 10px; height: 100%;}

```background: green``` is there so we can see what are we doing.```height: 100%``` is because we want to move
scrollbar along whole height of wrapper (that is why we assigned height to ```_config.wrapper```).
As you can see on your screen, we have a wrapper for scrollbar, except it's not in position. Luckily, 
```float``` comes to rescue (read ([MDN](https://developer.mozilla.org/en/DOM/CSS)) if you aren't familiar
with ```float```)

    #content           {... float:left;}
    .scrollbar_wrapper {... float:right;}


Refresh and there you are, basic structure is here! 
So only thing that isn't in position right now is our scrollbar, so let's position it!
I'm going to use ```size of wrapper * 1/3```  for scrollbar size because it looks nice. 
To do this, we add at the end of our ```start()``` function:

    //set size of scrollbar
    _config.scrollbar.style.height = (_config.wrapper.offsetHeight * 1/3) + "px";

and we add

    .scrollbar         {background: black; position: relative}

to .css file so we can see what is happening and ```position: relative``` is because we want to use ```top```
to change scrollbar position (once again, use firebug to manipulate ```top``` property and see what is happening).
You should see black scrollbar! Now something about ```style``` property. ```_config.scrollbar.style``` is 
an object holding all css style properties of ```_config.scrollbar``` node.
Unfortunately, they aren't exacly the same (even though the ware developed at same time); for example in
css you define ```padding-left``` while in javascript you set that property by ```object.style.paddingLeft```.
All (almost) style properties are strings, so make sure you send a string with measure (px, %, em,...). ```+``` 
operator does automatic
type conversion in javascript and it's smart to include parenthesis around computation so 
you don't get unexpected results (try to enter ```"ss" + 3 + 4``` in console).


With scrollbar we can move faster from one part of content to another part. How fast we move depends on size
of scrollbar area. Think about it, if you have a 50px scollbar area and 1000px content, for one pixel movement
in scrollbar you will move around 20px in content. If that scrollbar is 100px, you will move around 10px. We have to find
and define that ratio. Problem is you aren't actually moving scrollbar for whole width of it's wrapper.
You are moving it for ```.scrollbar_wrapper - scrollbar``` width. Think about it, draw on paper and
you should understand.
Next problem is you aren't acually moving for whole width of content, you are moving only for content
you do not see, and that is total content, scrolable content - visible content or 
```_config.wrapper.scrollHeight - _config.scrollbarW.offsetHeight```. If we combine these two we get.


    //for each pixel movement on scrollbar we have to move _config.ratio pixels in content
    _config.ratio = ((_config.wrapper.scrollHeight - _config.scrollbarW.offsetHeight) 
                     / (_config.scrollbarW.offsetHeight - _config.scrollbar.offsetHeight));
    
For for one pixel movement in scrollbar we move by ```_config.ratio``` pixels in content.
Moving on:

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

Nothing special here, object is defined holding events and functions and using ```for...in``` we bind them to scrollbar.
When we click down with a mouse we want to enable moving of scrollbar with moving of the mouse, and whe we release
mouse we want to stop moving. It makes sense?

Now it's time to move out of our start() functions, so here is now all code combined: 

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

Let's move on to enableMoving function. How are we going to enable moving? We want to know if object is "movable" and
we are going to add class "draggable" to that object. Right now, scrollbar is our object so we add "draggable"
class to scrollbar.
We have to find middle of scrollbar (because don't want users to be able to grad scrollbar by edge) and
a way to find this is ```(e.clientY - e.layerY + _config.scrollbar.offsetHeight * 1/2)```. Take a pencil and draw this.
```e.clientY - e.layerY``` is top edge of scrollbar, and we add half size of scrollbar so we have position of the middle. 
Next time use that position to starDrag. Now we will allways drag scrollbar by middle.

    function enableMoving(e) {
      e.preventDefault();
      _config.scrollbar.className = "scrollbar draggable";
      _config.scrollbar.startDrag =
        _config.scrollbar.startDrag || (e.clientY - e.layerY + _config.scrollbar.offsetHeight * 1/2);
    }
  
Stop moving does similar thig. It removes "draggable" from scrollbar.
  
    function stopMoving(e) {
      _config.scrollbar.className = "scrollbar";
    }
    
    
Finaly, the moveContent function. This one moves content and displays visual indicator (scrollbar) where we are.

    function moveContent(e) {
      e.preventDefault();
      //if content is draggabke
      if (_config.scrollbar.className === "scrollbar draggable") {
        _config.scrollbar.top =  (e.clientY - _config.scrollbar.startDrag);
  
        _config.scrollbar.style.top = _config.scrollbar.top + "px";
        _config.content.style.top = -(_config.scrollbar.top * _config.ratio) + "px";
      }
    }
  

we only allow change if content is draggable. Next we calculate movement of scrollbar, which is starting position -
amount we moved in vertical direction. We assign visual representation of that movement and we move content by
that amount multiplied by ratio. Try to remove ratio and see how scrollbar behaves.
Great, we have a scrollbar! And it's moving content, but you can move it outside of ```.scrollbar_wrapper```.
We really don't want to allow that. There is an easy way to do this.



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

    
In first if statement, we simply check if ```_config.scrollbar.top``` is bellow zero. If it is, it means we moved
it to much in positive direction (by positive i mean up, north, top). Bottom limit is a little harder to calculate, 
it's size of ```.scrollbar_wrapper``` size of ```.scrollbar```. Draw it and think about it 
(we used this in calculating movement ratio).
