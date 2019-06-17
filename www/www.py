# -*- coding: utf-8 -*-
#!flask/bin/python
#!/usr/bin/env python3
"""
Created on Wed Jan  30 15:01:00 2019

@author: seeLive
"""
 

from flask import Flask, render_template, request
from flask import make_response, abort
from requests import get
from datetime import datetime, timedelta
from time import gmtime, strftime, localtime
from json import loads
import json, sys, time, os, re
from re import finditer
import logging, sys
from logging.handlers import RotatingFileHandler
from pprint import pprint
import jinja2
from jinja2 import Environment, FileSystemLoader
from gevent.pywsgi import WSGIServer
import pymysql as mariadb
#import mysql.connector as mariadb
import subprocess
import sarah


ver = "v1.6.3"
os.chdir(os.path.dirname(os.path.realpath(__file__)))
rootdir = os.getcwd()
# print ( "rootdir: ", rootdir)

prod_serv = os.uname()[1] + ".local"
prod_port = "8181"
sarah.servername = prod_serv + ":8080"

user = "openhab"
db = "sarah"
ret = sarah.executeCmdRet("python3", "/etc/checkread.py", "XmgqN2hIcmdTI3JnJDQ1ajhUNSVkQTI2cXhsMC0pdz0=", "get", "usr", "gyu^&FIYtyDjhy5i976rsU")
passwd = ret.decode("ascii").strip()
sarah.user = user
sarah.db = db
sarah.passwd = passwd


logger = logging.getLogger('www')
log_hndl = RotatingFileHandler('www.log', mode='a', maxBytes=1*1024*1024, 
        backupCount=3, encoding='utf-8', delay=0)
formatter = logging.Formatter('%(asctime)s %(levelname)s %(message)s')
log_hndl.setFormatter(formatter)
logger.addHandler(log_hndl) 
logger.setLevel(logging.INFO)

app = Flask(__name__)
def converttofloat(s):
    return float(s)
app.jinja_env.filters['convertfloat'] = converttofloat



@app.route('/', methods=['POST','GET'])
def links():    
    resp = ""
    cmd = ""
    ret = 0

    req = request.form
#     pprint ( req)


    return render_template('links.html', resp=resp, ver=ver)



@app.route('/homewiz', methods=['POST','GET'])
def homewiz():
#     t = ''
    resp = ""


    req = request.form
#     pprint ( req)

    lThings, lChannels = sarah.getThings()

    if "homes" in req and req['homes'] != "":
        home = int(req['homes'])
    else:
        home = 0

    if "newHomeName" in req and req['newHomeName'] != "":
        newHomeName = req['newHomeName']
    else:
        newHomeName = ""



    if "saveForm" in req and req['saveForm'] == "save" and (home != 0 or newHomeName != ""):
        flrs = []
        rooms = []
        items = []
        things = []
        vacas = []
        bins = []
        notforalarms = []
        formotions = []
        motionforlights = []
        chls = []

        for fld in req:
            chltmp = ""
            #home = req['homes']
            #if not home: 
#             home = 1
        
            if fld.find("-") >= 0:  # and req[i]:
#                 print ( fld, req[fld])
            
                if req[fld]:
                    p = fld.find("-")
#                     print ( fld[:p])

                    if fld[:p] == "floor":
                        flrs.append([fld[p+1:], req[fld]])
                    elif fld[:p] == "room":
                        rooms.append([fld[p+1:], req[fld]])
                    elif fld[:p] == "item":
                        items.append([fld[p+1:], req[fld]])
                    elif fld[:p] == "thing":
                        things.append([fld[p+1:], req[fld]])
                    elif fld[:p] == "vaca":
                        vacas.append([fld[p+1:], req[fld]])
                    elif fld[:p] == "binary":
                        bins.append([fld[p+1:], req[fld]])
                    elif fld[:p] == "notForAlarm":
                        notforalarms.append([fld[p+1:], req[fld]])
                    elif fld[:p] == "forMotionSensor":
                        formotions.append([fld[p+1:], req[fld]])
                    elif fld[:p] == "motionForLight":
                        motionforlights.append([fld[p+1:], req[fld]])
                    elif fld[:p] == "channel":
                        chls.append([fld[p+1:], req[fld]])
                else:
                    #print ( fld, req[fld])

                    p = fld.find("-")
                    #print ( fld[:p])
            
                    if fld[:p] == "channel":
                        chltmp = fld[p:].split(".")[3]
                        #print ( "chltmp: ", chltmp)
                        chls.append([fld[p+1:], ""])
                        #chls.append([i[p+1:], i[:p], "{channel" + str(chltmp) + "=\"\"}"])
                        #chlnew.append("{channel" + str(chltmp) + "=\"" + y[2] + "\"}")
            
            

                
        flrs = sorted(flrs)
        rooms = sorted(rooms)
        items = sorted(items)
        things = sorted(things)
        vacas = sorted(vacas)
        bins = sorted(bins)
        notforalarms = sorted(notforalarms)
        formotions = sorted(formotions)
        motionforlights = sorted(motionforlights)
        chls = sorted(chls)
