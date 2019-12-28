var xpath_dataRec=[];
var xpath_dataRec_api=[];
var Training_Data=[];
var APIS=[];
var flag_api=0;
var XPATHS=[];

$('#stop').hide();
var watch = (function(){
    var timer = document.getElementById("timer");
    var stop = document.getElementById("stop");
    var reset = document.getElementById("reset");
    var time = "00:00"
    var seconds = 0;
    var minutes = 0;
    var t;
  
    timer.textContent = time;
  
    function buildTimer () {
      seconds++;
          if (seconds >= 60) {
              seconds = 0;
              minutes++;
              if (minutes >= 60) {
                  minutes = 0;
                  seconds = 0;
              }
          }
      timer.textContent = (minutes < 10 ? "0" + minutes.toString(): minutes) + ":" + (seconds < 10 ? "0" + seconds.toString(): seconds);
        


         try{
          $.getJSON('/QRec', {
				  
            track:"Hello",
         }, function(data) {
         var row_data=data.data;
         
        
            row_data=JSON.parse(row_data);
            
            console.log(row_data)
            if(row_data!==null&&row_data.length!==0){
            if(row_data["EVENT"]!==undefined&&!XPATHS.includes(row_data["XPATH"])){
            var table = document.getElementById('myTable').getElementsByTagName('tbody')[0];
            var row = table.insertRow(-1);
            ///var cell1 = row.insertCell(-1);
            
            row.innerHTML = '<tr><td class="text-left">'+row_data["EVENT"]+'</td><td class="text-left">'+row_data["XPATH"]+'</td></tr>'
            Training_Data.push(row_data);
            
            xpath_dataRec.push({"XPATH":row_data["XPATH"],"OBJ":row_data["OBJ"],"EVENT":row_data["EVENT"],"TESTDATA":row_data["TESTDATA"],"TEXT":row_data["TEXT"]});
            XPATHS.push(row_data["XPATH"]);
            }
          }
         

        });


     }
     catch(err){
      $.notify("Q-Recorder says:"+err, "error");
      console.log(err);
      $("#stop").trigger("click");
      
      $.getJSON('/QRec_Stop', {
				  
        track:"Hello",
     }, function(data) {


     });

     }
    }
    function stopTimer () {
      stop.addEventListener("click", function(){
        clearTimeout(t);
        timer.textContent = time;
        seconds = 0; minutes = 0;
        $('#stop').hide();
        $('#start').show();
        
        $.getJSON('/QRec_Stop', {
				  
          track:"Hello",
       }, function(data) {
         ///
  
  
       });
        
      })
     
    }
    function startTimer () {
      start.addEventListener("click", function(){
        clearTimeout(t);
        t = setInterval(buildTimer,1000);
        $('#start').hide();
        $('#stop').show();
      });
      
    }
    
    return {
      start: startTimer(),
      stop: stopTimer()
      
    };
  })()
  window.onscroll = function() {myFunction()};

var navbar = document.getElementById("navbar");
var sticky = navbar.offsetTop;

function myFunction() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky")
  } else {
    navbar.classList.remove("sticky");
  }
}

window.addEventListener("beforeunload", function (e) {
    var confirmationMessage = "\o/";
  
    (e || window.event).returnValue = confirmationMessage; //Gecko + IE
    return confirmationMessage;                            //Webkit, Safari, Chrome
  });


  function convertArrayOfObjectsToCSVRec(args) {
    var result, ctr, keys, columnDelimiter, lineDelimiter, data;

    data = args.data || null;
    if (data == null || !data.length) {
        return null;
    }

    columnDelimiter = args.columnDelimiter || ',';
    lineDelimiter = args.lineDelimiter || '\n';

    keys = Object.keys(data[0]);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    data.forEach(function(item) {
        ctr = 0;
        keys.forEach(function(key) {
            if (ctr > 0) result += columnDelimiter;

            result += item[key];
            ctr++;
        });
        result += lineDelimiter;
    });

    return result;
}
function convertArrayOfObjectsToCSVRec_api(args) {
  var result, ctr, keys, columnDelimiter, lineDelimiter, data;

  data = args.data || null;
  if (data == null || !data.length) {
      return null;
  }

  columnDelimiter = args.columnDelimiter || ',';
  lineDelimiter = args.lineDelimiter || '\n';

  keys = Object.keys(data[0]);

  result = '';
  result += keys.join(columnDelimiter);
  result += lineDelimiter;

  data.forEach(function(item) {
      ctr = 0;
      keys.forEach(function(key) {
          if (ctr > 0) result += columnDelimiter;

          result += item[key];
          ctr++;
      });
      result += lineDelimiter;
  });

  return result;
}
function downloadCSVRec(args) {
  if(xpath_dataRec.length===0){

    $.notify("Empty Recordings", "warn");
  }
  else{

  $('#myModal').modal('show'); 
  /*
    var data, filename, link;

    var csv = convertArrayOfObjectsToCSVRec({
        data: xpath_dataRec
    });
    if (csv == null) return;

    filename = args.filename || 'export.csv';

    if (!csv.match(/^data:text\/csv/i)) {
        csv = 'data:text/csv;charset=utf-8,' + csv;
    }
    data = encodeURI(csv);

    link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    link.click();
    */
  }
   
}


function Training_Data_Save(args) {
  var filename=$('input[name=train]').val()
  if(filename.trim().length===0){

    $.notify("Name is missing", "warn");
  }
  else{

    console.log(Training_Data);
    $.getJSON('/Train_save', {
				  
      data:JSON.stringify(Training_Data),
      filename: filename,
   }, function(data) {
    if(data.data=="duplicate"){

      $.notify("Duplicate Name not Allowed", "error");


    }

    else{
      $.notify("Trained", "success");

/*     var data, filename2, link;

     var csv = convertArrayOfObjectsToCSVRec({
         data: xpath_dataRec
     });
     if (csv == null) return;
 
     filename2 = filename+".csv";
 
     if (!csv.match(/^data:text\/csv/i)) {
         csv = 'data:text/csv;charset=utf-8,' + csv;
     }
     data = encodeURI(csv);
 
     link = document.createElement('a');
     link.setAttribute('href', data);
     link.setAttribute('download', filename2);
     link.click();

     */
    }


   });
  
}
}





// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}





function EraseRec(){

   xpath_dataRec=[];
   APIS=[];
   Training_Data=[];

   XPATHS=[];
   $("#myTable").find("tr:gt(2)").remove();
   

}


function myFunction_URL(){


  var x = document.getElementById("url");
  document.getElementById("GOURL").innerText = x.value;


}

function Launch(){


  document.getElementById("GOURL").innerText =$('input[name=url]').val();
  $.getJSON('/to_browse', {
    chat: $('input[name=url]').val(),
  }, function(data) {
    if(data.status==="FAIL"){
      
      $.notify("Browser Already Launched", "error");
    }
    $('#launch').prop('disabled', false);

});
}
