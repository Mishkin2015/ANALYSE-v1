<%page args="vid_and_prob_daily_time"/>

// Graph for problem as well as videos daily consumption.

// Load the Visualization API and the chart package. Currently done on the HTML page.
//google.load('visualization', '1.0', {'packages':['corechart']});

// Set a callback to run when the Google Visualization API is loaded.
google.setOnLoadCallback(
  function() {
	localStorage.setItem('dateJSON',JSON.stringify(${vid_and_prob_daily_time}));
    drawChart5(${vid_and_prob_daily_time});
}
);

// Callback that creates and populates a data table,
// instantiates the chart, passes in the data and
// draws it.
function drawChart5(json_data) {

  // Instantiate and draw our chart, passing in some options.
  var chart = new google.visualization.ColumnChart(document.getElementById('vid_prob_daily_chart'));
  var VIDEO = document.getElementById('vidActivity').value;
  var PROBLEM = document.getElementById('probActivity').value;
  COLORS = [VIDEO, PROBLEM]
  if (json_data != null && json_data.length > 0) {
    
    // Create the data table.
    var data = new google.visualization.arrayToDataTable(json_data);
    
    var formatter = new google.visualization.NumberFormat(
  	      {suffix: ' min', pattern:'#,#', fractionDigits: '1'});
    formatter.format(data, 1);
    formatter.format(data, 2);
    // Set chart options
    var options = {vAxis: {title: 'Time'},
		   hAxis: {title: 'Date'},
		   width: 500,
		   height: 400,
		   colors: COLORS,
		   legend: {position: 'none'},};
    chart.draw(data, options);
    
  } else {   

    var node = document.createTextNode("No data to display.");
    var noData = document.createElement("p");
    noData.appendChild(node);
    document.getElementById('vid_prob_daily_chart').innerHTML = "";
    document.getElementById('vid_prob_daily_chart').appendChild(noData);
    
  }    

}
