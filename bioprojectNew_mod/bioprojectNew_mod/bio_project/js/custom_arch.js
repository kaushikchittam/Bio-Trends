$( document ).ready(function() {
var keywordList=$('.chzn-select');
var qualifList=$('.chzn-select-quailifier');
var opt="";
var qulifOpt="";
var dataInput="";
var mask;
//var jsonArray=[];
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
		 //console.log($("input[name='keyword']").val());
		 //console.log($('#geneForm input[name=keyword] option:selected').val());
	
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
			console.log(this.value);
				notInclude+='1';
				}else{
					notInclude+='0';
				}
		});
	dataInput+="&notInclude="+notInclude;
	//console.log(dataInput);
		/* $.post('/formSubmit', dataInput)
				.done(function(data){       
					//console.log(data);
					timeGraphData(data);						
				});*/
	$.ajax({
			type: "POST",
            url: "/formSubmit",
			data:dataInput,
           // dataType: "json",
            success: function (data) {
				timeGraphData(data);
			$('.container').removeClass('opaque-class');
				$('#wait').hide();
				
			},            
		beforeSend: function(){
		// Handle the beforeSend event
		//mask = $('<div class="DialogMask"></div>');
		//$('#browseMutations').append(mask);
		$('.container').addClass('opaque-class');
		$('#wait').show();
		},
		complete: function(){}
   
		});
		 
		 });
	

/*$("#geneForm").submit(function(e) {
	var notInclude="";
	$('#checkDiv').show();
	displayKeywords();
	displayQualif();
	count++;
	dataInput=$("#geneForm").serialize();
	console.log(dataInput);
	dataInput+="&"+$('#query_type').val();
	$('#geneForm input[type=checkbox]').each(function() {
			if($(this).is(':checked')){
				notInclude+='0';
				}else{
					notInclude+='1';
				}
	});
	dataInput+="&"+notInclude;
	console.log(dataInput);
	
    // avoid to execute the actual submit of the form.
//	if(count==1){
	/*$.ajax({
    url: '/generate',
    type: 'POST',
    async: true,
	//data:dataInput,
    //dataType: "jsonp",
    success: function (returnData) {
	console.log(returnData);
	//count++;
    timeGraphData(returnData);
	
    }
  });*/
   //{"keyword": $("input[name='keyword']").val()}
   /*$.post('../generator', {"keyword": $("input[name='keyword']").val()})
   .done(function(string) {
           
         //   $("#title").html(data['title']) ;
		 console.log(string);
		 alert(data);
	
		// timeGraphData(data);
           });
  /*} else if($("#checkPersist").is(":checked")){
	$.ajax({
    url: 'json/timegraphdata2.json',
    type: 'POST',
    async: true,
    //dataType: "json",
    success: function (returnData2) {
	console.log(returnData2);
    timeGraphData(returnData2);
    }
  });
  }*/
 // e.preventDefault(); 
//});
var chart;
var jsonArrayPrev=[];
var jsonPrevOneArr = [];
function timeGraphData(returnData){
	$('#checkPersist').off('change');
	
	$('#checkPersist').on('change',function(){
		if($(this).is(':checked')){
			jsonArrayPrev.push(returnData)
		}else{
			jsonArrayPrev = [];
		}
	});
//console.log(jsonArrayPrev);
 var chartConfig={
		credits: {
            enabled: false
        },
		chart: {
		renderTo: 'timeGraphContainer',
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
		   categories:returnData.years
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
	//chartConfig.series=[{name:'Query1',data:jsonArray[(jsonArray.length)-1].values}];

	//$('#checkPersist').on('change',function(){
			 //$("#timeGraphContainer").empty();
			 // var temp=[];
			  if($("#checkPersist").is(":checked")){
				  
                 jsonArrayPrev.push(returnData);
			// temp.push(jsonArrayPrev[(jsonArrayPrev.length)-2]);
				//  temp.push(returnData);
				 // console.log(jsonArray);
					var arr=[];
					//chartConfig.series=[];
					for (var i=0;i<jsonArrayPrev.length;i++){
						arr.push({name:'Query'+ (i+1),data:jsonArrayPrev[i].values});
						
						chartConfig.series=arr;
					if(i==4) {
				//alert('You have reached the maximum  no. of searches');
						//chartConfig.series=[];
						jsonArrayPrev=[];
						break;
					}
				}
					  
			}
			else{
				chartConfig.series=[{name:'Query1',data:returnData.values}];  
			}
			  
		 //});
		 
	chart=new Highcharts.Chart(chartConfig);
	
}
});

