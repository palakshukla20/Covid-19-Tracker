var result = []
var object = {}
var total = []

$(document).ready(function () {
  Promise.all([
    fetch("https://api.covid19india.org/v4/min/data.min.json"),
    fetch("https://api.covid19india.org/state_district_wise.json")
  ]).then(function (responses) {
    return Promise.all(responses.map(function (response) {
      return response.json();
    }));
  }).then(function (data) {
      main(data[0], data[1])
    
  }).catch(function (error) {
    console.log(error);
  });

  function main(state, district) {
    $.each(state, function(key, value) {
      var obj = {};
      if (key == "TT") {
        getData(value, key, obj);
        total.push(obj);
        object["India"] = total;
      } else {
        getData(value, key, obj);
        result.push(obj);
      }
    })
    getDistrictData(result, district, total);
    object["result"] = result;

    var templateCard = $("#total-data").html();
    var text = Mustache.render(templateCard, object);
    $("#map-card").html(text);
  
    var templateDropdown = $("#dropdown-template").html();
    var text = Mustache.render(templateDropdown, object);
    $("#body-right-upper").html(text);
    showTable(object);
    $.each(result, function(key, value) {
      var optionText = value.stateName;
      var optionValue = value.stateArray;
      $('.select-state').append(new Option(optionText, optionValue));
    });

    $('.sort-table-left-state').on('click', function() {
      sortByState(result, object);
    });
  
    $("#searchBar").on("keyup", function() {
      var searchField = $(this).val();
      $('#result').html('');
      $('#result').css('display', 'none');
      var expression = new RegExp(searchField, "i");
      $.each(result, function(key, value) {
        if (value.stateName.search(expression) != -1 ) {
          $('#result').css('display', 'block');
          $('#result').append('<li class="list-group-item link-class"><a id=' + value.stateName + 'href= "#">'+ value.stateName +'</a></li>');
        }
      });
      if ($("#searchBars").val() == 0) {
        $('#result').css('display', 'none');
      }
    }); 
  }
});

function getDistrictData(result, array, total) {
  var totalActive = 0;
  $.each(array, function(key, value) {
    $.each(result, function(key2, val) {
      if (value.statecode == val.stateArray) {
        var active = 0
        val["stateName"] = key;
        for (var x in value.districtData) {
          active += value.districtData[x].active;
        }
        val["active"] = active;
        totalActive += active;
        val["activeRatio"] = ((active*100)/val.confirmedData).toFixed(1);
      }
    })
  })
  total[0].active = totalActive.toLocaleString();
}

function getData(stateData, state, obj) {
  obj["stateArray"] = state;
  obj["confirmedData"] =  stateData.total.confirmed;
  obj["confirmed"] = stateData.total.confirmed.toLocaleString();
  obj["recovered"] = stateData.total.recovered.toLocaleString(); 
  obj["lastUpdate"] = new Date(stateData.meta.last_updated).toLocaleTimeString('it-US');
  obj["lastUpdateDate"] = new Date(stateData.meta.last_updated).toLocaleString();
  obj["tested"] = convertRupee(stateData.total.tested);
  obj["testData"] = stateData.total.tested.toLocaleString();
  obj["other"]  = stateData.total.other;
  obj["recoveryRatio"] = ((stateData.total.recovered * 100) / stateData.total.confirmed).toFixed(1);
  obj["caseFatality"]  = ((stateData.total.deceased * 100) / stateData.total.confirmed).toFixed(1);
  if (stateData.total.deceased) {
    obj["deceased"] = stateData.total.deceased.toLocaleString();
  }
  if (stateData.meta.population) {
    obj["population"] = convertRupee(stateData.meta.population);
  }
  if (stateData.meta.notes) {
    obj["notes"] = stateData.meta.notes;
  }
  if (stateData.delta) {
    obj["deltaConfirmed"] = stateData.delta.confirmed;
    obj["deltaRecovered"] = stateData.delta.recovered;
    obj["deltaDeceased"]  = stateData.delta.deceased;
  }
  return obj;
}

$('.Navbar').on('mouseenter', function() {
  $('.Navbar').toggleClass('nav-expand');
})
$('.Navbar').on('mouseleave', function() {
  $('.Navbar').removeClass('nav-expand');
})

$('.sort-table-right').on('click',function() {
  $('.body-middle').toggleClass("expand")
  $("i", this).toggleClass("fas fa-arrow-left fas fa-ellipsis-v");
  $(".table-hide").nextAll().toggle();
})

$('.sort-table-left-ques').on('click',function() {
  $(".sort-table-ques").toggle();
})

function convertRupee(amount) {
  var amount = "0" + amount;
  length = amount.length;
  if (length >= 6 && length <= 7) {
    return (amount / 100000).toFixed(1) + 'L';
  } else if (length >= 8 && length <= 11) {
    return (amount / 10000000).toFixed(1) + 'Cr.';
  } else if (length >= 4 && length < 6 ) {
    return (amount / 1000).toFixed(1) + 'K';
  } else {
    return 0;
  }
}

function showTable(object) {
  var template = $("#template").html();
  var text = Mustache.render(template, object);
  $("#body").html(text);
}

function sortByState(result, object) {
  $(".sort-table-left-state").toggleClass("sort"); 
  if ($(".sort-table-left-state").hasClass("sort")) {
    var newResult = [];
    for (var x = result.length-1; x >= 0; x--) {
      newResult.push(result[x]);
    }
    $("i", this).attr("class", "fas fa-sort-down");
    object["result"] = newResult;
    showTable(object);
  } else {
      $("i", this).attr('class', "fas fa-sort-up");
      object["result"] = result;
      showTable(object);
  } 
}

function expandRow(obj) {
  var stateCode = $(obj).attr('class');
  if ($('tr').hasClass(stateCode)) {
    $('#' + stateCode).next().slideToggle("fast");
  }
}
  
function isActive(e) {
  if($('.map-card div').hasClass('active')) {
    var ele = $('.active');
    $(ele).removeClass('active');
  }
  $(e).addClass('active');
}