#         print ("now: ")
#         pprint ( flrs)
#         pprint ( rooms)
#         pprint ( items)
#         pprint (things)
#         pprint ( vacas)
#         pprint ( bins)
#         pprint ( notforalarms)
#         pprint ( formotions)
#         pprint ( motionforlights)
#         pprint ( chls)


        # renumber all arrays
        f = 1
        for x in range(0,len(flrs)):
            flrs[x][0] = str(f) + ".0.0"
            f += 1

        f = 0
        r = 1
        fold = 0
        rold = 0
        for x in range(0,len(rooms)):
            fnew = int(rooms[x][0].split(".")[0])
            rnew = int(rooms[x][0].split(".")[1])

            if fnew > fold: 
                f += 1
                r = 1
            elif rnew > rold: r += 1
            
#             print ( "rooms-", rooms[x][0], " - ", str(f) + "." + str(r) + ".0", rooms[x][1])
            rooms[x][0] = str(f) + "." + str(r) + ".0"

            fold = fnew
            rold = rnew

            
        f = 0
        r = 0
        i = 1
        fold = 0
        rold = 0
        iold = 0
        for x in range(0,len(items)):
            fnew = int(items[x][0].split(".")[0])
            rnew = int(items[x][0].split(".")[1])
            inew = int(items[x][0].split(".")[2])
            if fnew > fold: 
                f += 1
                r = 1
                i = 1
            elif rnew > rold: 
                r += 1
                i = 1
            elif inew > iold: 
                i += 1

#             print ( "items: ", items[x][0], " - ", str(f) + "." + str(r) + "." + str(i), items[x][1])
            items[x][0] = str(f) + "." + str(r) + "." + str(i)
            
            fold = fnew
            rold = rnew
            iold = inew


        f = 0
        r = 0
        i = 1
        fold = 0
        rold = 0
        iold = 0
        for x in range(0,len(things)):
            fnew = int(things[x][0].split(".")[0])
            rnew = int(things[x][0].split(".")[1])
            inew = int(things[x][0].split(".")[2])
            if fnew > fold: 
                f += 1
                r = 1
                i = 1
            elif rnew > rold: 
                r += 1
                i = 1
            elif inew > iold: 
                i += 1

#             print ( "things: ", things[x][0], " - ", str(f) + "." + str(r) + "." + str(i), things[x][1])
            things[x][0] = str(f) + "." + str(r) + "." + str(i)
            
            fold = fnew
            rold = rnew
            iold = inew


        f = 0
        r = 0
        i = 1
        fold = 0
        rold = 0
        iold = 0
        for x in range(0,len(vacas)):
            fnew = int(vacas[x][0].split(".")[0])
            rnew = int(vacas[x][0].split(".")[1])
            inew = int(vacas[x][0].split(".")[2])
            if fnew > fold: 
                f += 1
                r = 1
                i = 1
            elif rnew > rold: 
                r += 1
                i = 1
            elif inew > iold: 
                i += 1

#             print ( "vacas: ", vacas[x][0], " - ", str(f) + "." + str(r) + "." + str(i))
            vacas[x][0] = str(f) + "." + str(r) + "." + str(i)
            
            fold = fnew
            rold = rnew
            iold = inew


        f = 0
        r = 0
        i = 1
        fold = 0
        rold = 0
        iold = 0
        for x in range(0,len(bins)):
            fnew = int(bins[x][0].split(".")[0])
            rnew = int(bins[x][0].split(".")[1])
            inew = int(bins[x][0].split(".")[2])
            if fnew > fold: 
                f += 1
                r = 1
                i = 1
            elif rnew > rold: 
                r += 1
                i = 1
            elif inew > iold: 
                i += 1

