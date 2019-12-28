var ku_locatorBuilders = new KULocatorBuilders(window);

function createXPathFromElement(element) {
    var allNodes = document.getElementsByTagName('*');
    for (var segs = []; element && element.nodeType == 1; element = element.parentNode) {
        if ((element.getAttribute('id') != null) && (element.getAttribute('id') !== '')) {
            var uniqueIdCount = 0;
            for (var n = 0; n < allNodes.length; n++) {
                if (((allNodes[n].getAttribute('id') != null) || (allNodes[n].getAttribute('id') !== ''))
                        && allNodes[n].id == element.id)
                    uniqueIdCount++;
                if (uniqueIdCount > 1)
                    break;
            }
            ;
            if (uniqueIdCount == 1) {
                segs.unshift('id("' + element.getAttribute('id') + '")');
                return segs.join('/');
            }
            if (element.nodeName) {
                segs.unshift(element.nodeName.toLowerCase() + '[@id="' + element.getAttribute('id') + '"]');
            }
        } else if ((element.getAttribute('class') != null) && (element.getAttribute('class') !== '')) {
            segs.unshift(element.nodeName.toLowerCase() + '[@class="' + element.getAttribute('class').trim() + '"]');
        } else {
            for (i = 1, sib = element.previousSibling; sib; sib = sib.previousSibling) {
                if (sib.nodeName == element.nodeName)
                    i++;
            }
            segs.unshift(element.nodeName.toLowerCase() + '[' + i + ']');
        }
        ;
    }
    ;
    return segs.length ? '/' + segs.join('/') : null;
};




function generate_TxtXpath(element){
    if(element.textContent.trim().length>16){
        var X="//*[contains(text(),'"+element.textContent.substring(0,16)+"')]";

    }
else{
   var X= "//*[text()='"+element.textContent+"']";
}


   try{
    var locator=getElementsByXPath(X);

    if(locator.length===1){


        return X;
    }
    else{

        return "";
    }
   }
   catch(e){


    return "";
   }


}



function isClickable(e){
    if(e.tagName==="I"||e.tagName==="SPAN"||e.tagName==="BUTTON"||e.tagName==="A"||e.tagName==="LABEL"||e.tagName==="IMG"||e.tagName==="SVG"||e.tagName==="DIV"||e.type==="button"||e.type==="submit"||e.hasAttribute("onclick")){

        return true;

    }
    else{
        return false;
    }



}

