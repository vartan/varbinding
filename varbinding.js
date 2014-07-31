"use strict";

var VarBinding = function(startingValue){
  return function(startingValue) {
    //Local Variables:
    
    var _value = startingValue // Actual value of variable
    var _thisProperty          // Reference to this object
    var _boundElements = []
    var _boundEvents = []
    function isEditable(element) {
      return element.tagName == "INPUT" || element.tagName == "TEXTAREA"
    }
    function addListener(element, eventName, handler) {
      if (element.addEventListener) {
        element.addEventListener(eventName, handler, false);
      }
      else if (element.attachEvent) {
        element.attachEvent('on' + eventName, handler);
      }
      else {
        element['on' + eventName] = handler;
      }
    }

    return {
      /**
       * Binds DOM element(s) to the variable
       * @param  {Element|Array} element DOM Element or Array of DOM Element
       * @return {VarBinding}            returns itself for chaining purposes.
       */
      bind: function(element) {
        // ensure _thisProperty exists
        if(!_thisProperty)
          _thisProperty = this

        // check if array
        if(element instanceof Array) {
          for(var i = 0; i < element.length; i++) {
            _thisProperty.bind(element[i])   
          }
          return _thisProperty
        }
        // check if Function
        if(!!(element && element.constructor && element.call && element.apply)) {
          _boundEvents.push(element)
          return _thisProperty
        }
        // append element to _boundElements list
        _boundElements.push(element)

        // if a value already exists for _value, apply it to the element
        _thisProperty._apply(element)

        if(isEditable(element)) {
          if(_value == undefined && element.value != undefined && element.value.length > 0) {
            // if value is still undefined and you are binding a defined editable, then
            // take the editable's value.
            _thisProperty.set(element.value)
          }
          // bind text changed events
          if("oninput" in window) {
            addListener(element,'input',    _thisProperty.onValueChanged);
          } else {
            addListener(element,'keyup',    _thisProperty.onValueChanged)
            addListener(element,'change',   _thisProperty.onValueChanged)
            addListener(element,'onpaste',  _thisProperty.onValueChanged)
            addListener(element,'oncut',    _thisProperty.onValueChanged)
          }
        }
        return _thisProperty
      },
      /**
       * Set value
       * @param  {Object}     val new value
       * @return {VarBinding}     Return this for chaining purposes
       */
      set: function(val) {
        if(!_thisProperty) _thisProperty = this
        if(val != _value) {
          var oldValue = _value
          _value = val
          // apply async as to not freeze the browser
          requestAnimationFrame(function() {
            for(var i = 0; i < _boundEvents.length; i++) {
              _boundEvents[i]({property:_thisProperty,oldValue:oldValue, newValue:val})
            }
            for(var i = 0; i < _boundElements.length; i++) {
              _thisProperty._apply(_boundElements[i])
            }

          });
        }
        return _thisProperty
      },
      /**
       * Get value
       * @return {Object} returns object value
       */
      get: function() {return _value},
      /**
       * Apply value to DOM element
       * @param  {Element}    element DOM element to be modified
       * @return {VarBinding}         Returns this for chaining purposes.
       */
      _apply: function(element) {
        if(_value != undefined) {
          if(isEditable(element)) { // check if element has value attribute
            if(element.value != _value) 
              element.value = _value; 
          } else {
            if(element.innerHTML != _value) 
              element.textContent = _value
          }
        }
        return _thisProperty
      },
      getBoundElements: function() {
        return _boundElements
      },
      /**
       * On value changed
       * @param  {event}      event oninput/other event
       * @return {VarBinding}       Returns this for chaining purposes
       */
      onValueChanged:function(event) {
        _thisProperty.set(event.target.value)
      }
    }
  }(startingValue)
};