#             print ( "bins: ", bins[x][0], " - ", str(f) + "." + str(r) + "." + str(i))
            bins[x][0] = str(f) + "." + str(r) + "." + str(i)
            
            fold = fnew
            rold = rnew
            iold = inew


        f = 0
        r = 0
        i = 1
        fold = 0
        rold = 0
        iold = 0
        for x in range(0,len(notforalarms)):
            fnew = int(notforalarms[x][0].split(".")[0])
            rnew = int(notforalarms[x][0].split(".")[1])
            inew = int(notforalarms[x][0].split(".")[2])
            if fnew > fold: 
                f += 1
                r = 1
                i = 1
            elif rnew > rold: 
                r += 1
                i = 1
            elif inew > iold: 
                i += 1

#             print ( "notforalarms: ", notforalarms[x][0], " - ", str(f) + "." + str(r) + "." + str(i))
            notforalarms[x][0] = str(f) + "." + str(r) + "." + str(i)
            
            fold = fnew
            rold = rnew
            iold = inew


        f = 0
        r = 0
        i = 1
        fold = 0
        rold = 0
        iold = 0
        for x in range(0,len(formotions)):
            fnew = int(formotions[x][0].split(".")[0])
            rnew = int(formotions[x][0].split(".")[1])
            inew = int(formotions[x][0].split(".")[2])
            if fnew > fold: 
                f += 1
                r = 1
                i = 1
            elif rnew > rold: 
                r += 1
                i = 1
            elif inew > iold: 
                i += 1

#             print ( "formotions: ", formotions[x][0], " - ", str(f) + "." + str(r) + "." + str(i))
            formotions[x][0] = str(f) + "." + str(r) + "." + str(i)
            
            fold = fnew
            rold = rnew
            iold = inew


        f = 0
        r = 0
        i = 1
        fold = 0
        rold = 0
        iold = 0
        for x in range(0,len(motionforlights)):
            fnew = int(motionforlights[x][0].split(".")[0])
            rnew = int(motionforlights[x][0].split(".")[1])
            inew = int(motionforlights[x][0].split(".")[2])
            if fnew > fold: 
                f += 1
                r = 1
                i = 1
            elif rnew > rold: 
                r += 1
                i = 1
            elif inew > iold: 
                i += 1

#             print ( "motionforlights: ", motionforlights[x][0], " - ", str(f) + "." + str(r) + "." + str(i))
            motionforlights[x][0] = str(f) + "." + str(r) + "." + str(i)
            
            fold = fnew
            rold = rnew
            iold = inew


        f = 0
        r = 0
        i = 1
        fold = 0
        rold = 0
        iold = 0
        for x in range(0,len(chls)):
            fnew = int(chls[x][0].split(".")[0])
            rnew = int(chls[x][0].split(".")[1])
            inew = int(chls[x][0].split(".")[2])
            onew = int(chls[x][0].split(".")[3])

            if fnew > fold: 
                f += 1
                r = 1
                i = 1
            elif rnew > rold: 
                r += 1
                i = 1
            elif inew > iold: 
                i += 1

#             print ( "chls- ", chls[x][0], " - ", str(f) + "." + str(r) + "." + str(i) + "." + str(onew))
            chls[x][0] = str(f) + "." + str(r) + "." + str(i) + "." + str(onew)
            
            fold = fnew
            rold = rnew
            iold = inew



        if newHomeName != "":        
            try:
                mariadb_connection = mariadb.connect(user=user, password=passwd, database=db) #, cursorclass=mariadb.cursors.DictCursor)
                csr = mariadb_connection.cursor()
            
                qry = "SELECT * FROM homes WHERE name LIKE '%s%%';" % (newHomeName)

#                 print ( "qry: ", qry)
                ret = csr.execute(qry)
                mariadb_connection.commit()
#                 print ( "ret: ", ret)
                
                # if dupe name is entered add '(dd)' to name
                # find any '(dd)' exists, remove and add new '(dd)' if name is dupe
                numbers = []
                tHomeName = newHomeName

                if ret > 0:
                    match = None
                    m = None
                    g = None

                    for x in csr:
                        tHomeName = x[1]

                        for match in finditer("\((\d+)\)", tHomeName):
                            m = match.span()
                            g = match.group()
                            #print ( m[0], m[1]-1)
                            numbers.append(int(g.strip("()")))

                    tnumber = 0
                    if len(numbers) > 0:
                        for x in numbers:
                            if x > tnumber:
                                tnumber = x
                    tnumber += 1

                    if g:                        
                        newHomeName = tHomeName.replace(g, "") + "(" + str(tnumber) + ")"
                    else:
                        newHomeName = tHomeName + " (" + str(tnumber) + ")"
                else:
                    newHomeName = tHomeName
                    
