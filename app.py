import json

from flask import Flask, render_template,redirect,jsonify
from flask import request
import selenium
from flask import *  
import difflib
import os
import PL_PA
import ast
import json
import requests
import socket

import pandas as pd
app = Flask(__name__)
app.secret_key = "abc"
import ast

import pymongo
client = pymongo.MongoClient("localhost", 27017)
db = client.smarthealer



@app.route('/to_browse')
def to_browse():
        url=request.args.get('chat', 0, type=str)
        s=socket.socket(socket.AF_INET,socket.SOCK_STREAM)
        result=s.connect_ex(('127.0.0.1',9014))
        if result==0:
            try:
                
                PL_PA.quit()
                PL_PA.initiate_driver(url)
                print("Ok")
                return jsonify(status="PASS")
            except Exception as e:
                print(e)
                return jsonify(status="FAIL")
            s.close()
        else:
            s.close()
            #cmd = 'start chrome -remote-debugging-port=9014 --user-data-dir="D:\chrome"'
            #os.popen(cmd)
            PL_PA.initiate_driver(url)
            print("Ok")
            return jsonify(status="PASS")
@app.route('/',methods=['GET', 'POST'])
def recorder():
        
        return render_template('recorder/recorder.html',myurl="URL")
    
   
@app.route('/QRec',methods=['GET', 'POST'])
def QRec():
   
        data=PL_PA.Q_recorder()
        
        return jsonify(data=data)
    
    
        
@app.route('/QRec_api_save',methods=['GET', 'POST'])
def QRec_api_save():
        liststring=request.get_json()
        print(liststring)
        d = liststring
        df=pd.DataFrame(d)
        import os
        dirname = os.path.dirname(__file__)
        filename = os.path.join(dirname, 'static\\api_data\\recordedapi.xlsx')
        df.to_excel(filename, index=False)
        return jsonify(data="saved")
@app.route('/QRec_api',methods=['GET', 'POST'])
def QRec_api():
    try:
        data=PL_PA.Q_recorder_api()
        return jsonify(data=data)
    except AttributeError:
        data="STOP"
        return jsonify(data=data)
    except selenium.common.exceptions.WebDriverException:
        data="STOP"
        return jsonify(data=data)

@app.route('/QRec_Stop',methods=['GET', 'POST'])
def QRec_Stop():
    PL_PA.stop()
    data="Stopped"
    return jsonify(data=data)

@app.route('/QRec_Stop_api',methods=['GET', 'POST'])
def QRec_Stop_api():
    PL_PA.stop_api()
    data="Stopped"
    return jsonify(data=data)
@app.route('/Train_save',methods=['GET', 'POST'])
def Train_save():
        data=[]
        d=request.args.get('data', 0, type=str)
        filename=request.args.get('filename', 0, type=str)
        print("\n\n###############TRAINING DATA###################\n\n")
        
        d=ast.literal_eval(d)
        #print(d)
        if db.healcollection.find({'filename': filename}).count() > 0:
                    return jsonify(data="duplicate")
        else:
            for i in d:
                    OTHER_XPATHS_FINAL=[]
                    for key,value in i["OTHER_XPATHS"].items():
                        if(key=="xpath:attributes" or key=="xpath:link" or key=="xpath:idRelative" or key=="xpath:href" or key=="xpath:neighbor" or key=="xpath:Smooth"):
                            if(key=="xpath:neighbor"):
                                for  x in value:
                                    if x.replace("xpath=","") not in OTHER_XPATHS_FINAL and difflib.SequenceMatcher(None, i["XPATH"], x.replace("xpath=","")).ratio()<80:
                                        OTHER_XPATHS_FINAL.insert(0,x.replace("xpath=",""))
                            else:
                                
                                    for r in value:
                                        
                                        if r not in OTHER_XPATHS_FINAL and difflib.SequenceMatcher(None, i["XPATH"], r).ratio()<80 and i["XPATH"]!=r:
                                            if r.startswith("xpath="):
                                                r=r.replace("xpath=","")
                                            OTHER_XPATHS_FINAL.insert(0,r)
                        
                        else:
                            #print(value)
                            for v in value:
                                if v not in OTHER_XPATHS_FINAL and difflib.SequenceMatcher(None, i["XPATH"], v).ratio()<80 and i["XPATH"]!=v:
                                    if v.startswith("xpath="):
                                        v=v.replace("xpath=","")
                                    
                                    OTHER_XPATHS_FINAL.append(v)
                                    

                            
                    data.append({"EVENT":i["EVENT"],"LOCATION":i["LOCATION"],"XPATH":i["XPATH"],"PARENTNODE":i["PARENTNODE"],"TAG":i["TAG"],"TEXT":i["TEXT"],"OTHER_XPATHS":OTHER_XPATHS_FINAL})       
                             
                            
                            
            print("\n\n\n",data)
            db.healcollection.insert_one({"filename":filename,"data":data})
            return jsonify(data="saved")

