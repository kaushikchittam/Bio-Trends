$( document ).ready(function() {

var geneList=$('.chzn-select');
$.getJSON('json/mesh.json', function(data) {

	//mesh.json
	for(var i=0;i<data.length;i++){ 

		var opt="<option value='" + data[i].meshID + "'>"+data[i].definition+"</option>";
		
		geneList.append(opt);
	}
	$(".chzn-select").trigger("chosen:updated").chosen();
	});
	});
	