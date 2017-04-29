var keywordList=$('.chzn-select');
var qualifList=$('.chzn-select-quailifier');
var opt="";
var qulifOpt="";
var dataInput="";
var jsonArray=[];
var mask;
$( document ).ready(function() {


  $.ajax({
			type: "GET",
            url: "json/mesh1.json",
            dataType: "json",
            success: function (data) {
			
			for (var obj in data) {
					if (data.hasOwnProperty(obj)) {
						
						opt+="<option value='" + data[obj].meshID + "'>"+data[obj].definition+"</option>";
					}
				}
				keywordList.append(opt);
				$(".chzn-select").trigger("chosen:updated").chosen();
				$('.DialogMask').remove();
				$('#wait').hide();
				
			},            
   beforeSend: function(){
     // Handle the beforeSend event
	   mask = $('<div class="DialogMask"></div>');
       $('#browseMutations').append(mask);
	 //$('#browseMutations').addClass('DialogMask');
	   $('#wait').show();
   },
   complete: function(){}
   
 });
  $.ajax({
            type: "GET",
            url: "json/meshqualif.json",
            dataType: "json",
            success: function (data) {
			for (var obj in data) {
					if (data.hasOwnProperty(obj)) {
						
						qulifOpt+="<option value='" + data[obj].qualifID + "'>"+data[obj].definition+"</option>";
					}
				}
				qualifList.append(qulifOpt);
				$(".chzn-select-quailifier").chosen();
				
				$(".chzn-select-quailifier").attr('disabled', true).trigger("chosen:updated");
			},        
        });
$('#tabs').tabs();
$(document).on('change', ".chzn-select", function () {
       // alert(this.value);
	   if($('.chzn-select option').is(':selected')){
		$(".chzn-select-quailifier").attr('disabled', false).trigger("chosen:updated");
		}else{
		$(".chzn-select-quailifier").attr('disabled', false).trigger("chosen:updated");
		}
    });
$('#addButton').on('click',function(){

var markup='<select name="keyword" data-placeholder="Select a keyword" class="chzn-select" style="width:350px;" tabindex="2"><option name="" value=""></option></select> <select name="keywordQualifer" data-placeholder="Select a qualifier" class="chzn-select-quailifier" style="width:350px;" tabindex="3"><option name="" value=""></option></select><input type="checkbox" id="cbox2" value="second_checkbox"> <label for="cbox2">Not Include</label><br><br>';
				$('#addedSearch').append(markup);
				$(".chzn-select").append(opt);
				$(".chzn-select").trigger("chosen:updated").chosen();
				$(".chzn-select-quailifier").append(qulifOpt).chosen();
				$(".chzn-select-quailifier").attr('disabled', true).trigger("chosen:updated");
				
});

function displayKeywords(){
				var msgDiv=$('#msgDivGenes');
				var geneSelectionArr=$('.chzn-select :selected');
				if(geneSelectionArr.text()==""){
					msgDiv.html("You haven't selected any keywords")
				}
				else{
					var str="You have selected the following  keywords<br> ";
					var temp="";
					$.each(geneSelectionArr,function(){
					temp+=this.text;
					temp+="<br/>";
					});
					//console.log(temp);
					str+=temp;
					//console.log(str);
					msgDiv.html(str);

				}
}
function displayQualif(){
				var msgDiv=$('#msgDivQualif');
				//msgDiv.html("");
				var geneSelectionArr=$('.chzn-select-quailifier :selected');
				if(geneSelectionArr.text()==""){
					msgDiv.html("You haven't selected any qualifiers")
				}
				else{
					var str="You have selected the following  qualifiers<br> ";
					var temp="";
					$.each(geneSelectionArr,function(){
					temp+=this.text;
					temp+="<br/>";
					});
					//console.log(temp);
					str+=temp;
					//console.log(str);
					msgDiv.html(str);

				}
}

/*$('.chzn-select-quailifier').on("change",function(){
displayQualif();
});*/
$("#geneForm").submit(function(e) {
displayKeywords();
displayQualif();
//$("#geneForm :selected").text();
    var url = "form.php"; // the script where you handle the form input.
	var notInclude="";
	dataInput=$("#geneForm").serialize();
	 dataInput+="&"+$('#query_type').val();
	 $('#geneForm input[type=checkbox]').each(function() {
			if($(this).is(':checked')){
				notInclude+='0';
				}else{
					notInclude+='1';
				}
	 });
	  dataInput+="&"+notInclude;
	 console.log(notInclude);
	console.log(dataInput);

    $.ajax({
           type: "POST",
           url: url,
           data: $("#geneForm").serialize(), // serializes the form's elements.
           success: function(data)
           {
               //alert(data); // show response from the php script.
           }
         });

    e.preventDefault(); // avoid to execute the actual submit of the form.
	 $.ajax({
    url: 'json/timegraphdata.json',
    type: 'POST',
    async: true,
    //dataType: "json",
    success: function (returnData) {
	console.log(returnData);
	jsonArray.push(returnData);
    timeGraphData();
    }
  });
});
/*var series=[];
for (var i=0 i< jsonArray.length; i++) {
    series.push(jsonArray[i].value);
   //timeGraphData(jsonArray[i])
}*/

function timeGraphData(returnData){
var lineChartConfig={
		credits: {
            enabled: false
        },
		chart: {
        // Edit chart spacing
        spacingBottom: 15,
        spacingTop: 10,
        spacingLeft: 10,
        spacingRight: 10,
        // Explicitly tell the width and height of a chart
        //width: 500,
       // height: 400
		},
        title: {
            text: 'Ratio of papers published related to your search criteria every year',
            x: -20 //center
        },
        xAxis: {
			title: {
                text: 'Year of publication'
            },
          //  categories: ['1995', '1996', '1997', '1998', '1999', '2000',
           //     '2001', '2002', '2003', '2004', '2005', //'2006','2007','2008','2009','2010','2011','2012','2013','2014','2015']
		   //categories:returnData.years
		   categories:[]
        },
        yAxis: {
            title: {
                text: 'Ratio of papers published'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
		series:[]
       /* series: [{
            name: 'Query 1',
			data:returnData.values
            //data: [0.3, 0.4, 0.65, 0.55, 0.45, 0.5, 0.63, 0.7, 0.74, 0.64, 0.5, 0.32,0.45, 0.5, 0.63, 0.7, 0.74, 0.64, 0.5, 0.32,0.45]
        },
		{
            name: 'Query 2',
			data:returnData.values2
		}]*/
    };
	lineChartConfig.xAxis.categories=jsonArray[0].years;
	lineChartConfig.series=jsonArray[0].values;
	$('#timeGraphContainer').highcharts(lineChartConfig);
	}
});



