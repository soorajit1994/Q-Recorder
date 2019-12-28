var attr_list=[];

var all_nodes=[];
var prev_temp_xpath='';
var count=0;
//var rx = /(?!\/|$)[^\/](([^])[^\/])/g;
var frequency_dict={};
var xpath_list=[];
var cleaned_xpath_dict={};
var cleaned_xpath_list=[];
var final_xpath_list=[];
function isHidden(el) {
    return (el.offsetParent === null)
}
function getXPathForElement(elm) {
//var attr_list=['id','class','name','placeholder','value','title','type'];       
 //var allNodes = document.getElementsByTagName('*');
        //console.log(attr_list);
//console.log(attributes_list);
var flag=0
for (var segs = []; elm && elm.nodeType == 1; elm = elm.parentNode)
{
for(l=0;l<attr_list.length;l++){
//console.log(attr_list[l]);

                    if (elm.hasAttribute(attr_list[l])) { 
                            segs.unshift(elm.localName.toLowerCase() + `[@${attr_list[l]}="` + elm.getAttribute(attr_list[l]) + '"]'); 
                            flag=1;
                            } 


    }
    flag=0;

    if (flag==0) { 
        for (i = 1, sib = elm.previousSibling; sib; sib = sib.previousSibling) { 
            if (sib.localName == elm.localName)  i++; }; 
            segs.unshift(elm.localName.toLowerCase() + '[' + i + ']'); 
    }; 
}; 
return segs.length ? '/' + segs.join('/') : null;
};

