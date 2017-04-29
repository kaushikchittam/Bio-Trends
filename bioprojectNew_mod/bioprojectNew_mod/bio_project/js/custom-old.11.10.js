$( document ).ready(function() {
var keywordList=$('.chzn-select');
var qualifList=$('.chzn-select-quailifier');
var opt="";
var qulifOpt="";
var dataInput="";
var mask;
var jsonArray=[];
//var count=0;
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

$('#addButton').on('click',function(){

var markup='<select name="keyword" data-placeholder="Select a keyword" class="chzn-select" style="width:250px;"><option name="" value=""></option></select> <select name="keywordQualifer" data-placeholder="Select a qualifier" class="chzn-select-quailifier" style="width:250px;" tabindex="3"><option name="" value=""></option></select><input type="checkbox" id="cbox2"name="notInclude"> <label for="cbox2">Not Include</label><br><br>';
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
					str+=temp;
					msgDiv.html(str);

				}
}
$(document).on('change', ".chzn-select", function () {
      
	if($('.chzn-select option').is(':selected')){
	$(".chzn-select-quailifier").attr('disabled', false).trigger("chosen:updated");
	}else{
	$(".chzn-select-quailifier").attr('disabled', false).trigger("chosen:updated");
	}
});

$('#resetBtn').click(function(){
    $(".chzn-select,.chzn-select-quailifier").val('').trigger("chosen:updated");
	$('#submitBtn').attr('disabled', 'disabled'); 
});

$('select[name="keyword"]').on('change',function(){
	
	//alert("hii");
	if ($('select[name="keyword"]').val() != '') {
        //alert("hii");
		 $('#submitBtn').removeAttr('disabled');
    }
	else{
		$('#submitBtn').attr('disabled', 'disabled'); 
	}
	
});

/* form submision*/
 $('#submitBtn').on('click',function(e){
		 e.preventDefault();	
		 var notInclude="";
		 $('#checkDiv').show();
		 displayKeywords();
		 displayQualif();
		 //count++;
		 dataInput=$("#geneForm").serialize();
		 //console.log(dataInput);
		//alert($('input[name=keyword]').val());
		$('#geneForm input[name=notInclude]').each(function() {
				
			if($(this).is(':checked')){
			//console.log(this.value);
				notInclude+='0';
				}else{
					notInclude+='1';
				}
		});
	dataInput+="&notInclude="+notInclude;
		console.log(dataInput);
		 $.post('/formSubmit', dataInput)
				.done(function(data){
					alert('data');
					console.log(data);
					mapData(data);
					timeGraphData(data.gr);
					
				});
		 
		 });
var chart;
var jsonArrayPrev=[];
var chartConfig={
		credits: {
            enabled: false
        },
		chart: {
		renderTo: 'timeGraphContainer',
        spacingBottom: 15,
        spacingTop: 10,
        spacingLeft: 10,
        spacingRight: 10
		},
        title: {
            text: 'Ratio of papers published related to your search criteria every year',
            x: -20 //center
        },
        xAxis: {
			title: {
                text: 'Year of publication'
            }
		   //categories:returnData.years
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
        }
		
        //series: [{data:jsonArray[0].values}]
    };
function timeGraphData(returnData){
	jsonArrayPrev.push(returnData);
	console.log(jsonArrayPrev);
	chartConfig.xAxis.categories=returnData.years;
	chartConfig.series=[{name:'Query1',data:returnData.values}];  				 
	chart=new Highcharts.Chart(chartConfig);	
}

function mapData(returnData){
	console.log('this is map');
	google.charts.setOnLoadCallback(drawRegionsMap([
          ['Country', 'Ratio'],
          ['Germany', 0.5],
          ['United States', 0.7],
          ['Brazil', 0.2],
          ['Canada', 0.3],
          ['France', 0.4],
          ['RU', 0.4]
        ]));
}


	$('#checkPersist').on('change',function(e){
				var evt= e.target;
				if($(evt).is(":checked")&&$(evt).hasClass("checkPersist")){
				 // jsonArray.push(jsonArrayPrev[(jsonArrayPrev.length)-2]);
				 //jsonArray.push(returnData);
				 //console.log(jsonArray);
					//var arr=[];
					//chart.series=[];
					//for (var i=0;i<jsonArrayPrev.length;i++){
					//	arr.push({name:'Query'+ (i+1),data:jsonArrayPrev[i].values});
						//chart.series=arr;
						
						chart.addSeries({name:'Query2',data:jsonArrayPrev[(jsonArrayPrev.length)-1].values},true);
						
					/*if(i==4) {
						//alert('You have reached the maximum  no. of searches');
						//chartConfig.series=[];
						jsonArrayPrev=[];
						break;
					}*/
				//}					  
			}
			//chart.redraw();	//chart.se();
	});	
});