#                 print ( "newHomeName: ", newHomeName, tHomeName)
        
                csr.close()
                mariadb_connection.close()
            except mariadb.Error as err:
                print("Error: {}".format(err))

            try:
                mariadb_connection = mariadb.connect(user=user, password=passwd, database=db) #, cursorclass=mariadb.cursors.DictCursor)
                csr = mariadb_connection.cursor()
            
                qry = "INSERT INTO homes (name) VALUES ('%s');" % (newHomeName)

#                 print ( "qry: ", qry)
                ret = csr.execute(qry)
                mariadb_connection.commit()
#                 print ( "ret: ", ret)
        
                csr.close()
                mariadb_connection.close()
            except mariadb.Error as err:
                print("Error: {}".format(err))
                
            try:
                mariadb_connection = mariadb.connect(user=user, password=passwd, database=db) #, cursorclass=mariadb.cursors.DictCursor)
                csr = mariadb_connection.cursor()
            
                qry = "SELECT * FROM homes WHERE name='%s';" % (newHomeName)

#                 print ( "qry: ", qry)
                ret = csr.execute(qry)
                mariadb_connection.commit()
#                 print ( "ret: ", ret)

                for x in csr:
                    home = x[0]
                    
#                 print ( "home: ", home)
        
                csr.close()
                mariadb_connection.close()
            except mariadb.Error as err:
                print("Error: {}".format(err))

        elif home != 0:
            try:
                mariadb_connection = mariadb.connect(user=user, password=passwd, database=db) #, cursorclass=mariadb.cursors.DictCursor)
                csr = mariadb_connection.cursor()
            
                qry = "DELETE FROM homeitems WHERE homeitems.home = %d;" % (home)            

#                 print ( "qry: ", qry)
                ret = csr.execute(qry)
                mariadb_connection.commit()
#                 print ( "ret: ", ret)
        
                csr.close()
                mariadb_connection.close()
            except mariadb.Error as err:
                print("Error: {}".format(err))



        # flatten structure of fields to match db record
        f = 0
        r = 0
        i = 0
        t = 0
        v = 0
        b = 0
        fidx = ""
        ridx = ""
        iidx = ""
        tidx = ""
        ridxo = ""
        flr = []
        room = []
        item = []
        thing = []
        recs = []
        rc = 0
        ic = 0


        for row in range(0, len(items)):
            iidx = items[row][0]
            tidx = iidx
            fidx = iidx.split(".")[0] + ".0.0"
            ridx = iidx.split(".")[0] + "." + iidx.split(".")[1] + ".0"
            vidx = iidx
            bidx = iidx
            nfalarmidx = iidx
            fmotionidx = iidx
            mforlightidx = iidx
#             print ( "idx: ", fidx, ridx, iidx) #, vidx, bidx)
            
            fnew = int(fidx.split(".")[0])
            rnew = int(ridx.split(".")[1])
            inew = int(iidx.split(".")[2])
#             print ( "new: ", fnew, rnew, inew)
            
            for x in flrs:
                if x[0] == fidx: 
                    fval = int(x[1])
                    break
            for x in rooms:
                if x[0] == ridx: 
                    rval = int(x[1])
                    break
            ival = int(items[row][1])
            tval = things[row][1]
            vval = 1 if vacas[row][1] == "yes" else 0
            bval = bins[row][1]
            nfalarmval = 1 if notforalarms[row][1] == "yes" else 0
            fmotionval = 1 if formotions[row][1] == "yes" else 0
            mforlightval = 1 if motionforlights[row][1] == "yes" else 0
#             print ( "val: ", fval, rval, ival)


            flr.append(fval)
            if fval != f:
                rc = 0
                ic = 0
                room = []
                item = []

            if ridx != ridxo:
                room.append(rval)
                rc = 0
                item = []
                for x in room:
                    if x == rval:
                        rc += 1

            item.append(ival)  
#             if ival != i:
            ic = 0
            for x in item:
                if x == ival:
                    ic += 1

            # get isoutside flag
            try:
                mariadb_connection = mariadb.connect(user=user, password=passwd, database=db) #, cursorclass=mariadb.cursors.DictCursor)
                csr = mariadb_connection.cursor()
            
                qry = "SELECT * FROM floors;"

#                 print ( "qry: ", qry)
                ret = csr.execute(qry)
                mariadb_connection.commit()
#                 print ( "ret: ", ret)
        
                csr.close()
                mariadb_connection.close()
            except mariadb.Error as err:
                print("Error: {}".format(err))

            for x in csr:
#                 print (x[0], x[1], x[5])
                if x[0] == fval:
                    isoutside = 1 if x[5] == 1 else 0
                    break


