import selenium
import seleniumwire
from seleniumwire import webdriver  # Import from seleniumwire
from ast import literal_eval
import json
#from selenium.webdriver.chrome.options import Options
driver=''
req=[]
UTILS=open("utils.js").read()
ATOMS=open("atoms.js").read()
KAR=open("kar.js").read()
JQUERY=open("jquery-3.2.1.min.js").read()
SELENIUM_BROWSER_BOT=open("selenium-browserbot.js").read()
SELENIUM_API=open("selenium-api.js").read()
SELENIUM_COMMAND=open("selenium-commandhandlers.js").read()
USER_EXTENSION=open("user_extension.js").read()
BOWSER=open("bowser.js").read()
DOM_COLLECTOR=open("dom_collector.js").read()
KU_RECORDER=open("ku-recorder.js").read()
KU_LOCATOR_BUILDER=open("ku-locatorBuilders.js").read()
NEIGHBOUR_GEN=open("neighbor-xpaths-generator.js").read()
NEIGHBOUR_MIN=open("neighbor-xpaths-generator.min.js").read()
recordJs2=open("recordJS.js").read()
smart_xpath=open("smart_xpath.js").read()
recordJs=JQUERY+NEIGHBOUR_MIN+NEIGHBOUR_GEN+UTILS+SELENIUM_COMMAND+SELENIUM_BROWSER_BOT+ATOMS+KU_LOCATOR_BUILDER+smart_xpath+open("recordJS2.js").read()

ext_tuple=('.mp3', '.avi','.js','.css','.less','.scss','.png','.ico','.txt','.ini','.jpg','.mp4','xls','.doc','xlsx','.ppt','.pptx','.docx','.json','.java','.as','.mx','.asp','.ts','.jsp','.svg','.php','.xml','.xaml',
          '.yml' ,'.woff2','.jpeg')
def check_valid_api(request):
    global req
   
    if not any(word in request.path for word in ext_tuple):
           return True
    else:
        #print(str(request.path))
        return False
def locate(xpath):

    global driver
    try:
        element=driver.find_element_by_xpath(xpath)
        driver.execute_script("arguments[0].style.border = '0.2em solid #0d274c';",element)
        return "PASS"
    except:
        return "FAIL"

def initiate_driver(url):
    global driver
    #options = webdriver.ChromeOptions()
    #options.add_experimental_option('debuggerAddress', 'localhost:9014')
    driver = webdriver.Chrome(executable_path ="chromedriver.exe",seleniumwire_options={'port': 9014})
    driver.get(url)
def Merge(dict1, dict2): 
    return(dict2.update(dict1)) 
def Q_recorder():

    global driver
    global recordJs
    Xpath=None
    data={}
    try:
        Xpath=driver.execute_script(recordJs)
    except selenium.common.exceptions.NoSuchWindowException:
        driver.switch_to_window(driver.window_handles[-1])
    if Xpath=="HIDDEN":
        driver.switch_to_window(driver.window_handles[-1])
    return Xpath


    
        

    
    
        
    
def Q_recorder_api():
    global req

    global driver
    global recordJs2
    
    data={}
    
        
    try:

        for request in driver.requests:  
              
        
            if check_valid_api(request):
                if (request.body is None):
                    BODY="{}"
                
                else:
                    JSON=request.body.decode('utf-8',errors='ignore').replace("'", '"')
                    try:
                    
                        BODY=json.dumps(json.loads(JSON),indent=4)
                    except:
                    
                        BODY=JSON

                data["METHOD"]=request.method
                data["PATH"]=request.path
            
                data["REQUEST"]="Headers: "+json.dumps(dict(request.headers),indent=4)+"<br>Body: "+BODY
                if (request.response is None):
                    data["RESPONSE"]='{"status_code":"","reason":"","body":""}'
                
                else:
                    if (request.response.body is None):
                        RES_BODY="{}"
                    else:
                        try:
                            RES_BODY=request.response.body.decode('utf-8',errors='ignore')
                        except:
                            RES_BODY=request.response.body
                    data["RESPONSE"]=json.dumps({"status_code":request.response.status_code,"reason":request.response.reason,"body":RES_BODY},indent=4)
            else:
                pass
            
    except seleniumwire.proxy.client.ProxyException:
        driver.switch_to_window(driver.window_handles[-1])
    
    print(data)
    return data
