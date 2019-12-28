import pika
import ast
import json
import difflib
import pymongo
client = pymongo.MongoClient("localhost", 27017)
db = client.smarthealer
connection = pika.BlockingConnection(
    pika.ConnectionParameters(host='localhost'))
channel = connection.channel()

channel.queue_declare(queue='hello')


def callback(ch, method, properties, body):
        data=[]
        d=ast.literal_eval(body.decode("utf-8"))
        print("\n\n###############TRAINING DATA###################\n\n")
        
        filename=d["filename"]
        d=d["data"]
        
        print(type(d))
        #d=ast.literal_eval(d)
        
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
                                    

                            
                    data.append({"LOCATION":i["LOCATION"],"XPATH":i["XPATH"],"PARENTNODE":i["PARENTNODE"],"TAG":i["TAG"],"TEXT":i["TEXT"],"OTHER_XPATHS":OTHER_XPATHS_FINAL,"NEIGHBOUR_TEXTS":i["NEIGHBOUR_TEXTS"],
                                 "CLASS_VALUES":i["CLASS_VALUES"],"P1_CLASS_VALUES":i["P1_CLASS_VALUES"],"ATT_VALUES":i["ATT_VALUES"],"P1_ATT_VALUES":i["P1_ATT_VALUES"]})

                    
                             
                            
        if db.healcollection.find({'filename': filename}).count() > 0:
                  
                  myquery = {'filename': filename}
                  newvalues = { "$set": { "data": data } }

                  db.healcollection.update_one(myquery, newvalues)
                  #return ""
        else:
            
            db.healcollection.insert_one({"filename":filename,"data":data})
            #return ""
        print("Saved")


channel.basic_consume(
    queue='hello', on_message_callback=callback, auto_ack=True)

print(' [*] Waiting for messages. To exit press CTRL+C')
channel.start_consuming()
