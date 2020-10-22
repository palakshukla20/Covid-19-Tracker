var chartAxisX = {
  minimum: new Date(2020, 8, 17),
  maximum: new Date(2020, 9, 13),
  lineThickness: 2,
  lineColor: "#ff073a",
  opacity: 0.1,
  labelFontColor: "red",
  tickColor: "red",
  labelFormatter: function (e) {
  return CanvasJS.formatDate( e.value, "DD MMM")}, 
}

var chartAxisY = {
  minimum: 0,
  gridThickness: 0,
  lineThickness: 2,
  lineColor: "red",
  labelFontColor: "red",
  tickColor: "red",
  valueFormatString: "",
}

var chartTooltip = {
  enabled: false
}

$(document).ready(function () {
  var state = $('.select-state').val()
  chart(state)
  var dataPoint1 = [];
  var dataPoint2 = [];
  var dataPoint3 = [];
  var dataPoint4 = [];
  var chart4 = new CanvasJS.Chart("chartContainer4",{
    backgroundColor: "rgba(255, 7, 58, 0.125)",
    borderRadius: 10,
    fontFamily: "archia",
    padding: 210,
    title: {
      text:"Tested",
      horizontalAlign: "left",
      fontColor: "red",
      fontSize: 20,
      fontFamily: "archia"
    },
    toolTip: chartTooltip,
    axisX: chartAxisX,
    axisY2: chartAxisY,
    data: [{
      color: "red",
      type: "line",
      dataPoints : dataPoint4,
      mouseover: function onMouseover(e){
        var text = $("<div style= 'postion: absolute; width: 100px'><span>" + 
        new Date(e.dataPoint.x).toLocaleDateString() + "</span><br><span>" + e.dataPoint.y + 
        "</span></div>");
        $('#chart4').html(text);
      },
      connectNullData: true,
      axisYType: "secondary",
      color: "red"
    }]
  });
  var chart3 = new CanvasJS.Chart("chartContainer3",{
    backgroundColor: "rgba(255, 7, 58, 0.125)",
    fontFamily: "archia",
    padding: 210,
    title: {
      text:"Deceased",
      horizontalAlign: "left",
      fontColor: "red",
      fontSize: 20,
      fontFamily: "archia"
    },
    toolTip: chartTooltip,
    axisX: chartAxisX,
    axisY2: chartAxisY,
    data: [{
      color: "red",
      type: "line",
      dataPoints : dataPoint3,
      mouseover: function onMouseover(e){
        var text = $("<div style= 'postion: absolute; width: 100px'><span>" + 
        new Date(e.dataPoint.x).toLocaleDateString() + "</span><br><span>" +e.dataPoint.y + 
        "</span></div>")
        $('#chart3').html(text);
      },
      connectNullData: true,
      axisYType: "secondary",
      color: "red"
    }]
  });
  var chart2 = new CanvasJS.Chart("chartContainer2",{
    backgroundColor: "rgba(255, 7, 58, 0.125)",
    fontFamily: "archia",
    padding: 210,
    title: {
      text:"Recovered",
      horizontalAlign: "left",
      fontColor: "red",
      fontSize: 20,
      fontFamily: "archia"
    },
    toolTip: chartTooltip,
    axisX: chartAxisX,
    axisY2: chartAxisY,
    data: [{
      color: "red",
      type: "line",
      dataPoints : dataPoint2,
      mouseover: function onMouseover(e){
        var text = $("<div style= 'postion: absolute; width: 100px'><span>" + 
        new Date(e.dataPoint.x).toLocaleDateString() + "</span><br><span>" +e.dataPoint.y + 
        "</span></div>")
        $('#chart2').html(text);
      },
      connectNullData: true,
      axisYType: "secondary",
    }]
  });
  var chart1 = new CanvasJS.Chart("chartContainer1",{
    backgroundColor: "rgba(255, 7, 58, 0.125)",
    fontFamily: "archia",
    padding: 210,
    title: {
      text:"Confirmed",
      horizontalAlign: "left",
      fontColor: "red",
      fontSize: 20,
      fontFamily: "archia"
    },
    toolTip: chartTooltip,
    axisX: chartAxisX,
    axisY2: chartAxisY,
    data: [{
      color: "red",
      type: "line",
      dataPoints : dataPoint1,
      mouseover: function onMouseover(e){
        var text = $("<div style= 'postion: absolute; width: 100px'><span>" + 
        new Date(e.dataPoint.x).toLocaleDateString() + "</span><br><span>" +e.dataPoint.y +
        "</span></div>")
        $('#chart1').html(text);
      },
      connectNullData: true,
      axisYType: "secondary",
    }]
  });

  $('.select-state').change(function(){
    return chart($('.select-state').val())
  }) 

  function chart(state) {
    $.getJSON("https://api.covid19india.org/v4/min/timeseries.min.json", function( data) {
      $.each( data, function(key, val) {
        if (key == state) {
          getData(key, val.dates)
        }
      });
    });
  }
  function getData(statecode, dates) {  
    var data1 = [], data2 = [], data3 = [], data4 = []
    $.each( dates, function( key, val) {
      if (new Date(key) < new Date(2020, 9, 16) && new Date(key) > new Date(2020, 8, 17)) {
        if (val.total.confirmed) {
          var array1 = [], array2 = [], array3 = [], array4 = []
          array1.push(new Date(key))
          array1.push(val.total.confirmed);
          array2.push(new Date(key))
          array2.push(val.total.recovered);
          if (val.total.deceased) {
            array3.push(new Date(key))
            array3.push(val.total.deceased);
          }
          array4.push(new Date(key))
          array4.push(val.total.tested);
        }
        data1.push(array1)		
        data2.push(array2)	
        data3.push(array3)
        data4.push(array4)
      }
    });
    showChart(data1, data2, data3, data4); 
  }

  function showChart(data1,data2, data3, data4) {
    getChartData(data1, dataPoint1);
    getChartData(data2, dataPoint2);
    getChartData(data3, dataPoint3);
    getChartData(data4, dataPoint4);
    chart1.render();
    chart2.render();
    chart3.render();
    chart4.render();
  }

  function getChartData(data, dataPoint) {
    $.each(data, function(key, value) {
      dataPoint.push({x: value[0], y: value[1]});
    });	
  }
})