#             print ( fidx, fval, f, fnew)
#             print ( ridx, rval, r, rnew)
#             print ( iidx, ival, i, inew)
#             print ( fmotionval, mforlightval)
#             print ( rc, ic, row*15)
            
#             for yyy in chls:
#                 print ( yyy )
#             print ( fid, rid, iid)



            recs.append([home, fval, rval, ival, fidx, ridx, iidx, vval, bval, rc, ic, isoutside, \
            chls[(row*15)][1], chls[(row*15)+7][1], chls[(row*15)+8][1], chls[(row*15)+9][1], chls[(row*15)+10][1], \
            chls[(row*15)+11][1], chls[(row*15)+12][1], chls[(row*15)+13][1], chls[(row*15)+14][1], chls[(row*15)+1][1], \
            chls[(row*15)+2][1], chls[(row*15)+3][1], chls[(row*15)+4][1], chls[(row*15)+5][1], chls[(row*15)+6][1],\
            nfalarmval, fmotionval, mforlightval, tval])

    
            try:
                mariadb_connection = mariadb.connect(user=user, password=passwd, database=db) #, cursorclass=mariadb.cursors.DictCursor)
                csr = mariadb_connection.cursor()
                
                qry = "INSERT INTO %s (home, floor, room, item, floorord, roomord, itemord, vacamode, binarymode, \
                roomcount, itemcount, isoutside, channel1, channel2, channel3, channel4, channel5, channel6, \
                channel7, channel8, channel9, channel10, channel11, channel12, channel13, channel14, channel15, \
                isnotforalarm, isformotion, ismotionforlight, thinguid) \
                VALUES (%d, %d, %d, %d, '%s', '%s', '%s', '%d', '%s', '%d', '%d', '%d', '%s', '%s', '%s', '%s', \
                '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', %d, %d, %d, '%s');" \
                % ("homeitems", home, fval, rval, ival, fidx, ridx, iidx, vval, bval, rc, ic, isoutside, chls[(row*15)][1], \
                chls[(row*15)+7][1], chls[(row*15)+8][1], chls[(row*15)+9][1], chls[(row*15)+10][1], chls[(row*15)+11][1], \
                chls[(row*15)+12][1], chls[(row*15)+13][1], chls[(row*15)+14][1], chls[(row*15)+1][1], chls[(row*15)+2][1], \
                chls[(row*15)+3][1], chls[(row*15)+4][1], chls[(row*15)+5][1], chls[(row*15)+6][1], \
                nfalarmval, fmotionval, mforlightval, tval)            

#                 print ( "qry: ", qry)
                ret = csr.execute(qry)
                mariadb_connection.commit()
#                 print ( "ret: ", ret)
            
                csr.close()
                mariadb_connection.close()
            except mariadb.Error as err:
                print("Error: {}".format(err))

            f = fval
            r = rval
            i = ival
            ridxo = ridx

#         pprint ( flr)
#         pprint ( room)
#         pprint ( item)

#         for xxx in recs:
#             print ( xxx)
            
            
        if "genFiles" in req and req['genFiles'] == "yes":
    #         print ( "home ", type(home))
            sarah.createfiles(home)

        if "installFiles" in req and req['installFiles'] == "yes":
            sarah.installfiles()

#         exit(0)

        resp = "HOME WIZARD: Home saved successfully."



    if "deleteForm" in req and req['deleteForm'] == "delete" and home != 0:
        try:
            mariadb_connection = mariadb.connect(user=user, password=passwd, database=db) #, cursorclass=mariadb.cursors.DictCursor)
            csr = mariadb_connection.cursor()
        
            qry = "DELETE FROM homes WHERE id = %d;" % (home)            

#             print ( "qry: ", qry)
            ret = csr.execute(qry)
            mariadb_connection.commit()
#             print ( "ret: ", ret)
    
            csr.close()
            mariadb_connection.close()
        except mariadb.Error as err:
            print("Error: {}".format(err))

        try:
            mariadb_connection = mariadb.connect(user=user, password=passwd, database=db) #, cursorclass=mariadb.cursors.DictCursor)
            csr = mariadb_connection.cursor()
        
            qry = "DELETE FROM homeitems WHERE homeitems.home = %d;" % (home)            

#             print ( "qry: ", qry)
            ret = csr.execute(qry)
            mariadb_connection.commit()
#             print ( "ret: ", ret)
    
            csr.close()
            mariadb_connection.close()
        except mariadb.Error as err:
            print("Error: {}".format(err))

        resp = "HOME WIZARD: Home deleted successfully."





    lHomeitems = []
    cHomeitems = ""

    if "loadForm" in req and req['loadForm'] == "load" and home != 0:
