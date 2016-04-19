<%page args="video_intervals_array"/>

// Load the Visualization API and the chart package. Currently done on the HTML page.
//google.load("visualization", "1", {packages:["corechart"]});

// Set a callback to run when the Google Visualization API is loaded.
google.setOnLoadCallback(
  function() {
    drawChart4(${video_intervals_array});
  }
);

// Callback that creates and populates a data table,
// instantiates the chart, passes in the data and
// draws it.
function drawChart4(json_data) {
	if (json_data==null){
	    var node = document.createTextNode("No data to display.");
	    var noData = document.createElement("p");
	    noData.appendChild(node);
	    document.getElementById('video_intervals_chart').innerHTML = "";
	    document.getElementById('video_intervals_chart').appendChild(noData);
	    
	}else{
		var num_gridlines = json_data['num_gridlines'];
		var vticks = json_data['vticks'];
		var chart_data = json_data['video_intervals_array'];
		var VIDEO_TIMES = document.getElementById('vidActivity').value;
	  // Instantiate and draw our chart, passing in some options.
	  var chart = new google.visualization.SteppedAreaChart(document.getElementById('video_intervals_chart'));
	  
	  if (chart_data != null && chart_data.length > 0) {
	    
	    // Create the data table.
	    var data = new google.visualization.arrayToDataTable(chart_data);
	    // Set chart options
	    var options = {
	      vAxis: {title: 'Times', minValue:0, format:'#', gridlines: {count: num_gridlines}, ticks: vticks},
	      hAxis: {title: 'Video position (s)'},
	      isStacked: false,
	      colors: [VIDEO_TIMES],
	      legend: {position: 'none'},      
	    };
	    
	    chart.draw(data, options);
	    
	  } else {   
	
	    var node = document.createTextNode("No data to display.");
	    var noData = document.createElement("p");
	    noData.appendChild(node);
	    document.getElementById('video_intervals_chart').innerHTML = "";
	    document.getElementById('video_intervals_chart').appendChild(noData);
	    
	  }
	}
}