@app.route('/Train_save_java',methods=['GET', 'POST'])
def Train_save_java():
        data=[]
        d=request.args.get('data', 0, type=None)
        filename=request.args.get('filename', 0, type=None)
        #d=ast.literal_eval(d)
        print(d,filename)
        return jsonify(data="saved")
        '''
        print("\n\n###############TRAINING DATA###################\n\n")
        
        d=ast.literal_eval(d)
        #print(d)
        
        
        for i in d:
                    
                    OTHER_XPATHS_FINAL=[]
                    for key,value in i["OTHER_XPATHS"].items():
                        if(key=="xpath:attributes" or key=="xpath:link" or key=="xpath:idRelative" or key=="xpath:href" or key=="xpath:neighbor" or key=="xpath:Smooth"):
                            if(key=="xpath:neighbor"):
                                for  x in value:
                                    if x.replace("xpath=","") not in OTHER_XPATHS_FINAL and difflib.SequenceMatcher(None, i["XPATH"], x.replace("xpath=","")).ratio()<80:
                                        OTHER_XPATHS_FINAL.insert(0,x.replace("xpath=",""))
                            else:
                                
                                    for r in value:
                                        
                                        if r not in OTHER_XPATHS_FINAL and difflib.SequenceMatcher(None, i["XPATH"], r).ratio()<80 and i["XPATH"]!=r:
                                            if r.startswith("xpath="):
                                                r=r.replace("xpath=","")
                                            OTHER_XPATHS_FINAL.insert(0,r)
                        
                        else:
                            #print(value)
                            for v in value:
                                if v not in OTHER_XPATHS_FINAL and difflib.SequenceMatcher(None, i["XPATH"], v).ratio()<80 and i["XPATH"]!=v:
                                    if v.startswith("xpath="):
                                        v=v.replace("xpath=","")
                                    
                                    OTHER_XPATHS_FINAL.append(v)
                                    

                            
                    data.append({"LOCATION":i["LOCATION"],"XPATH":i["XPATH"],"PARENTNODE":i["PARENTNODE"],"TAG":i["TAG"],"TEXT":i["TEXT"],"OTHER_XPATHS":OTHER_XPATHS_FINAL})       
                             
                            
        if db.healcollection.find({'filename': filename}).count() > 0:
                  
                  myquery = {'filename': filename}
                  newvalues = { "$set": { "data": data } }

                  db.healcollection.update_one(myquery, newvalues)
                  return jsonify(data="saved")
        else:
            
            db.healcollection.insert_one({"filename":filename,"data":data})
            return jsonify(data="saved")
        '''


@app.route('/Sorted_Xpaths/<req>',methods=['GET', 'POST'])
def Sorted_Xpaths(req):
    Xpath=req.split("&&")[0]
    Xpath=Xpath.replace("$","/")
    filename=req.split("&&")[1]
    if db.healcollection.find({'filename': filename}).count==0:
        return jsonify(status="Filename:Non Existing Record",sorted_list=[])
    else:
        
        data=(db.healcollection.find({'filename': filename})[0]['data'])
       
        try:
            sorted_list=next(item for item in data if item["XPATH"] == Xpath)["OTHER_XPATHS"]
            position=next(item for item in data if item["XPATH"] == Xpath)["LOCATION"]
            tag=next(item for item in data if item["XPATH"] == Xpath)["TAG"]
            text=next(item for item in data if item["XPATH"] == Xpath)["TEXT"]
            parentnode=next(item for item in data if item["XPATH"] == Xpath)["PARENTNODE"]
            CLASS_VALUES=next(item for item in data if item["XPATH"] == Xpath)["CLASS_VALUES"]
            P1_CLASS_VALUES=next(item for item in data if item["XPATH"] == Xpath)["P1_CLASS_VALUES"]
            ATT_VALUES=next(item for item in data if item["XPATH"] == Xpath)["ATT_VALUES"]
            P1_ATT_VALUES=next(item for item in data if item["XPATH"] == Xpath)["P1_ATT_VALUES"]
            NEIGHBOUR_TEXTS=next(item for item in data if item["XPATH"] == Xpath)["NEIGHBOUR_TEXTS"]
            status="Success"
        except StopIteration:
            
            sorted_list=[]
            position=""
            tag=""
            text=""
            parentnode=""
            CLASS_VALUES=""
            P1_CLASS_VALUES=""
            ATT_VALUES=""
            P1_ATT_VALUES=""
            NEIGHBOUR_TEXTS=""
            status="Locator:Non Existing Record"
            
        return jsonify(status=status,sorted_list=sorted_list,position=position,tag=tag,text=text,parentnode=parentnode,CLASS_VALUES=CLASS_VALUES,P1_CLASS_VALUES=P1_CLASS_VALUES,
                       ATT_VALUES=ATT_VALUES,P1_ATT_VALUES=P1_ATT_VALUES,NEIGHBOUR_TEXTS=NEIGHBOUR_TEXTS)
    
    

if __name__ == '__main__':
   app.run(debug = True)