function get_xpath(){
    console.log(W);
    var arr=[];
    var siblings=[];
    var identifiers=[];
    var parent='';
    var nodes=[];
    var rx = /(?!\/|$)[^\/"]*(("[^"]*")[^\/"])/g;
    for(var i=0;i<W.length;i++){
    arr=(W[i]['XPATH'].match(rx));
    if (i==0){
    parent=W[i]['XPATH'];
    identifiers = (arr.filter(function (str) { return /\[@/.test(str); }));
    siblings=[];
    siblings.push(W[i]);
    }
    else{
    if(!arr[arr.length-1].match(/\[@/))
    {
    //console.log('a',W[i]);
    siblings.push(W[i]);
    }
    else if(W[i]['XPATH'].includes(parent) && identifiers!=arr.filter(function (str) { return /\[@/.test(str); }))
    {
    siblings.push(W[i]);
    
    }
    else if(!W[i]['XPATH'].includes(parent))
    {
    nodes=[];
    nodes.push(siblings);
    all_nodes.push(nodes);
    siblings=[];
    siblings.push(W[i]);
    parent=W[i]['XPATH'];
    identifiers =arr.filter(function (str) { return /\[@/.test(str); });
    
                            }
    
                }
                nodes=[];
                nodes.push(siblings);
    
    
    
        }
        all_nodes.push(nodes);
        console.log("\n\n\n\nAAL NODE))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))",all_nodes)
    
        for(var i=0;i<all_nodes.length;i++)
        {
              var outer_siblings=[];
              var count=0;
              //console.log('al'+all_nodes[i]);
              for(var j=0;j<all_nodes[i].length;j++)
              {
                      //console.log('oll'+all_nodes[i][j]);
                      if(typeof(all_nodes[i][j])==='object')
                          console.log('abc');
                      for(var k=0;k<all_nodes[i][j].length;k++)
                      {
                              var siblings=[];
                              xpaths=generate_xpath(all_nodes[i][j][k]['XPATH'],all_nodes[i][j][k]['TEXT'],count);
                              //console.log(xpaths,typeof(xpaths));
                            if(typeof(xpaths)==='object')
                                    siblings = siblings.concat(xpaths);
                            else
                                    siblings.push(xpaths);
    
                            outer_siblings.push(siblings);
                            count=count+1;
    
    
                      }
    
                      xpath_list.push(outer_siblings);
                      console.log(xpath_list);
              }
            //console.log(xpath_list);
        }
        console.log(xpath_list);
        xpath_frequency();
    
        Object.entries(frequency_dict).forEach(([key, value]) => {
                console.log(key, value);
                });
    
        cleaned_xpath();
        Object.entries(cleaned_xpath_dict).forEach(([key, value]) => {
                console.log(key, value);
                });
        get_the_final_xpath_list();
        console.log("finally",final_xpath_list[0]);
        if (final_xpath_list.length>0){
        return final_xpath_list[0]["XPATH"];
}
else{
        return [];
}
    };



    function generate_xpath(temp_xpath,text,i)
    {
    var xpath,xpath2='';
    var d={};
    var temp_xpath_list=[];
    if (i==0){
        var rx = /(?!\/|$)[^\/"]*(("[^"]*")[^\/"])/g;
    prev_temp_xpath=temp_xpath;
    arr=(temp_xpath.match(rx));
    var res = arr.filter(function (str) { return /\[@/.test(str); });
    if ((temp_xpath.match(/\[@/g) || []).length > 1){
    if (res.length>5)
    res=res.slice(-5);
    for( var j=0;j<res.length;j++){
    xpath='//'+res[j];
    try{
    if(getElementByXpath(xpath)){
    d={'XPATH':xpath,'TEXT':text};
    temp_xpath_list.push(d);
    }}
    catch(err){

        console.log(err)
    }
    }
    return(temp_xpath_list);
    }
    else if((temp_xpath.match(/\[@/g) || []).length == 1){
    xpath2='//'+res[0];
    try{
    if(getElementByXpath(xpath2)){
    d={'XPATH':xpath2,'TEXT':text};
    return(d);
    }}
    catch(err){

        console.log(err);
    }
    }
    }
    else{
        var rx = /(?!\/|$)[^\/"]*(("[^"]*")[^\/"])/g;
            arr=(temp_xpath.match(rx));
            var res = arr.filter(function (str) { return /\[@/.test(str); });
            if((temp_xpath.match(/\[@/g) || []).length > 1 && temp_xpath.includes(prev_temp_xpath)){
                    var inner_elements=arr[arr.length-1];
                    if(!inner_elements.match(/\[@/)){
                            var subscript_list=inner_elements.split("[");
                            if (res.length>5)
                                 res=res.slice(-5);
                            for(var j=0;j<res.length;j++){
                                    xpath="(//"+res[j]+"//"+subscript_list[0]+")["+subscript_list[1];
    
                                    try{
                                          if(getElementByXpath(xpath)){
                                                  d={'XPATH':xpath,'TEXT':text} ;
                                                  temp_xpath_list.push(d);
                                          }  
                                    }
                                    catch(err){
                                            console.log(err);
                                    }
                            }
                    }
    
                    else{
                            if (res.length>5)
                                 res=res.slice(-5);
                            for(var j=0;j<res.length;j++){
                                 xpath="//"+res[j];
                                 try{
                                          if(getElementByXpath(xpath)){
                                                  d={'XPATH':xpath,'TEXT':text} ;
                                                  temp_xpath_list.push(d);
                                          }  
                                    }
                                    catch(err){
                                            console.log(err);
                                    }
    
                            }
                    }
                    return temp_xpath_list;
            }
            else if((temp_xpath.match(/\[@/g) || []).length == 1){
                    var inner_elements=arr[arr.length-1];
                    if(!inner_elements.match(/\[@/)){
                            var subscript_list=inner_elements.split('[');
                            xpath2='(//'+res[0]+'//'+subscript_list[0]+')['+subscript_list[1];
    
                            try{
                                    if(getElementByXpath(xpath)){
                                            d={'XPATH':xpath2,'TEXT':text} ;
                                            return d;
                                    }
                            }
                            catch(err){
                                    console.log(err);
                            }
                    }
            }
    }
    };
    
    function xpath_frequency(){
    for(var i=0;i<xpath_list.length;i++){
    //console.log(xpath_list[i]);
    for(var j=0;j<xpath_list[i].length;j++){
    for(var k=0;k<xpath_list[i][j].length;k++){
    if (xpath_list[i][j][k]){
    if (xpath_list[i][j][k]['XPATH'].includes(']//')){
    
    var xpath_without=xpath_list[i][j][k]['XPATH'].split(')[');
    var xpath_without_index=xpath_without[0]+')';
                                        if (!(xpath_without_index in frequency_dict))
                                            frequency_dict[xpath_without_index]=1;
                                        else
                                            frequency_dict[xpath_without_index]=frequency_dict[xpath_without_index]+1;
                                    }
                                    else{
                                    //console.log('hence'+)
                                        if(!(xpath_list[i][j][k]['XPATH'] in frequency_dict))
                                            frequency_dict[xpath_list[i][j][k]['XPATH']]=1;
                                        else
                                            frequency_dict[xpath_list[i][j][k]['XPATH']]=frequency_dict[xpath_list[i][j][k]['XPATH']]+1;
                                    }
                            }
                    }
            }
    }
    };
    
    function cleaned_xpath(){
    for(var i=0;i<xpath_list.length;i++){
    var l1=[];
    for(var j=0;j<xpath_list[i].length;j++){
    var l2=[];
    for(var k=0;k<xpath_list[i][j].length;k++){
    if (xpath_list[i][j][k]){
    //console.log("got",xpath_list[i][j][k]);
    if (xpath_list[i][j][k]['XPATH'].includes("]//")){
    //console.log((xpath_list[i][j][k]['CONTENT']));
    var xpath_without=xpath_list[i][j][k]['XPATH'].split(")[");
    var xpath_without_index=xpath_without[0]+")";
    if (xpath_without_index in cleaned_xpath_dict === false){
    cleaned_xpath_dict[xpath_without_index]=1;
    var xpath='';
    var text='';
    //console.log("abc");
    if((getElemnetsByXpath(xpath_without_index)).length > 1){
    xpath=xpath_without_index+"[1]";
    
                                }
                                else{
                                        xpath=xpath_without_index;
                                }
                                var e= document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                                text=getText(e)
                                if (text.trim()!=="" && !isHidden(e)){
                                       var d={'XPATH':xpath,'TEXT':e.textContent};
                                       l2.push(d); 
                                }
    
                        }
                        if((getElemnetsByXpath(xpath_without_index)).length==frequency_dict[xpath_without_index] && cleaned_xpath_dict[xpath_without_index]
                        <frequency_dict[xpath_without_index] && ((getElemnetsByXpath(xpath_without_index)).length!=1)){
                                cleaned_xpath_dict[xpath_without_index]=cleaned_xpath_dict[xpath_without_index]+1;
                                //console.log("hi"+cleaned_xpath_dict[xpath_without_index]);
                                var xpath=xpath_without_index + "["+ cleaned_xpath_dict[xpath_without_index] +"]";
                                //console.log("xpath"+xpath);
                                //console.log("final_text",xpath.getText());
                                var e= document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                                var text=getText(e);
                                if (text.trim()!=="" && !isHidden(e)){
                                      d={'XPATH':xpath,'TEXT':e.textContent};
                                      l2.push(d);  
                                }
    
    
                        }
                        else if((getElemnetsByXpath(xpath_without_index)).length!=frequency_dict[xpath_without_index]){
                                //console.log('hqqq');
                                frequency_dict[xpath_without_index]=getElemnetsByXpath(xpath_without_index).length;
                                if (cleaned_xpath_dict[xpath_without_index]<frequency_dict[xpath_without_index]){
                                        cleaned_xpath_dict[xpath_without_index]=cleaned_xpath_dict[xpath_without_index]+1;
                                        var xpath=xpath_without_index + "["+ cleaned_xpath_dict[xpath_without_index] +"]";
                                        var e= document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                                        var text=getText(e);
                                        if (text.trim()!=="" && !isHidden(e)){
                                                d={'XPATH':xpath,'TEXT':e.textContent};
                                                l2.push(d);  
                                                }
    
                                }
                        }
                    }
    
                    else{
                        if (xpath_list[i][j][k]['XPATH'] in cleaned_xpath_dict === false){
                                cleaned_xpath_dict[xpath_list[i][j][k]['XPATH']]=1;
                                var xpath='';
                                var text='';
                                if((getElemnetsByXpath(xpath_list[i][j][k]['XPATH'])).length>1){
                                        xpath="(" + xpath_list[i][j][k]['XPATH']+ ")[1]";
                                }
                                else{
                                        xpath=xpath_list[i][j][k]['XPATH'];
                                }
                                var e= document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                                text=getText(e);
                                
                                if (text.trim()!==""&&!isHidden(e)){
                                      d={'XPATH':xpath,'TEXT':e.textContent};
                                      l2.push(d);  
                                }
                        }
                        if((getElemnetsByXpath(xpath_list[i][j][k]['XPATH'])).length==frequency_dict[xpath_list[i][j][k]['XPATH']] &&
                         cleaned_xpath_dict[xpath_list[i][j][k]['XPATH']]<frequency_dict[xpath_list[i][j][k]['XPATH']] && 
                         ((getElemnetsByXpath(xpath_list[i][j][k]['XPATH'])).length!=1)){
                                cleaned_xpath_dict[xpath_list[i][j][k]['XPATH']]=cleaned_xpath_dict[xpath_list[i][j][k]['XPATH']]+1;
                                //console.log("hi"+cleaned_xpath_dict[xpath_list[i][j][k]['XPATH']]);
                                var xpath="(" + xpath_list[i][j][k]['XPATH'] + ")["+ cleaned_xpath_dict[xpath_list[i][j][k]['XPATH']] +"]";
                                //console.log("xpath"+xpath);
                                //console.log("final_text",xpath.getText());
                                var e= document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                                var text=getText(e);
                                if (text.trim()!=="" &&!isHidden(e)){
                                      d={'XPATH':xpath,'TEXT':e.textContent};
                                      l2.push(d);  
                                }
                                
                        }
                        else if((getElemnetsByXpath(xpath_list[i][j][k]['XPATH'])).length!=frequency_dict[xpath_list[i][j][k]['XPATH']]){
                                //console.log('hqqqweer');
                                frequency_dict[xpath_list[i][j][k]['XPATH']]=getElemnetsByXpath(xpath_list[i][j][k]['XPATH']).length;
                                //console.log("qwerty"+frequency_dict[xpath_list[i][j][k]['XPATH']]);
                                if (cleaned_xpath_dict[xpath_list[i][j][k]['XPATH']]<frequency_dict[xpath_list[i][j][k]['XPATH']]){
                                        cleaned_xpath_dict[xpath_list[i][j][k]['XPATH']]=cleaned_xpath_dict[xpath_list[i][j][k]['XPATH']]+1;
                                        var xpath="(" + xpath_list[i][j][k]['XPATH'] + ")["+ cleaned_xpath_dict[xpath_list[i][j][k]['XPATH']] +"]";
                                        //console.log("xpath"+xpath);
                                        var e= document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                                        var text=getText(e);
                                        if (text.trim()!=="" && !isHidden(e)){
                                                d={'XPATH':xpath,'TEXT':e.textContent};
                                                l2.push(d);  
                                                }
                                        
    
                                }
                        }
                    }
                    console.log("thank u",l2);
                }
            }
            l1.push(l2);
        }
        cleaned_xpath_list.push(l1)
    }
    console.log("Clean Xpath List",cleaned_xpath_list);
    };
    
    function get_the_final_xpath_list(){
    for(var i=0;i<cleaned_xpath_list.length;i++){
    if (cleaned_xpath_list[i]!=[]){
    for(var j=0;j<cleaned_xpath_list[i].length;j++){
    if (cleaned_xpath_list[i][j]!=[]){
    var lowest_number=0;
    var d={};
    for(var k=0;k<cleaned_xpath_list[i][j].length;k++){
    var count=1;
    if(cleaned_xpath_list[i][j].length==1){
    if (cleaned_xpath_list[i][j][k]['XPATH'].includes('\//a[')){
    //console.log(YES!!!);
    if (cleaned_xpath_list[i][j][k]['XPATH'].includes('[@href')){
    final_xpath_list.push(cleaned_xpath_list[i][j][k]);
    
    }
                                                    }
    
                                                    else{
                                                        final_xpath_list.push(cleaned_xpath_list[i][j][k]);
                                                    }
                                                    break;
    
                                            }
                                            else{
                                                    if(cleaned_xpath_list[i][j][k]['XPATH'].includes('\//a[@href')){
                                                        final_xpath_list.push(cleaned_xpath_list[i][j][k]);
                                                        break;
                                                    }
                                                    else if(!(cleaned_xpath_list[i][j][k]['XPATH'].includes('\//a['))){
                                                        if(cleaned_xpath_list[i][j][k]['XPATH'].includes('\)[')){
                                                                var number=cleaned_xpath_list[i][j][k]['XPATH'].split(')[')[1].slice(0, -1);
                                                                if (lowest_number==0){
                                                                        lowest_number=number;
                                                                        Object.assign(d, cleaned_xpath_list[i][j][k]);
                                                                }
    
                                                                else if (number<lowest_number){
                                                                        lowest_number=number;
                                                                        Object.assign(d, cleaned_xpath_list[i][j][k]);
                                                                }
    
                                                        }
                                                        else{
                                                                if(cleaned_xpath_list[i][j][k]['XPATH'].includes('\@id')){
                                                                        Object.assign(d, cleaned_xpath_list[i][j][k]);
                                                                        break;
                                                                }
                                                                else if(cleaned_xpath_list[i][j][k]['XPATH'].includes('\@name')){
                                                                        Object.assign(d, cleaned_xpath_list[i][j][k]);
                                                                }
                                                                else if(cleaned_xpath_list[i][j][k]['XPATH'].includes('\@class')){
                                                                        if(d=={})
                                                                           Object.assign(d, cleaned_xpath_list[i][j][k]); 
                                                                }
                                                                else{
                                                                        if (count<cleaned_xpath_list[i][j].length){
                                                                            count=count+1;
                                                                            continue;
                                                                        }
                                                                        else{
                                                                             Object.assign(d, cleaned_xpath_list[i][j][k]); 
                                                                             break;
    
                                                                        }
    
                                                                }
                                                        }
                                                    }
                                            }
                                    }
                                    if (Object.keys(d).length != 0)
                                        final_xpath_list.push(d);
                            }
                    }
            }
    }
    };
    
    function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    //console.log(q.textContent);
    return q;
    };
    function getElemnetsByXpath(path){
    var results=[];
    try{
    var query=document.evaluate(path, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for(var i=0,length=query.snapshotLength;i<length;++i){
    results.push(query.snapshotItem(i));
    //console.log(text is,query.snapshotItem(i).textContent);
    }
    }
    
        catch(err){
                console.log("Wrong");
                results=[];
        }
    
        return results;
    };
    
    function getText(e){
    
    if(e.tagName==='DIV'){
        var TEXT=[].reduce.call(e.childNodes, function(a, b) { return a + (b.nodeType === 3 ? b.textContent : ''); }, '');
          }
          if(e.tagName==='IMG'||e.tagName==="I"||e.tagName==="ICON"){
              var TEXT="IMG"



          }
          if(e.tagName==='INPUT'||e.tagName==="TEXTAREA"||e.tagName==="SVG"||e.tagName==="IFRAME"||e.tagName==="CANVAS"||e.tagName==="SELECT"){

            var TEXT="INPUT"


          }
          else{
            var TEXT=[].reduce.call(e.childNodes, function(a, b) { return a + (b.nodeType === 3 ? b.textContent : ''); }, '');
          }
return TEXT;
    //return q;
    }
    
    function content(e){
        
                var TEXT=[].reduce.call(e.childNodes, function(a, b) { return a + (b.nodeType === 3 ? b.textContent : ''); }, '');
            
    return TEXT;
    };
    var W=[];
    function Last_SS(ee){
    var ELEMENTS=[];
    
    var rejected_attributes=['style','align','allow','autocapitalize','autocomplete','autofocus','autoplay','bgcolor','border','buffered','charset','checked','color','cols','colspan','contenteditable','controls','crossorigin','decoding','disabled','download','draggable','hidden','spellcheck','tabindex','translate','height','maxlength','max','min','sandbox','rowspan','width','size','aria-haspopup','aria-expanded','aria-labelledby','aria-label','datetime','aria-hidden','focusable','data','data-ga','data-google-query-id','onclick','onabort', 'onautocomplete', 'onautocompleteerror', 'onblur', 'oncancel', 'oncanplay', 'oncanplaythrough', 'onchange', 'onclick', 'onclose', 'oncontextmenu', 'oncuechange', 'ondblclick', 'ondrag', 'ondragend', 'ondragenter', 'ondragexit', 'ondragleave', 'ondragover', 'ondragstart', 'ondrop', 'ondurationchange', 'onemptied', 'onended', 'onerror', 'onfocus', 'oninput', 'oninvalid', 'onkeydown', 'onkeypress', 'onkeyup', 'onload', 'onloadeddata', 'onloadedmetadata', 'onloadstart', 'onmousedown', 'onmouseenter', 'onmouseleave', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'onmousewheel', 'onpause', 'onplay', 'onplaying', 'onprogress', 'onratechange', 'onreset', 'onresize', 'onscroll', 'onseeked', 'onseeking', 'onselect', 'onshow', 'onsort', 'onstalled', 'onsubmit', 'onsuspend', 'ontimeupdate', 'ontoggle', 'onvolumechange', 'onwaiting'];
    var rejected_tags=['SCRIPT','STYLE','NOSCRIPT','NOFRAME','TRACK','VIDEO','FONT','EVENTSOURCE','RECT','PATH','svg','path','circle'];

    var elements2= [ee];
    for (e=0;e<elements2.length;e++){
    var e2 = elements2[e];
    //console.log(hi+e2.attributes);
    if(!rejected_tags.includes(e2.tagName)){
    
                for (var i = 0, atts = e2.attributes, n = atts.length, arr = []; i < n; i++){
                    if(!attr_list.includes(atts[i].nodeName) && !rejected_attributes.includes(atts[i].nodeName)){
                            
                            attr_list.push(atts[i].nodeName);
                        }
                    }
                 
                var text=getText(elements2[e]);
                    if(text.trim()!==""&&!isHidden(elements2[e])){
                    var XPATH=getXPathForElement(elements2[e]);
                    //console.log(XPATH);
                    W.push({"XPATH":XPATH,"TEXT":elements2[e].textContent});    
                }
    
            }
    }
    //return W
    
   return  get_xpath();
}