function getPageXY(element) {
    var x= 0, y= 0;
    while (element) {
        x+= element.offsetLeft;
        y+= element.offsetTop;
        element= element.offsetParent;
    }
    return [x, y];
}
function check_div(e){
    if(e.tagName==='DIV'){
            var TEXT=[].reduce.call(e.childNodes, function(a, b) { return a + (b.nodeType === 3 ? b.textContent : ''); }, '');
              }
              if(e.tagName==='IMG'){
                  var TEXT="IMG"



              }
              if(e.tagName==='INPUT'||e.tagName==="TEXTAREA"||e.tagName==="SVG"||e.tagName==="IFRAME"||e.tagName==="CANVAS"||e.tagName==="SELECT"){

                var TEXT="INPUT"


              }
              else{
                var TEXT=[].reduce.call(e.childNodes, function(a, b) { return a + (b.nodeType === 3 ? b.textContent : ''); }, '');
              }
    return TEXT;
    
    }
    function TagGen(e){


        if(e.getAttribute("type")==="checkbox"){

            return "CHECKBOX"


        }
        if(e.getAttribute("type")==="radio"){
            return "RADIO"


        }
        if(e.getAttribute("type")==="submit"){
            return "BUTTON"


        }
        if(e.getAttribute("type")==="button"){
            return "BUTTON"


        }
        else{
            return e.tagName.toUpperCase();
        }

        

    }
    function ObjectGen(e){
       var s=e.textContent.trim()
       if(s===""){
            if(e.getAttribute('value')){
            return e.getAttribute('value');
            }
            if(e.getAttribute('aria-label')){
                return e.getAttribute('aria-label');
                }
                if(e.getAttribute('placeholder')){
                    return e.getAttribute('placeholder');
                    }
            
            if(e.getAttribute('title')){
                return e.getAttribute('title');
            }
            if(e.getAttribute("name")){
                return e.getAttribute("name");
            }
            if(e.id!==""){
                return e.id
            }
            
            
            if(e.className!==""){
                return e.className;
            }
            if(e.getAttribute("type")){
                return e.getAttribute("type");
            }

       }
       else{
        var punctuationless = s.replace(/[.,\/#!$%\^&\*;:<>{}=\-_`~()]/g,"");
        var finalString = punctuationless.replace(/\s{2,}/g," ");
        var finalString=finalString.replace(/ /g,'').substring(0,15);
       /// console.log("Final String",finalString)
        return finalString.trim();}


    }
    function isHidden(el) {
        return (el.offsetParent === null)
    }

    function getPathToFailed(element) {
       
        
        if(element.id!==""){
            return "//*[@id='"+element.id+"']"
        }
        if (element===document.body){
        
            return element.tagName.toLowerCase();
        }
        


        
        
    
        var ix= 0;
        var siblings= element.parentNode.childNodes;
        for (var i= 0; i<siblings.length; i++) {
            var sibling= siblings[i];
            
            if (sibling===element){
            
            if(getPathToFailed(element.parentNode)==='body'){
                return 'html/'+getPathToFailed(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix + 1) + ']';
            }
            else{
            return getPathToFailed(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix + 1) + ']';
    
            }
    
            }
            
            if (sibling.nodeType===1 && sibling.tagName === element.tagName) {
                ix++;
            }
        }
    }




    
    function getPathToFailedHTML(element) {
       
        
       
        if (element===document.body){
        
            return element.tagName.toLowerCase();
        }
        else{



            if(element.id!==""){
                return "//*[@id='"+element.id+"']"
            }

            if(element.className!==""){
                return "//*[@class='"+element.className+"']"
            }
        }
        


        
        
    
        var ix= 0;
        var siblings= element.parentNode.childNodes;
        for (var i= 0; i<siblings.length; i++) {
            var sibling= siblings[i];
            
            if (sibling===element){
            
            if(getPathToFailedHTML(element.parentNode)==='body'){
                return 'html/'+getPathToFailedHTML(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix + 1) + ']';
            }
            else{
            return getPathToFailedHTML(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix + 1) + ']';
    
            }
    
            }
            
            if (sibling.nodeType===1 && sibling.tagName === element.tagName) {
                ix++;
            }
        }
    }
    function getPathTo(element) {
       
        
        
        if (element===document.body){
        
            return element.tagName.toLowerCase();
        }
        else{

            for(a=0;a<attribute_list.length;a++){
                if(element.getAttribute(attribute_list[a])){
                    

                   

                        return "//*[@"+attribute_list[a]+"='"+element.getAttribute(attribute_list[a])+"']"
                    

                    
                }


            }
            
        }
    
        var ix= 0;
        var siblings= element.parentNode.childNodes;
        for (var i= 0; i<siblings.length; i++) {
            var sibling= siblings[i];
            
            if (sibling===element){
            
            if(getPathTo(element.parentNode)==='body'){
                return 'html/'+getPathTo(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix + 1) + ']';
            }
            else{
            return getPathTo(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix + 1) + ']';
    
            }
    
            }
            
            if (sibling.nodeType===1 && sibling.tagName === element.tagName) {
                ix++;
            }
        }
    }
    
    function getPageXY(element) {
        var x= 0, y= 0;
        while (element) {
            x+= element.offsetLeft;
            y+= element.offsetTop;
            element= element.offsetParent;
        }
        return [x, y];
    }
    function getElementsByXPath(xpath, parent)
    {
        let results = [];
        let query = document.evaluate(xpath, parent || document,
            null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (let i = 0, length = query.snapshotLength; i < length; ++i) {
            results.push(query.snapshotItem(i));
        }
        return results;
    }
    ///FOR COLLECTION TAGS AND ATTRIBUTES  ///  
   var attributes=[];
   var tags=[];
   
   var rejected_tags=['SCRIPT','STYLE','NOSCRIPT','NOFRAME','TRACK','VIDEO','FONT','EVENTSOURCE','RECT','PATH','path','circle'];
   
   var rejected_attributes=['style','align','allow','autocapitalize','autocomplete','autofocus','autoplay','bgcolor','border','buffered','charset','checked','color','cols','colspan','contenteditable','controls','crossorigin','decoding','disabled','download','draggable','hidden','spellcheck','tabindex','translate','height','maxlength','max','min','sandbox','rowspan','width','size','aria-haspopup','aria-expanded','aria-labelledby','aria-label','datetime','aria-hidden','focusable','data','data-ga','data-google-query-id','onclick','onabort', 'onautocomplete', 'onautocompleteerror', 'onblur', 'oncancel', 'oncanplay', 'oncanplaythrough', 'onchange', 'onclick', 'onclose', 'oncontextmenu', 'oncuechange', 'ondblclick', 'ondrag', 'ondragend', 'ondragenter', 'ondragexit', 'ondragleave', 'ondragover', 'ondragstart', 'ondrop', 'ondurationchange', 'onemptied', 'onended', 'onerror', 'onfocus', 'oninput', 'oninvalid', 'onkeydown', 'onkeypress', 'onkeyup', 'onload', 'onloadeddata', 'onloadedmetadata', 'onloadstart', 'onmousedown', 'onmouseenter', 'onmouseleave', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'onmousewheel', 'onpause', 'onplay', 'onplaying', 'onprogress', 'onratechange', 'onreset', 'onresize', 'onscroll', 'onseeked', 'onseeking', 'onselect', 'onshow', 'onsort', 'onstalled', 'onsubmit', 'onsuspend', 'ontimeupdate', 'ontoggle', 'onvolumechange', 'onwaiting','d','title'];

var elements=document.body.getElementsByTagName("*");
    for(e=0;e<elements.length;e++){
            var el=elements[e];
        for (var i = 0, atts = el.attributes, n = atts.length, arr = []; i < n; i++){
            if(!rejected_attributes.includes(atts[i].nodeName)&&!/^\d+$/.test(atts[i].nodeValue)&&atts[i].nodeValue!=='true'&&atts[i].nodeValue!=='false'&&atts[i].nodeValue.toLowerCase!=='both'&&!attributes.includes(atts[i].nodeName)&&atts[i].nodeValue.length<60&&atts[i].nodeValue.trim()!==""){
            attributes.push(atts[i].nodeName);
            }
         }
        var tag=el.tagName;
        if(!rejected_tags.includes(tag)&&!tags.includes(tag)){
                tags.push(tag);
            }

      }
    
   console.log(attributes,tags);

////******************************/
var freq_dict={};
var inde=0;
    var results='False';
    var ALL=[];
    var XPATHS=[];
    var INSERTED_ELEMENTS=[];
    X=''
    var guessable_elements = tags;
    var attribute_list = attributes;
   
//############################RECORD MAINN XPATH#########################################///
    function Main(ELE){
    
        var elements=[ELE];
        
        
        
        for (e=0;e<elements.length;e++){
            try{
            if(guessable_elements.includes(elements[e].tagName)&&!elements[e].hasAttribute("type")||(elements[e].hasAttribute("type")&&elements[e].type!=="hidden"&&elements[e].type!=="HIDDEN")&&elements[e]!==null){
            for (attr=0;attr<attribute_list.length;attr++){
                
                if(elements[e].hasAttribute(attribute_list[attr])){
    
    
    
                ///console.log(attribute_list[attr])
                var X=guess_xpath(elements[e].tagName,attribute_list[attr],elements[e])
                ///console.log(X);
                var locator=getElementsByXPath(X);
                if (locator.length===1){
                ///console.log(locator[0].tagName)
                
               var TEXT=check_div(elements[e]);
                
                if(TEXT.trim()!==""&&!isHidden(locator[0])){
                var results='True';
                break;
                }
                }
                ///console.log( getElementsByXPath(X) );
    
                }
    
                }
    
    
            if (results=='True'&&X!==''){
                
                if(!INSERTED_ELEMENTS.includes(elements[e])){
                INSERTED_ELEMENTS.push(elements[e]);
                var Obj=elements[e].tagName.toLowerCase()+"_"+ObjectGen(elements[e])
                

                var TAG=TagGen(elements[e])
                var Z={"XPATH":X,"TEXT":elements[e].textContent.trim(),"OBJ":Obj,"TAG":TAG}
               
            ALL.push(Z);
            X=''
            results='False'}
            
    
    
            }
            else{
            ///console.log(elements[e]);
            var TEXT=check_div(elements[e]);
            if(TEXT.trim()!==""&&!isHidden(elements[e])){
            
            X=getPathTo(elements[e])
           console.log("WWWWWWWWWWWWWWWWWWWWQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ",X);
            if(!X.endsWith("']")&&!X.startsWith("html")){
                var PARENT=X.split("']")[0]+"']"    
                
                var TAIL=X.split("/").slice(-1)[0].split("[")[0] ;
                var PARENT_TAIL=PARENT+"//"+TAIL;
                var locator=getElementsByXPath(PARENT_TAIL);
    
                if(locator.length===1){
              
                X=PARENT_TAIL;
              
                var Obj=elements[e].tagName.toLowerCase()+"_"+ObjectGen(elements[e])
                var TAG=TagGen(elements[e])
                var Z={"XPATH":X,"TEXT":elements[e].textContent.trim(),"OBJ":Obj,"TAG":TAG}
                if(!INSERTED_ELEMENTS.includes(elements[e])){
                ALL.push(Z);
                INSERTED_ELEMENTS.push(elements[e])
                X=''
                results='False'}
                }
                else{
                    for(l=0;l<locator.length;l++){
                        if(locator[l]===elements[e]){
                        X="("+PARENT_TAIL+")["+String(l+1)+"]";
                        
                        var Obj=locator[l].tagName.toLowerCase()+"_"+ObjectGen(locator[l])
                        var TAG=TagGen(locator[l])
                         var Z={"XPATH":X,"TEXT":locator[l].textContent.trim(),"OBJ":Obj,"TAG":TAG}
                         if(!INSERTED_ELEMENTS.includes(locator[l])){
                        ALL.push(Z);
                        
                        INSERTED_ELEMENTS.push(locator[l])
                        X=''
                        results='False'}
                    }
                }




                }
            
            















































            
            }
            else{
                PX=getPathToFailed(elements[e])
                if(PX.startsWith("html")){
                    var F=getPathToFailedHTML(elements[e]);
                    console.log("HTML FAIL",F)
                    if(F.startsWith("html")){



                        var store=elements[e];
                    
                

                        
                        var X=F;
                       
                        var Obj=store.tagName.toLowerCase()+"_"+ObjectGen(store)
                        console.log("OBBJJ",Obj)
                        var TAG=TagGen(store)
                        console.log("TAGGGG",TAG)
                        var Z={"XPATH":X,"TEXT":store.textContent.trim(),"OBJ":Obj,"TAG":TAG}
    
                        if(!INSERTED_ELEMENTS.includes(store)){
                        ALL.push(Z);
                        INSERTED_ELEMENTS.push(store)
                        X=''
                        results='False'}
    

                    }


                    else{

                        var PARENT=F.split("']")[0]+"']"    
                
                var TAIL=F.split("/").slice(-1)[0].split("[")[0] ;
                var PARENT_TAIL=PARENT+"//"+TAIL;
                var locator=getElementsByXPath(PARENT_TAIL);
                        
                  
                   if(locator.length>1){


                    for(l=0;l<locator.length;l++){
                        if(locator[l]===elements[e]){
                        X="("+PARENT_TAIL+")["+String(l+1)+"]";
                        
                        var Obj=locator[l].tagName.toLowerCase()+"_"+ObjectGen(locator[l])
                        var TAG=TagGen(locator[l])
                         var Z={"XPATH":X,"TEXT":locator[l].textContent.trim(),"OBJ":Obj,"TAG":TAG}
                         if(!INSERTED_ELEMENTS.includes(locator[l])){
                        ALL.push(Z);
                        
                        INSERTED_ELEMENTS.push(locator[l])
                        X=''
                        results='False'}
                    }
                }


                   }

                   else{
                    X=PARENT_TAIL;
              
                    var Obj=elements[e].tagName.toLowerCase()+"_"+ObjectGen(elements[e])
                    var TAG=TagGen(elements[e])
                    var Z={"XPATH":X,"TEXT":elements[e].textContent.trim(),"OBJ":Obj,"TAG":TAG}
                    if(!INSERTED_ELEMENTS.includes(elements[e])){
                    ALL.push(Z);
                    INSERTED_ELEMENTS.push(elements[e])
                    X=''
                    results='False'}



                    
                   }
                }


                


                }

                else{
                    
                    var PARENT_ABS=PX.split("']")[0]+"']"
                    var PARENT_ABSO=X.split("']")[0]+"']"
                    var MERGED=PARENT_ABS+PARENT_ABSO
                    console.log("PFailed Initiallly",MERGED)
                    locator=getElementsByXPath(MERGED);
                    
                        for(l=0;l<locator.length;l++){
                            if(locator[l]===elements[e]){
                        X="("+MERGED+")["+String(l+1)+"]";
                        
                        
                        var Obj=locator[l].tagName.toLowerCase()+"_"+ObjectGen(locator[l])
                        var TAG=TagGen(locator[l])
                         var Z={"XPATH":X,"TEXT":locator[l].textContent.trim(),"OBJ":Obj,"TAG":TAG}
                         if(!INSERTED_ELEMENTS.includes(locator[l])){
                        ALL.push(Z);
                        INSERTED_ELEMENTS.push(locator[l])
                        X=''
                        results='False'}
                    }
                } 
                    
                }


                   
                   
                    

            }
            //*********************************************************** */
        }
    
    
            }
    
            }}
            catch(err){
                console.log("Q-MatePro Says: ",err,elements[e],freq_dict)
            }
            
    
    
        }
        
       
    function guess_xpath(tag,attr,element){
    
    
    
    var attr2=element.getAttribute(attr)
   
    
    
    
    
    if(attr==="href"){
        
        var XPATH="//"+tag.toLowerCase()+"[contains(@"+attr+",'"+attr2.substring(0,25)+"')]"

    }
    else{
    var XPATH='//'+tag.toLowerCase()+"[@"+attr+"='"+attr2+"']"
    }
    return XPATH;
    }
   /// console.log(ALL);
    
    return ALL;
}
//############################END#########################################///


var elem='';
document.body.addEventListener("click", ClickListenner);
document.body.addEventListener("focusout",EnterEventListenner)
document.body.addEventListener("change",changeEventListenner)
document.body.addEventListener('mouseover', MouseInListenerFunction,true);
    document.body.addEventListener('mouseout', MouseOutListenerFunction,true);


    function MouseInListenerFunction(event){
        event.target.style.border = '0.2em solid #0066cc';
        var x=getPathToFailed(event.target);
        event.target.title = x;
        
        }
        function MouseOutListenerFunction(event){
            event.target.style.border = '';
           
            }
function ClickListenner(event){
    if(isClickable(event.target)){
    if(event.target.hasAttribute('href')){
        console.log("HREF>>>>",event.target.getAttribute("href"))
        event.preventDefault();
        var Xpath=Main(event.target);

if(Xpath.length!==0){
    var data=Xpath[0]
    data["EVENT"]="Click"
    data["TESTDATA"]=""
    
    var txy=getPageXY(event.target)
    
    data['LOCATION']=txy[0]+"/"+txy[1];
   
    data['PARENTNODE']=event.target.parentElement.nodeName;
    var other_xpaths = ku_locatorBuilders.buildAll(event.target);
    var full_xpath=createXPathFromElement(event.target);
    
    other_xpaths["xpath:full"]=[full_xpath];
    if(event.target.textContent.trim()!==""){
        var text_xpath=generate_TxtXpath(event.target);
        if(text_xpath!==""){
            other_xpaths["xpath:text"]=[text_xpath];
        }
    
    
    }
    data["OTHER_XPATHS"]=other_xpaths;
sessionStorage.setItem("element", JSON.stringify(data));}
var delayInMilliseconds = 1000; //1 second

setTimeout(function() {
   
    window.location.href = event.target.getAttribute('href');
}, delayInMilliseconds);
}
else{
    var Xpath=Main(event.target);
   /// console.log(Xpath);
    if(Xpath.length!==0){
    var data=Xpath[0]
    data["TESTDATA"]=""
    
    var txy=getPageXY(event.target)
    
    data['LOCATION']=txy[0]+"/"+txy[1];
   
    data['PARENTNODE']=event.target.parentElement.nodeName;
    var other_xpaths = ku_locatorBuilders.buildAll(event.target);
    var full_xpath=createXPathFromElement(event.target);
    other_xpaths["xpath:full"]=[full_xpath];
    if(event.target.textContent.trim()!==""){
        var text_xpath=generate_TxtXpath(event.target);
        if(text_xpath!==""){
            other_xpaths["xpath:text"]=[text_xpath];
        }
    
    
    }
    data["OTHER_XPATHS"]=other_xpaths;
    event.detail === 2?data["EVENT"]="DoubleClick":data["EVENT"]="Click";
    
    sessionStorage.setItem("element", JSON.stringify(data));}
    }
}
    }
    
   /// sessionStorage.setItem("element", String(getPathToFailed(event.target)));


function EnterEventListenner(event){
if(event.target.tagName==="INPUT"||event.target.tagName==="TEXTAREA"&& event.target.type!=="button"||event.target.type!=="submit"){
    console.log(event.target,event.target.value)
if(event.target.value.trim()!==""){

    var Xpath=Main(event.target);
    ///console.log(Xpath);
    if(Xpath.length!==0){
        var data=Xpath[0];
        data["EVENT"]="sendKeys";
        data["TESTDATA"]=event.target.value;
       
        var txy=getPageXY(event.target)
        
        data['LOCATION']=txy[0]+"/"+txy[1];
       
        data['PARENTNODE']=event.target.parentElement.nodeName;
        var other_xpaths = ku_locatorBuilders.buildAll(event.target);
        var full_xpath=createXPathFromElement(event.target);
        other_xpaths["xpath:full"]=[full_xpath];
        if(event.target.hasAttribute("placeholder")){

            data["TEXT"]=event.target.getAttribute("placeholder");
        }
        

        data["OTHER_XPATHS"]=other_xpaths;
    sessionStorage.setItem("element", JSON.stringify(data))}
}

}
}



function changeEventListenner(event){
if(event.target.tagName==="SELECT"&&event.target.value!==""){

////console.log(event.target.value);
var Xpath=Main(event.target);
    ///console.log(Xpath);
    if(Xpath.length!==0){
        var data=Xpath[0];
        data["EVENT"]="Select"
        data["TESTDATA"]=event.target.value;
       
        var txy=getPageXY(event.target)
        
        data['LOCATION']=txy[0]+"/"+txy[1];
        
        data['PARENTNODE']=event.target.parentElement.nodeName;
        var other_xpaths = ku_locatorBuilders.buildAll(event.target);
        var full_xpath=createXPathFromElement(event.target);
        other_xpaths["xpath:full"]=[full_xpath];
        data["OTHER_XPATHS"]=other_xpaths;
    sessionStorage.setItem("element", JSON.stringify(data))}
    
}



}







if(!document.hidden){

    var X=sessionStorage.getItem("element");
    if (X){
    sessionStorage.setItem("element", "");
    }
    return X;
}
else{
    return "HIDDEN"
}

////RETURNINGGGGGGGGGGGGGG
