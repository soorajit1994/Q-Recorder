var data={}

        
        

let oldXHROpen = window.XMLHttpRequest.prototype.open;
window.XMLHttpRequest.prototype.open = function(method, url, async, user, password) {

 //console.log(url,method,url,async,user,password)
 data["METHOD"]=method
data["URL"]=url


 this.addEventListener('readystatechange', function() {
   var headers = this.getAllResponseHeaders();

   /// alert("WWWWWWWWWWWWWWWWWWWWWWWWWWW",headers.trim().split("status:"));
    data["STATUS"]=this.status;
    

    var arr = headers.split('\r\n');
    var h= arr.reduce(function (acc, current, i){
          var parts = current.split(': ');
          acc[parts[0]] = parts[1];
          return acc;
    }, {});
    data["RESPONSE"]=JSON.stringify(h,null,2) 
    sessionStorage.setItem("elementapi", JSON.stringify(data))
    
   
     });          
 return oldXHROpen.apply(this, arguments);
}
    
    










    var X=sessionStorage.getItem("elementapi");
    if (X){
    sessionStorage.setItem("elementapi", "");
    }
    return X;

////RETURNINGGGGGGGGGGGGGG