#         home = int(req['homes'])
#         print ( "now: ", req['homes'])

        try:
            mariadb_connection = mariadb.connect(user=user, password=passwd, database=db) #, cursorclass=mariadb.cursors.DictCursor)
            cHomeitems = mariadb_connection.cursor()
            #cursor = db.cursor(cursor_class=MySQLCursorDict)
            
            qry = "SELECT homes.name, floors.id, floors.name, floors.label, floors.icon, floors.group, homeitems.floorord, \
            rooms.id, rooms.name, rooms.label, rooms.icon, rooms.group, homeitems.roomord, items.id, items.name, items.label, \
            items.icon, items.group, homeitems.binarymode, items.map, homeitems.itemord, homeitems.roomcount, homeitems.itemcount, \
            homeitems.vacamode, homeitems.isoutside, homeitems.channel1, homeitems.channel2, homeitems.channel3, homeitems.channel4, \
            homeitems.channel5, homeitems.channel6, homeitems.channel7, homeitems.channel8, homeitems.channel9, homeitems.channel10, \
            homeitems.channel11, homeitems.channel12, homeitems.channel13, homeitems.channel14, homeitems.channel15, \
            homeitems.isnotforalarm, homeitems.isformotion, homeitems.ismotionforlight, homeitems.thinguid \
            FROM homes, floors, rooms, items, homeitems \
            WHERE homes.id = %d \
            and homes.id = homeitems.home and homeitems.floor = floors.id and homeitems.room = rooms.id and \
            homeitems.item = items.id;" % (home)

#             print ( "qry: ", qry)
            ret = cHomeitems.execute(qry)
            mariadb_connection.commit()
#             print ( "ret: ", ret)

            cHomeitems.close()
            mariadb_connection.close()
            
#             for x in cHomeitems:
#                 print ( x)

        except mariadb.Error as err:
            print("Error: {}".format(err))

        resp = "HOME WIZARD: Home loaded successfully."



    lHomes = []
    lFloors = []
    lRooms = []
    lItems = []
    cHomes = ""
    cFloors = ""
    cRooms = ""
    cItems = ""

    try:
        mariadb_connection = mariadb.connect(user=user, password=passwd, database=db) #, cursorclass=mariadb.cursors.DictCursor)
        cHomes = mariadb_connection.cursor()
        #cursor = db.cursor(cursor_class=MySQLCursorDict)
        cHomes.execute("SELECT *  FROM homes ORDER BY name;") # and things.id = things.item")
        cHomes.close()

        cFloors = mariadb_connection.cursor()
        #cursor = db.cursor(cursor_class=MySQLCursorDict)
        cFloors.execute("SELECT *  FROM floors ORDER BY id;") # and things.id = things.item")
        cFloors.close()

        cRooms = mariadb_connection.cursor()
        #cursor = db.cursor(cursor_class=MySQLCursorDict)
        cRooms.execute("SELECT * FROM rooms ORDER BY name;") # and things.id = things.item")
        cRooms.close()

        cItems = mariadb_connection.cursor()
        #cursor = db.cursor(cursor_class=MySQLCursorDict)
        cItems.execute("SELECT * FROM items ORDER BY name;") # and things.id = things.item")
        cItems.close()

        mariadb_connection.close()

    except mariadb.Error as err:
        print("Error: {}".format(err))



    lHomes = list(cHomes)
    lFloors = list(cFloors)
    lRooms = list(cRooms)
    lItems = list(cItems)
    lHomeitems = list(cHomeitems)
    
#     pprint( lHomeitems)

    return render_template('homewiz.html', Homes=json.dumps(lHomes), Floors=json.dumps(lFloors), \
        Rooms=json.dumps(lRooms), Items=json.dumps(lItems), Homeitems=json.dumps(lHomeitems), \
        home=home, Things=json.dumps(lThings), Channels=json.dumps(lChannels), resp=resp, ver=ver)



@app.route('/maint', methods=['POST','GET'])
def maint():
    email = ""
    resp = ""
    cmd = ""
    ret = 0
    msg = ""
    fld = ""
    qry = ""
    radiochnls = []
    radiodescs = []

    req = request.form
#     pprint ( req)


    if "saveForm" in req and req['saveForm'] == "save":
        qry = "UPDATE maint "
        qry += "SET "

        for fld in req:
#             print(fld, req[fld])
 
            if fld != "saveForm":
                qry += fld + " = \'" + req[fld] + "\', "

                if "bedtimeisnextday" not in req:
                    qry += "bedtimeisnextday = \'0\', "
                else:
                    qry += "bedtimeisnextday = \'1\', "
                    
                if "emailusestarttls" not in req:
                    qry += "emailusestarttls = \'0\', "
                else:
                    qry += "emailusestarttls = \'1\', "
                    
                if "emailusessl" not in req:
                    qry += "emailusessl = \'0\', "
                else:
                    qry += "emailusessl = \'1\', "
                    
                if "emailusepop" not in req:
                    qry += "emailusepop = \'0\', "
                else:
                    qry += "emailusepop = \'1\', "
                    
            
        qry = qry[:-2]
        qry += " WHERE id = 1;"
 
 
        try:
            mariadb_connection = mariadb.connect(user=user, password=passwd, database=db) #, cursorclass=mariadb.cursors.DictCursor)

            csr = mariadb_connection.cursor()
            #cursor = db.cursor(cursor_class=MySQLCursorDict)

#             print ( "qry: ", qry)
            ret = csr.execute(qry)
            mariadb_connection.commit()
            print ( "ret: ", ret)
    
            csr.close()
            mariadb_connection.close()

        except mariadb.Error as err:
            print("Error: {}".format(err))

        if ret == 0 or ret ==1:
            resp = "MAINT: Save succeeded."
        else:
            resp = "MAINT: Save failed. Return code was (" + str(ret) + ")."



    try:
        mariadb_connection = mariadb.connect(user=user, password=passwd, database=db, cursorclass=mariadb.cursors.DictCursor)

        cMaint = mariadb_connection.cursor()
        #cMaint = mariadb_connection.cursor(cursor_class=MySQLCursorDict)
        cMaint.execute("SELECT *  FROM maint WHERE id = 1;")
        cMaint.close()

        mariadb_connection.close()

    except mariadb.Error as err:
        print("Error: {}".format(err))

    cMaint = cMaint.fetchall() 
    
    email = cMaint[0]['email']
    morningtime = cMaint[0]['morningtime']
    daytime = cMaint[0]['daytime']
    nighttime = cMaint[0]['nighttime']
    eveningtime = cMaint[0]['eveningtime']

    homedesc = cMaint[0]['homedesc']
    homelatitude = cMaint[0]['homelatitude']
    homelongitude = cMaint[0]['homelongitude']
    homealtitude = cMaint[0]['homealtitude']
    homerefresh = cMaint[0]['homerefresh']

    emailhost = cMaint[0]['emailhost']
    emailport = cMaint[0]['emailport']
    emailuser = cMaint[0]['emailuser']
    emailpasswd = cMaint[0]['emailpasswd']
    emailfrom = cMaint[0]['emailfrom']
    emailusestarttls = cMaint[0]['emailusestarttls']
    emailusessl = cMaint[0]['emailusessl']
    emailusepop = cMaint[0]['emailusepop']
    emailcharset = cMaint[0]['emailcharset']

    minlightson = cMaint[0]['minlightson']   
    waketime = cMaint[0]['waketime']
    bedtime = cMaint[0]['bedtime']
    bedtimeisnextday = cMaint[0]['bedtimeisnextday']
    
    for x in range(1,16):
        radiochnls.append(cMaint[0]['radiochannel'+str(x)])
        
    for x in range(1,16):
        radiodescs.append(cMaint[0]['radiodesc'+str(x)])

    return render_template('maint.html', resp=resp, ver=ver, radiochnls=radiochnls, radiodescs=radiodescs, homealtitude=homealtitude,
email=email, nighttime=nighttime, emailusessl=emailusessl, daytime=daytime, homedesc=homedesc, homelongitude=homelongitude, 
minlightson=minlightson, emailusestarttls=emailusestarttls, homelatitude=homelatitude, emailpasswd=emailpasswd, emailhost=emailhost, 
emailport=emailport, emailuser=emailuser, bedtime=bedtime, waketime=waketime, emailusepop=emailusepop, homerefresh=homerefresh, 
bedtimeisnextday=bedtimeisnextday, morningtime=morningtime, emailfrom=emailfrom, emailcharset=emailcharset, eveningtime=eveningtime)



@app.route('/administrata', methods=['POST','GET'])
def administrata():
    global passwd
    
    resp = ""
    cmd = ""
    ret = 0

    req = request.form
