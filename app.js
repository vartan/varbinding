"use strict";
$(function() {
  showCode()

  // create my object;  NOTE: JQueryObject.get() returns an array of elements
  var me = {
    firstName:  VarBinding()        .bind($("[bind=firstName]") .get()),
    middleName: VarBinding()        .bind($("[bind=middleName]").get()),
    lastName:   VarBinding("Vartan").bind($("[bind=lastName]")  .get()),
    getFullName: function() {
      var first, middle, last,
      nameParts = []
      if(first  = this.firstName.get())  nameParts.push(first)
      if(middle = this.middleName.get()) nameParts.push(middle)
      if(last   = this.lastName.get())   nameParts.push(last)
      return nameParts.join(" ")
    }
  }

  $("#nameform").submit(function(e){
    e.preventDefault()
    $("#nameform button").text("Fetched: My name is: "+me.getFullName())
  })

})  

function showCode() {
  $("code[src]").each(function(index,element) {
    var fileName = element.getAttribute("src")
    $.ajax({url:fileName}).done(function(content) {
      element.textContent = content
      hljs.highlightBlock(element)
    })
  })
}