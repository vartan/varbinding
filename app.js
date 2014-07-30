"use strict";
document.body.onload = function() {
  showCode()

  // create my object;  NOTE: JQueryObject.get() returns an array of elements
  var me = {
    firstName:  VarBinding()        .bind(getAllElementsWithAttributes({attribute:"bind",value:"firstName"})),
    middleName: VarBinding()        .bind(getAllElementsWithAttributes({attribute:"bind",value:"middleName"})),
    lastName:   VarBinding("Vartan").bind(getAllElementsWithAttributes({attribute:"bind",value:"lastName"})),
                                                                                                        // bind function:
    age:        VarBinding(20)      .bind(getAllElementsWithAttributes({attribute:"bind",value:"age"})).bind(testBoundEvents),
    getFullName: function() {
      var first, middle, last,
      nameParts = []
      if(first  = this.firstName.get())  nameParts.push(first)
      if(middle = this.middleName.get()) nameParts.push(middle)
      if(last   = this.lastName.get())   nameParts.push(last)
      return nameParts.join(" ")
    }
  }

  document.getElementById("nameform").onsubmit = function(e){
    e.preventDefault()
    document.getElementById("whatismyname").textContent = "Fetched | My name is "+me.getFullName()+" and I am "+me.age.get()+" years old."
  }

} 

function showCode() {
  var codeBlocks = getAllElementsWithAttributes({tag:"code",attribute:"src"})
  showNextCode(codeBlocks,0);
}
function showNextCode(elements,index) {
  var element = elements[index]
  var fileName = element.getAttribute("src")
  var e = element;
  ajax(fileName,function(content) {

    e.textContent = content
    hljs.highlightBlock(e)
    if(index+1<elements.length)
      showNextCode(elements,index+1)
  });
}
function ajax(url, callback) {
  var request;
  if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
    request=new XMLHttpRequest();
  } else {// code for IE6, IE5
    request=new ActiveXObject("Microsoft.request");
  }
  request.onreadystatechange=function() {
    if(request.readyState==4)
      callback(request.responseText);
  }
  request.open("GET",url,true);
  request.send();  
}
function getAllElementsWithAttributes(options)
{

  var matchingElements = [];
  if(typeof options === 'string')
    var attribute = options;
  else
    var attribute = options.attribute
  var allElements = document.getElementsByTagName('*');
  for (var i = 0, n = allElements.length; i < n; i++)
  {

    if (allElements[i].getAttribute(attribute) && (!options.value || options.value == allElements[i].getAttribute(attribute)) && (!options.tag || options.tag.toUpperCase() == allElements[i].tagName))
    {
      // Element exists with attribute. Add to array.
      matchingElements.push(allElements[i]);
    }
  }
  return matchingElements;
}

function testBoundEvents(options) {
  var ageDisplays = options.property.getresizeAgeDisplays()
  console.log(options.oldValue + " -> "+options.newValue)

  for(var i = 0; i < ageDisplays.length; i++) {
    var ageDisplay = ageDisplays[i]
    if(ageDisplay.tagName == "STRONG") {
      ageDisplay.style.fontSize = (1+options.newValue/100*2-0.4)+"em"
    }
  }
}
