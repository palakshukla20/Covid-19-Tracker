var district = ["Madurai", "Ganjam", "Alappuzha", "Mumbai", "Chennai"]
var state = ["Andhra Pradesh", "Karnataka", "Gujarat", "West Bengal", "ladakh"]
var stateList = $("#state-list");
var districtList = $("#district-list");

for (x of district) {
  var ele1 = $("<li>").appendTo(districtList);
  var ele2 = $('<a href= "#"></a>').text("  " + x)
  ele2.attr('id', x)
  ele2.appendTo(ele1)
}

for (x of state) {
  var ele1 = $("<li>").appendTo(stateList);
  var ele2 = $('<a href= "#"></a>').text("  " + x)
  ele2.attr('id', x)
  ele2.appendTo(ele1)
}

function searchListHide() { 
  var input = $("#searchBar")[0];
  window.onclick = function(event) {
    if (event.target == input) {
      $("#hide-search").css('display', 'inline-flex')
    } else {
      $("#hide-search").css('display', 'none')
    } 
  }
}
