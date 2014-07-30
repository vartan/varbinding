"use strict";

var VarBinding = function(startingValue){
  return function(startingValue) {
    //Local Variables:
    
    var _value = startingValue // Actual value of variable
    var _thisProperty          // Reference to this object
    var _bound = []
    
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
        // append element to _bound list
        _bound.push(element)

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
          _value = val
          // apply async as to not freeze the browser
          setTimeout(function() {
            for(var i = 0; i < _bound.length; i++) {
              _thisProperty._apply(_bound[i])
            }

          }, 0);
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
          if(isEditable(element)) {
            if(element.value != _value) 
              element.value = _value; 
          } else {
            if(element.innerHTML != _value) 
              element.textContent = _value
          }
        }
        return _thisProperty
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