#     pprint ( req)


    if "cmd" in req and req['cmd'] != "":
        cmd = req['cmd']
        msg = ""
        ret = 0


        if cmd == "test":
            msg = "test cmd"
            time.sleep(3)
            ret = 0
        
        if cmd == "Restart openHAB":
            msg = "Restart openHAB service"
            ret = sarah.executeCmd('sudo','systemctl', 'restart', 'openhab2')
        
        if cmd == "Reboot":
            msg = "Reboot Raspberry Pi"
            ret = sarah.executeCmdNoWait('sudo', 'reboot')
        
        if cmd == "Shutdown":
            msg = "Shutdown Raspberry Pi"
            ret = sarah.executeCmdNoWait('sudo', 'shutdown', '-h', 'now')
        
        if cmd == "Update Pi":
            ret = sarah.executeCmdRet('sudo', 'apt-get', '-y', 'update')
            ret += sarah.executeCmdRet('sudo', 'apt-get', '-y', 'upgrade')
            return b"COMMAND: Returned the following...\n" + ret
                
        if cmd == "Update S.A.R.A.H.":
            ret = sarah.executeCmdRet('git', '--git-dir=/usr/local/sarah/.git', 'log')
            return b"COMMAND: Returned the following...\n" + ret
                
        
        if ret == 0:
            resp = "COMMAND: \'" + msg + "\' succeeded."
        else:
            resp = "COMMAND: \'" + msg + "\' failed. Return code was (" + str(ret) + ")."

        return resp


    if "savePW" in req and req['savePW'] != "":
        msg = ""
        ret = ""
        success = False

        currpw = req['currpw']
        newpw1 = req['newpw1']
        newpw2 = req['newpw2']
        print("now:", currpw, newpw1, newpw2)

        # update user account
        try:
            pass
        #    p = subprocess.Popen(('echo', '-e', 'openhab\nmynewpw_001\nmynewpw_001\n'), stdout=subprocess.PIPE)
#             p = subprocess.Popen(('echo', '-e', '%s\n%s\n%s\n' % (currpw, newpw1, newpw2)), stdout=subprocess.PIPE)
#             output = subprocess.check_output(('passwd', 'openhab'), stdin=p.stdout)
        except Exception as err:
            resp = "Error: Password not saved - %s" % err
        else:
            resp = "Password NOT changed successfully."
            success = True
#             print(p.communicate())
#             print(p.stderr)
#             print(p.returncode)
    
        print(resp)


        # update databases
        try:
            cmd2 = ['mysql', '--user=openhab', '--password=openhab','--database=mysql']
            cmd1 = 'echo "SET PASSWORD FOR \'openhab\'@\'localhost\' = PASSWORD(\'openhab\');"'
        #     cmd1 = "echo 'select * from items;'"
        #     cmd2 = "/usr/bin/mysql --user=openhab --password=openhab --database=mysql" #; SET PASSWORD FOR 'openhab'@'localhost' = PASSWORD('openhab');"
        #     cmd1 = "echo -e SET PASSWORD FOR 'openhab'@'localhost' = PASSWORD\('openhab'\); | /usr/bin/mysql --user=openhab --password=openhab --database=mysql"
            p1 = subprocess.Popen(cmd1, stderr=subprocess.PIPE, stdout=subprocess.PIPE, shell=True)
            p2 = subprocess.check_output((cmd2), stdin=p1.stdout)
            output,error = p1.communicate()
            p1.stdout.close()

            print(output, error, p2)
            print(p1.returncode)

        except Exception as err:
            resp = "Error: Password not saved - %s" % err
        else:
            resp = "Password NOT changed successfully."
            success = True

        print(resp)


        # update pw file
        if success:
            ret1 = sarah.executeCmdRet("python3", "/etc/checkread.py", "XmgqN2hIcmdTI3JnJDQ1ajhUNSVkQTI2cXhsMC0pdz0=", "in", "usr", newpw1)
            ret1 = ret1.decode("ascii").strip()


        # update db password in web server
        if success:
            ret2 = sarah.executeCmdRet("python3", "/etc/checkread.py", "XmgqN2hIcmdTI3JnJDQ1ajhUNSVkQTI2cXhsMC0pdz0=", "get", "usr", "gyu^&FIYtyDjhy5i976rsU")
            passwd = ret2.decode("ascii").strip()
            sarah.passwd = passwd


        resp = ret1 + " - " +passwd
        print(resp)


    return render_template('administrata.html', resp=resp, ver=ver)






if __name__ == '__main__':
    logger.info('')
    logger.info("[[ ### Script execution - begin ### ]]")
    logger.info("[Web services starting]")
    
    host = prod_serv
    app.run(host=host, port=prod_port, debug=True)

#     http_server = WSGIServer((host, 8181), app)
#     http_server.serve_forever()

    logger.info("[Web services closing]")
    logger.info("[[ ### Script execution - end ### ]]")
    exit(0)