def getCurrentUrl():
    global driver
    return driver.current_url
def stop():
    global driver
    JS='''



document.body.addEventListener('mouseover', MouseInListenerFunction,true);
    


    function MouseInListenerFunction(event){
       event.target.style.border = '';
        
        }
        


    '''
    driver.execute_script(JS)
    
    return "STOPPED"
def stop_api():
    global req
    req=[]
    global driver
    JS='''


        

let oldXHROpen = '';

        


    '''
    driver.execute_script(JS)
    return "STOPPED"
def main():
    global driver
    
        
    #driver.switch_to.window()
    JS=open('get_ALL2.js').read()
    event_attributes=open('event_attributes.txt').read().split(", ")
    
    windows=driver.window_handles
    
        
    for handle in windows:
        driver.switch_to.window(handle)
        
        if(str(driver.title).strip()==""):
            windows.remove(handle)
    
    print(windows)
    if(len(windows)==0):
        return "NOWINDOW"
    driver.switch_to.window(windows[-1])
    A=driver.execute_script(JS,event_attributes)
      
    #JS11=open('smart_xpath.js').read()
    #driver.execute_script(JS11)
    #print(A)
    return A
def pageLocatorCreation(name,xpath):
    
    i = 0 
    L = "import org.openqa.selenium.WebElement;\n" 
    L+="import org.openqa.selenium.support.FindBy;\n"
    L+="import org.openqa.selenium.support.PageFactory;\n\n"
    L+="public class PageLocators {\n"
    length = len(name)
    while i < length:
        variableName=name[i].replace(' ','_')
        L+="\t@FindBy(xpath=\""+ xpath[i] + "\")\n"
        L+="\tpublic WebElement " + variableName + ";\n\n"
        i = i + 1
    L+="\tpublic PageLocators()\n\t{\n"
    L+="\tPageFactory.initElements(/*Please specify driver*/,this);\n\t}\n}"
    print(L)
    return L
def pageActionCreation(tag,name,xpath):
    objName="obj_PageLocators"
    L="import PageLocators.PageLocators;\n\n\n"
    L+="public class PageActions {\n\n"
    L+="\tPageLocators"+" "+objName+" =new PageLocators();\n\n"
    print(tag)
    for t in range(0,len(tag)):
        print(t,tag[t])
        
        if(tag[t]=="INPUT"or tag[t]=="TEXTAREA"):
            L+="\tpublic void method_"+name[t]+"(String data) throws InterruptedException(){\n"
            L+="\t\t"+objName+"."+name[t]+".sendKeys(data);\n"
            L+="\t}\n\n"
        elif(tag[t]=="SELECT"):
            L+="\tpublic void method_"+name[t]+"(value) throws InterruptedException(){\n"
            L+="\t\tSelect dropdown= new Select("+objName+"."+name[t]+");\n"
            L+="\t\tdropdown.selectByVisibleText(value);\n"
            L+="\t}\n\n"
        
            
        elif(tag[t]=="BUTTON" or tag[t]=="RADIO" or tag[t]=="CHECKBOX" or tag[t]=="A" or tag[t]=="LABEL"):

            L+="\tpublic void method_"+name[t]+"() throws InterruptedException(){\n"
            L+="\t\t"+objName+"."+name[t]+".click();\n"
        
            L+="\t}\n\n"
        else:
            L+="\tpublic void method_"+name[t]+"() throws InterruptedException(){\n"
            L+="\t\t"+objName+"."+name[t]+".getText();\n"
            L+="\t}\n\n"
        
    L+="}"
    return L

def quit():
    global driver
    driver.quit()
