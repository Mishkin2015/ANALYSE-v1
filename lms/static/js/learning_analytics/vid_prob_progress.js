// Load the Visualization API and the areachart package.
google.load('visualization', '1.0', {'packages':['corechart']});

var LA_vid_prob_prog = (function(){
	var CHART_ID = 0;
	
	var ALL_STUDENTS = -1;
   	var PROF_GROUP = -2;
    var PASS_GROUP = -3;
    var FAIL_GROUP = -4;
	
	var PROBLEM_COLOR = "#4c9900";
	var VIDEO_COLOR = "#003366";
	var DEFAULT_TITLE = 'Type of Progress';
	var DEFAULT_LEGEND = ['Progress in videos', 'Grades in problems'];
	var EMPTY_TEXT = 'No data';

	var data = null;
	var options = null;
	var prog_json = null;
	
	// Callback that creates and populates a data table, 
	// instantiates the pie chart, passes in the data and
	// draws it.
	var drawChart = function() {

		if(data == null){

			// Default data
			prog_json = VID_PROB_PROG_DUMP[getSelectedUser()];
			if (prog_json == null){
				var node = document.createTextNode("No data to display.");
			    var noData = document.createElement("p");
			    noData.appendChild(node);
			    document.getElementById('chart_vid_prob_prog').innerHTML = "";
			    document.getElementById('chart_vid_prob_prog').appendChild(noData);
			}else{
				var prog_array = [['Date','Video Percent', 'Problems grades'],];
				for(var i = 0; i < prog_json.length; i++){
					prog_array.push([prog_json[i]['time'],prog_json[i]['videos']/100,prog_json[i]['problems']/100]);
				}

				var json_limit= [];
                var cont=1;
                json_limit [0] = prog_array[0];
                var cent=1;
                for (var i=1;i<prog_array.length; i++) {
                    if(cent<11){
                        json_limit [cent] = prog_array[i];
                        cent=1+cent;
                    }
                }
				data = google.visualization.arrayToDataTable(json_limit);
				// Format data as xxx%
				var formatter = new google.visualization.NumberFormat({pattern:'#,###%'});
				formatter.format(data,1);
				formatter.format(data,2);
				
				options = {
					colors: [VIDEO_COLOR, PROBLEM_COLOR],
					legend: {position: 'none'},
					isStacked: false,
					vAxis: {format: '#,###%',
							viewWindow: {max: 1.0001,
									 	 min: 0},}
				};
				document.getElementById('vid_prob_prog_legend_title').innerHTML = DEFAULT_TITLE;
		
				// Fill legend
				fillLegend(DEFAULT_LEGEND, [VIDEO_COLOR, PROBLEM_COLOR]);
				
				// Select callbacks
				setSelectCallback();
	
				if (prog_json.length == 0){
					document.getElementById('chart_vid_prob_prog').innerHTML = EMPTY_TEXT;
					return;
				}
				var chart = new google.visualization.AreaChart(document.getElementById('chart_vid_prob_prog'));
				chart.draw(data, options);
			}
		}
		
		function fillLegend(names, colors){
			var ul = document.getElementById("vid_prob_prog_legend_list");
			// Empty list
			ul.innerHTML = "";
			for(var i = 0; i< names.length; i++){
				var li = document.createElement("li");
				li.innerHTML = "<span style='background:"+colors[i]+";'></span>"+names[i];
				ul.appendChild(li);
			}
		}
	};
	
	var updateChart = function(event) {
		var sel_user = getSelectedUser();
		
		$.ajax({
			// the URL for the request
			url: "/courses/learning_analytics/chart_update",
			
			// the data to send (will be converted to a query string)
			data: {
				user_id   : sel_user,
				course_id : COURSE_ID,
				chart : CHART_ID
			},
			
			// whether to convert data to a query string or not
			// for non convertible data should be set to false to avoid errors
			processData: true,
			
			// whether this is a POST or GET request
			type: "GET",
			
			// the type of data we expect back
			dataType : "json",
			
			// code to run if the request succeeds;
			// the response is passed to the function
			success: function( json ) {
				VID_PROB_PROG_DUMP = json;
				change_data();
			},
		
			// code to run if the request fails; the raw request and
			// status codes are passed to the function
			error: function( xhr, status, errorThrown ) {
				// TODO dejar selectores como estaban
				console.log( "Error: " + errorThrown );
				console.log( "Status: " + status );
				console.dir( xhr );
			},
		
			// code to run regardless of success or failure
			complete: function( xhr, status ) {
			}      
		});
	};
	
	var getSelectedUser = function(){
		if(SU_ACCESS){
			var selectOptions = document.getElementById('vid_prob_prog_options');
			var selectStudent = document.getElementById('vid_prob_prog_student');
			var selectGroup = document.getElementById('vid_prob_prog_group');
			var selection = selectOptions.options[selectOptions.selectedIndex].value;
				
			switch(selection){
				case "all":
					selectStudent.style.display="none";
					selectGroup.style.display="none";
					return ALL_STUDENTS;
				case "student":
					selectStudent.style.display="";
					selectGroup.style.display="none";
					return selectStudent.options[selectStudent.selectedIndex].value;
				case "group":
					selectStudent.style.display="none";
					selectGroup.style.display="";
					switch(selectGroup.options[selectGroup.selectedIndex].value){
						case "prof":
							return PROF_GROUP;
						case "pass":
							return PASS_GROUP;
						case "fail":
							return FAIL_GROUP;
					}
			}		
		}else{
			return USER_ID;
		}

	};
	
	var setSelectCallback = function(){
		// Set selectors callbacks
		var selectOptions = document.getElementById('vid_prob_prog_options');
		var selectStudent = document.getElementById('vid_prob_prog_student');
		var selectGroup = document.getElementById('vid_prob_prog_group');
			
		selectOptions.onchange = function(){
			var selection = selectOptions.options[selectOptions.selectedIndex].value;
			
			switch(selection){
				case "all":
					selectStudent.style.display="none";
					selectGroup.style.display="none";
					updateChart();
					break;
				case "student":
					selectStudent.style.display="";
					selectGroup.style.display="none";
					updateChart();
					break;
				case "group":
					selectStudent.style.display="none";
					selectGroup.style.display="";
					updateChart();
					break;
			}
			if(!SU_ACCESS){
				selectOptions.style.display="none";
				selectStudent.style.display="none";
				selectGroup.style.display="none";
			}
		};
		
		selectStudent.onchange = function(){
			updateChart();
		};
		
		selectGroup.onchange = function(){
			updateChart();
		};
	};
	
	var change_data = function(){
		data = null;
		options = null;
		prog_json = null;
		var ul = document.getElementById("vid_prob_prog_legend_list");
		// Empty list
		ul.innerHTML = "";
		LA_vid_prob_prog.drawChart();
	};
	
	return {
		drawChart: drawChart,
	};
})();

// Set a callback to run when the Google Visualization API is loaded.
google.setOnLoadCallback(LA_vid_prob_prog.drawChart);