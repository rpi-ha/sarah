#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sat Feb 16 13:21:03 2019

@author: seeLive
"""

import os, sys, shutil, requests
import logging, sys
from logging.handlers import RotatingFileHandler
from pprint import pprint
import pymysql as mariadb
# import MySQLdb as mariadb
import subprocess
from datetime import datetime

servername = ""
user = ""
passwd = ""
db = ""


def createfiles(home):
#     print ("from sarah-", home)

    sp = " "
    us = "_"
    qt = "\""
    tb = "\t"
    itemsfile = []
    formotions = []
    motionforlights = []
    garagedoors = []
    radiochnls = []
    radiodescs = []
    
    confdir = "/usr/local/sarah/www/conffiles"
    headermsg = "Generated by: The S.A.R.A.H. Command Center   Written by: seeLive"
    

    #  Fetch maintenance record
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


    #  Create items file
    with open(os.path.join(confdir, "items-beg.frag"), 'r', encoding='utf-8') as fin:
        t = fin.readlines()
        for x in t:
            if "[header-msg]" in x:
                x = x.replace("[header-msg]", headermsg)
            itemsfile.append(x)

    try:
        mariadb_connection = mariadb.connect(user=user, password=passwd, database=db) #, cursorclass=mariadb.cursors.DictCursor)
        cursor = mariadb_connection.cursor()
        #cursor = db.cursor(cursor_class=MySQLCursorDict)
        cursor.execute("SELECT distinct homes.name, floors.name, floors.label, floors.icon, floors.group \
		FROM homes, floors, homeitems \
		WHERE homes.id = %d and homes.id = homeitems.home and homeitems.floor = floors.id;" % (home))
    
    except mariadb.Error as err:
        print("Error: {}".format(err))

    fgrps = []
    
    for row in cursor:
#         print (row)
        hnam = row[0]
        fnam = row[1]
        flbl = row[2]
        ficon = row[3]
        fgrp = row[4]

        #print ( "now: ", fgrp, "now", fgrpo) 
        fgrps.append(tuple([fgrp, flbl, ficon]))

    
    for fgrp, flbl, ficon in fgrps:
        outline = "Group " + fgrp + sp + qt + flbl + qt + sp + ficon
        itemsfile.append(outline + "\n")
#         print ( outline)
#     for x in fgrps:
#         print ( x)
#     for x in rgrps:
#         print ( x)
    itemsfile.append("\n")

    cursor.close()
    mariadb_connection.close()
#     print()

    try:
        mariadb_connection = mariadb.connect(user=user, password=passwd, database=db) #, cursorclass=mariadb.cursors.DictCursor)
        cursor = mariadb_connection.cursor()
        #cursor = db.cursor(cursor_class=MySQLCursorDict)
        cursor.execute("SELECT DISTINCT homes.name, floors.name, floors.label, floors.icon, floors.group, rooms.name, \
        rooms.label, rooms.icon, rooms.group, homeitems.roomcount \
		FROM homes, floors, rooms, homeitems \
		WHERE homes.id = %d \
		and homes.id = homeitems.home and homeitems.floor = floors.id and homeitems.room = rooms.id;" % (home))
    
    except mariadb.Error as err:
        print("Error: {}".format(err))

    fgrps = []
    rgrps = []
    igrps = []
#     for x in cursor:
#         print ( x)
    
    for row in cursor:
#         print (row)
        fnam = row[1]
        flbl = row[2]
        ficon = row[3]
        fgrp = row[4]
        rnam = row[5]
        rlbl = row[6]
        ricon = row[7]
        rgrp = row[8]
        rcnt = row[9]
#         icnt = row[10]

        rgrps.append(tuple([rgrp, rnam, ricon, fgrp, rcnt]))
#     print ( "now: ", rgrps)
    
    for rgrp, rnam, ricon, fgrp, rcnt in rgrps:
        outline = "Group " + fgrp[1:] + us + rnam + str(rcnt)+ sp + qt + rnam + str(rcnt) + qt + sp + ricon + sp + "(" + fgrp + ")"
        itemsfile.append(outline + "\n")
#         print ( "Group " + rgrp + sp + qt + rnam + str(rcnt) + qt + sp + ricon + sp + "(" + fgrp + ")")
#         print (outline)
#     for x in fgrps:
#         print ( x)
#     for x in rgrps:
#         print ( x)
    itemsfile.append("\n")

    cursor.close()
    mariadb_connection.close()
#     print()


    try:
        mariadb_connection = mariadb.connect(user=user, password=passwd, database=db) #, cursorclass=mariadb.cursors.DictCursor)
        cursor = mariadb_connection.cursor()
        #cursor = db.cursor(cursor_class=MySQLCursorDict)
        cursor.execute("SELECT homes.name, floors.id, floors.name, floors.label, floors.icon, floors.group, homeitems.floorord, \
        rooms.id, rooms.name, rooms.label, rooms.icon, rooms.group, homeitems.roomord, homeitems.id, items.name, items.label, \
        items.icon, items.group, homeitems.binarymode, items.map, homeitems.itemord, homeitems.roomcount, homeitems.itemcount, \
        homeitems.vacamode, homeitems.isoutside, homeitems.channel1, homeitems.channel2, homeitems.channel3, homeitems.channel4, \
        homeitems.channel5, homeitems.channel6, homeitems.channel7, homeitems.channel8, homeitems.channel9, homeitems.channel10, \
        homeitems.channel11, homeitems.channel12, homeitems.channel13, homeitems.channel14, homeitems.channel15, \
        homeitems.isnotforalarm, homeitems.isformotion, homeitems.ismotionforlight, items.actgrpdisp \
        FROM homes, floors, rooms, items, homeitems \
        WHERE homes.id = %d \
        and homes.id = homeitems.home and homeitems.floor = floors.id and homeitems.room = rooms.id and homeitems.item = items.id;" % (home))

    except mariadb.Error as err:
        print("Error: {}".format(err))

#     for x in cursor:
#         print ( x)
    item = ""
    map  = ""
    type = ""
    icon = ""
    grp  = ""
    obj  = ""
    mailbox = "DummyPlaceholder"
    actgroups = []
    actgroupset = set()
    
    for row in cursor:
#         print ( row)
        vac  = ""
        alm  = ""
        out  = ""
        chnls = []
        fid = row[1]
        fnam = row[2]
        flbl = row[3]
        ficon = row[4]
        fgrp = row[5]
        ford = row[6]
        rid = row[7]
        rnam = row[8]
        rlbl = row[9]
        ricon = row[10]
        rgrp = row[11]
        rord = row[12]
        iid = row[13]
        inam = row[14]
        ilbl = row[15]
        iicon = row[16]
        igrp = row[17]
        ibin = row[18]
        if ibin == "switch":
            ibin = "Switch"
        elif ibin == "contact":
            ibin = "Contact"
        elif ibin == "rollershutter":
            ibin = "Rollershutter"
        imap = row[19]
        iord = row[20]
        rcnt = row[21]
        icnt = row[22]
        isvac = row[23]
        isout = row[24]
        isnfa = row[40]
        isfm = row[41]
        ismfl = row[42]
        iactgrpdisp = row[43]
        ffgrp = fgrp[1:] + us + rnam + str(rcnt)
        

        if isvac: vac = "*"
        if isnfa: alm = "!"
        if isout: out = " - outside"
            
        #Switch Garage1Switch "Garage Door1" (gGdn, GDSwitches)  {mqtt=">[broker:home/garage:command:on:act-1]"}
        if ilbl == "Garage door":
            item = "Switch GarageDoor" + str(icnt) + "Switch \"Garage Door" + str(icnt) + "\" (" + fgrp[1:] + us + rnam + str(rcnt) + \
            ", GDSwitches)  {mqtt=\">[broker:home/garage:command:on:act-" + str(icnt) + "]\"}"

            garagedoors.append(tuple(["GarageDoor"+str(icnt)+"Switch", "GarageDoor"+str(icnt), "Garage door "+str(icnt)]))
            #"var String activatingGarageDoor"+str(icnt)+"Msg = \"Activating, garage door "+str(icnt)+".\""]))

            itemsfile.append(item + "\n")

        actgroupset.add(tuple([igrp, ibin, iicon, iactgrpdisp]))


        for chnl in range(0,15):            
            if len(row[25 + chnl]) > 0 and (row[25 + chnl][0] != "{" and row[25 + chnl][:-1] != "}"):
                chnls.append("{channel=\"" + row[25 + chnl] + "\"}")
            else:
                chnls.append(row[25 + chnl])
            
            if chnls[chnl] != "":

                if chnl == 0: 
                    obj = ibin
                    type = "Binary"
                    map = imap
#                     if ibin.lower() == "switch":
#                         map = map.replace("contact", "binary")
#                     else:
#                         map = map.replace("switch", "contact")
                    icon = iicon
                    if inam == "Siren" or inam == "MotionSensor":
                        grp =  "(" + igrp + ", Binaries)"
                    elif inam == "PowerOutletSwitch" and isvac:
                        grp =  "(" + ffgrp + ", " + rgrp + ", " + igrp + ", Lights, Binaries)"
                    else:
                        grp =  "(" + ffgrp + ", " + rgrp + ", " + igrp + ", Binaries)"
                if chnl == 1: 
                    obj = "Switch"
                    type = "Alarm"
                    map = " [MAP(alarm.map):%s]"
                    grp =  "(Alarms)"
                    icon = "<siren>"
                if chnl == 2: 
                    obj = "Switch"
                    type = "Tamper"
                    map = " [MAP(tamper.map):%s]"
                    icon = "<siren>"
                    grp =  "(Tamper)"
                if chnl == 3: 
                    obj = "Number"
                    type = "Lumi"
                    map = ""
                    icon = "<sun>"
                    grp =  "(" + ffgrp + ", " + rgrp + ", Luminance)"
                if chnl == 4: 
                    obj = "Number"
                    type = "Battery"
                    map = ""
                    icon = "<battery>"
                    grp =  "(Batteries)"
                if chnl == 5: 
                    obj = "Number"
                    type = "Temp"
                    map = " [%.1f °F]"
                    icon = "<temperature>"
                    grp =  "(" + ffgrp + ", " + rgrp + ", Temperature)"
                if chnl == 6: 
                    obj = "Number"
                    type = "Humid"
                    map = " [%.1f %%]"
                    icon = "<humidity>"
                    grp =  "(" + ffgrp + ", " + rgrp + ", Humidity)"
                if chnl == 7: 
                    obj = "Dimmer"
                    type = "Dimmer"
                    map = ""
                    icon = ""
                    grp =  "(" + ffgrp + ", " + rgrp + ", Dimmers)"
                if chnl == 8: 
                    obj = "Color"
                    type = "Color"
                    map = ""
                    grp =  "(" + ffgrp + ", " + rgrp + ")"
                if chnl == 9: 
                    obj = "Dimmer"
                    type = "Colortemp"
                    map = ""
                    icon = ""
                    grp =  "(" + ffgrp + ", " + rgrp + ")"
                if chnl == 10: 
                    obj = "Switch"
                    type = "Vibration"
                    map = ""
                    icon = "<motion>"
                    grp =  "(" + ffgrp + ", " + rgrp + ")"
                if chnl == 11: 
                    obj = "Number"
                    type = "UV"
                    map = ""
                    icon = "<sun>"
                    grp =  "(" + ffgrp + ", " + rgrp + ")"
                if chnl == 12: 
                    obj = ""
                    type = ""
                    map = ""
                    icon = ""
                if chnl == 13: 
                    obj = ""
                    type = ""
                    map = ""
                    icon = ""
                if chnl == 14: 
                    obj = ""
                    type = ""
                    map = ""
                    icon = ""
            
                #print ( rlbl[:])
                #Contact GarageDoor1_Gdn_Garage1_Binary "Garage1 Garage door1 Binary - outside [MAP(contact.map):%s]" <garagedooricon> (Gdn_Basement1, Garages, GarageDoors, Binaries) {channel="bin"}

                itemname = inam + str(icnt) + us + ffgrp.split("_")[0] + us + rnam + str(rcnt) + us + type
                if inam == "Mailbox" and type == "Binary":
                    mailbox = itemname
        
                if ilbl == "Garage door":
                    item = obj + sp + itemname + sp + \
                    qt + alm + ilbl + str(icnt) + sp + type + out + map + qt + sp + icon + sp + \
                    grp + sp + chnls[chnl]
#                     item = obj + sp + itemname + sp + \
#                     qt + vac + rlbl + str(rcnt) + sp + ilbl + str(icnt) + sp + type + out + map + qt + sp + icon + sp + \
#                     grp + sp + chnls[chnl]
                else:
                    item = obj + sp + itemname + sp + \
                    qt + vac + alm + flbl + sp + rlbl + str(rcnt) + sp + ilbl + str(icnt) + sp + type + out + map + qt + sp + icon + sp + \
                    grp + sp + chnls[chnl]

                vac = ""
                alm = ""
                itemsfile.append(item + "\n")
#                 print ( item)

                isoutside = "true" if isout == 1 else "false"
                if isfm and type == "Binary":
                    formotions.append(tuple([rord, itemname, inam, ilbl, type, rnam, rlbl, isoutside]))
            
                if ismfl and type == "Alarm":
                    motionforlights.append(tuple([rord, itemname, inam, ilbl, type, rnam, rlbl, isoutside]))



        
#     for x in formotions:
#         print(x)
#     for x in motionforlights:
#         print(x)
        

    itemsfile.append("\n")

    cursor.close()
    mariadb_connection.close()
    

#     print("active groups")
#     pprint(actgroupset)
    
    for igrp, ibin, iicon, iactgrpdisp in actgroupset:
        if iactgrpdisp:
            actgroup = "Group:"
            if ibin == "Switch":
                actgroup += ibin + ":OR(ON, OFF)"
            elif  ibin == "Contact":
                actgroup += ibin + ":OR(OPEN, CLOSED)"
            elif  ibin == "Rollershutter":
                actgroup += ibin + ":OR(UP, DOWN)"
        
            if igrp == "PowerSwitches": iicon = "<poweroutlet>"
            actgroup += "         " + igrp + "     \"" + iactgrpdisp + "\"         " + iicon
            actgroups.append(actgroup)
            itemsfile.append(actgroup + "\n")


#     print("active groups")
#     for x in actgroups:
#         print(x)



    with open(os.path.join(confdir, "sarah.items"), 'w', encoding='utf-8') as fout:
        fout.writelines(itemsfile)

    with open(os.path.join(confdir, "items-end.frag"), 'r', encoding='utf-8') as fin:
        t = fin.readlines()

    with open(os.path.join(confdir, "sarah.items"), 'a', encoding='utf-8') as fout:
        fout.writelines(t)

#     for x in itemsfile:
#         print(x)
        
        
    
    #  Create sitemap file
    sitemapfile = []
    
    with open(os.path.join(confdir, "sitemap-beg.frag"), 'r', encoding='utf-8') as fin:
        t = fin.readlines()
        for x in t:
            if "[header-msg]" in x:
                x = x.replace("[header-msg]", headermsg)
            sitemapfile.append(x)

    try:
        mariadb_connection = mariadb.connect(user=user, password=passwd, database=db) #, cursorclass=mariadb.cursors.DictCursor)
        csr = mariadb_connection.cursor()
        #cursor = db.cursor(cursor_class=MySQLCursorDict)
        
        qry = "SELECT DISTINCT homeitems.floor, floors.name, floors.label, floors.icon, floors.group \
        FROM floors, homeitems \
        WHERE homeitems.home = %d and homeitems.floor = floors.id;" % (home)

#         print ( "qry: ", qry)
        ret = csr.execute(qry)
        mariadb_connection.commit()
#         print ( "ret: ", ret)

        csr.close()
        mariadb_connection.close()
    except mariadb.Error as err:
        print("Error: {}".format(err))
        
        
    sitemapfile.append("    Frame label=\"%s\" {\n" % hnam)
    for flr, nam, lbl, icon, grp in csr:
        sitemapfile.append("        Group item=" + grp + "    label=\"" + lbl + "\"    icon=\"" + icon[1:-1] + "\"\n")
        
    sitemapfile.append("        Group item=gStatus label=\"Status\"    icon=\"settings\" {\n")
    
#     for x in sitemapfile:
#         print(x)
        

    try:
        mariadb_connection = mariadb.connect(user=user, password=passwd, database=db) #, cursorclass=mariadb.cursors.DictCursor)
        csr = mariadb_connection.cursor()
        #cursor = db.cursor(cursor_class=MySQLCursorDict)
        
        qry = "SELECT DISTINCT homeitems.item, items.name, items.label, items.icon, items.group \
        FROM items, homeitems \
        WHERE homeitems.home = %d and homeitems.item = items.id;" % (home)

#         print ( "qry: ", qry)
        ret = csr.execute(qry)
        mariadb_connection.commit()
#         print ( "ret: ", ret)

        csr.close()
        mariadb_connection.close()
    except mariadb.Error as err:
        print("Error: {}".format(err))

    temparray = []
    isfound = False
    for itm, nam, lbl, icon, grp in csr:
        for x in temparray:
            if x == grp:
                grp = ""
                isfound = True
                
        if not isfound: temparray.append(grp)
        
        if grp != "":
            if grp == "Lights": sitemapfile.append('            Switch item=Lights mappings=[OFF=\"All Off\"]\n')
            if grp == "GarageDoors": sitemapfile.append('            Group item=GDSwitches label=\"Garage Door Switches\" icon=\"switch\"\n')
            if grp != "MotionSensors" and grp != "Sirens" and grp != "Mailboxes" and grp != "RangeExtenders":
                sitemapfile.append("            Group item=" + grp + "\n")


    with open(os.path.join(confdir, "sitemap-mid.frag"), 'r', encoding='utf-8') as fin:
        t = fin.readlines()
        for x in t:
            sitemapfile.append(x)

    sitemapfile.append("    Frame label=\"Internet Radio\" {\n")
    sitemapfile.append("        Selection item=InternetRadio label=\"Channels\" icon=\"player\" mappings=[0=\"off\", \n")
    
    station = ""
    for c in range(15):
        if radiodescs[c] != "":
            station += "            %d=\"%s\", \n" % (c+1, radiodescs[c])
    station = station[:-3] + "]\n"
    
    sitemapfile.append(station)
    sitemapfile.append("        Slider item=InternetRadioVolume label=\"System volume\" icon=\"soundvolume\"\n    }\n")
    sitemapfile.append("}")
            

    with open(os.path.join(confdir, "sarah.sitemap"), 'w', encoding='utf-8') as fout:
        fout.writelines(sitemapfile)

#     for x in sitemapfile:
#         print(x)



    #  Create rules file
    rulesfile = []
    rulesgarage = []

    with open(os.path.join(confdir, "rules-beg.frag"), 'r', encoding='utf-8') as fin:
        t = fin.readlines()
        for x in t:
            if "[header-msg]" in x:
                x = x.replace("[header-msg]", headermsg)
            rulesfile.append(x)


    for lrord, litemname, linam, lilbl, ltype, lrnam, lrlbl, lisoutside in formotions:
        for mrord, mitemname, minam, milbl, mtype, mrnam, mrlbl, misoutside in motionforlights:
            if lrord == mrord:
                rulesfile.append("var Timer %s       = null\n" % (mrnam + "MotionTimer"))
                rulesfile.append("var boolean %s = false\n" % (mrnam + "MotionTriggered"))
                if misoutside == "false":
                    rulesfile.append("val int %s         = 15\n" % (mrnam + "TimeoutMins"))
                    rulesfile.append("val int %s           = 25\n" % (mrnam + "LumiLevel"))
                else:
                    rulesfile.append("val int %s         = 8\n" % (mrnam + "TimeoutMins"))
                    rulesfile.append("val int %s           = 8\n" % (mrnam + "LumiLevel"))

                if misoutside == "false":
                    rulesfile.append('var String %sMotionMsg       = \"Please, allow me to turn on some light for you.\"\n\n' % mrnam)
                else:
                    rulesfile.append('var String %sMotionMsg      = \"Pardon me, sir, madam, we have a visitor on the %s.\"\n\n' % (mrnam, mrlbl))

    
    rulesfile.append("// Vacation mode settings\n")
    rulesfile.append("var int minLightsOn           = %s\n" % minlightson)
    rulesfile.append("var String wakeTimeHours      = \"%s\"\n" % waketime)
    rulesfile.append("var String bedTimeHours       = \"%s\"\n" % bedtime)
    rulesfile.append("var boolean bedTimeIsNextDay  = %s\n" % ("true" if bedtimeisnextday==1 else "false"))
        
    rulesfile.append('\nval String emailList              = \"%s\"\n\n' % email)


    with open(os.path.join(confdir, "rules-mid.frag"), 'r', encoding='utf-8') as fin:
        t = fin.readlines()
        for x in t:
            if "[mailbox-alarm]" in x: x = x.replace("[mailbox-alarm]", mailbox)
            rulesfile.append(x)


    for lrord, litemname, linam, lilbl, ltype, lrnam, lrlbl, lisoutside in formotions:
        for mrord, mitemname, minam, milbl, mtype, mrnam, mrlbl, misoutside in motionforlights:
            if lrord == mrord:
#                 print(lrord, mrord, lisoutside, misoutside)
                rulesmotion = []
                
                if misoutside == "true":
#                     print("out")
                    motionfile = "rules-motion-out.frag"
                else:
#                     print("in")
                    motionfile = "rules-motion-in.frag"

#                 print(motionfile)
                with open(os.path.join(confdir, motionfile), 'r', encoding='utf-8') as fin:
                    t = fin.readlines()

                    for lines in t:
                        rulesmotion.append(lines.strip("\n"))
                
                for x in rulesmotion:
                    if "[motion-room-lbl]" in x: x = x.replace("[motion-room-lbl]", mrlbl)
                    elif "[motion-alarm]" in x: x = x.replace("[motion-alarm]", mitemname)
                    elif "[light-binary]" in x: x = x.replace("[light-binary]", litemname)
                    elif "[is-outside]" in x: x = x.replace("[is-outside]", lisoutside)
                    elif "[motion-msg]" in x: x = x.replace("[motion-msg]", "%sMotionMsg" % mrnam)
                    elif "[motion-lumi]" in x: x = x.replace("[motion-lumi]", mrnam + "LumiLevel")
                    elif "[motion-timeout]" in x: x = x.replace("[motion-timeout]", mrnam + "TimeoutMins")
                    elif "[motion-triggered]" in x: x = x.replace("[motion-triggered]", mrnam + "MotionTriggered")
                    elif "[motion-timer]" in x: x = x.replace("[motion-timer]", mrnam + "MotionTimer")
                    elif "[motion-location]" in x: x = x.replace("[motion-location]", mrlbl)
                    
                    rulesfile.append(x + "\n")
        rulesfile.append("\n")


    #garagedoors.append(tuple(["GarageDoor"+str(icnt)+"Switch", "GarageDoor"+str(icnt), "Garage door "+str(icnt), \
    #"var String activatingGarageDoor"+str(icnt)+"Msg = \"Activating, garage door "+str(icnt)+".\""]))
    with open(os.path.join(confdir, "rules-garage.frag"), 'r', encoding='utf-8') as fin:
        t = fin.readlines()
        
        for x in t:
            rulesgarage.append(x.strip("\n"))

    for itemname, inam, ilbl in garagedoors:
        for x in rulesgarage:
            if "[garage-label]" in x: x = x.replace("[garage-label]", ilbl)
            elif "[garage-switch]" in x: x = x.replace("[garage-switch]", itemname)
    
            rulesfile.append(x + "\n")
        rulesfile.append("\n")


    with open(os.path.join(confdir, "rules-end.frag"), 'r', encoding='utf-8') as fin:
        t = fin.readlines()
        for x in t:
            if "[morning-cron]" in x: x = x.replace("[morning-cron]", "0 " + str(int(morningtime.split(":")[1])) + " " + \
                str(int(morningtime.split(":")[0])) + " * * ?"  )
            elif "[day-cron]" in x: x = x.replace("[day-cron]", "0 " + str(int(daytime.split(":")[1])) + " " + \
                str(int(daytime.split(":")[0])) + " * * ?"  )
            elif "[evening-cron]" in x: x = x.replace("[evening-cron]", "0 " + str(int(eveningtime.split(":")[1])) + " " + \
                str(int(eveningtime.split(":")[0])) + " * * ?"  )
            elif "[night-cron]" in x: x = x.replace("[night-cron]", "0 " + str(int(nighttime.split(":")[1])) + " " + \
                str(int(nighttime.split(":")[0])) + " * * ?"  )
            elif "[internet-radio]" in x:          
                station = ""
                for c in range(15):
                    if radiochnls[c] != "":
                        station += "    } else if(InternetRadio.state == %d) {\n" \
                                   "        playStream(\"enhancedjavasound\", \"%s\")\n" \
                                   "        logInfo(\"Media\", \"%s\")\n" % (c+1, radiochnls[c], radiodescs[c])
                x = x.replace("[internet-radio]", station)
            rulesfile.append(x)

#     pprint(rulesfile)


    with open(os.path.join(confdir, "sarah.rules"), 'w', encoding='utf-8') as fout:
        fout.writelines(rulesfile)


    #  Create things file
    thingsfile = []

    with open(os.path.join(confdir, "things-beg.frag"), 'r', encoding='utf-8') as fin:
        t = fin.readlines()
        for x in t:
            if "[header-msg]" in x:
                x = x.replace("[header-msg]", headermsg)
            elif "[home-location-alt]" in x:
                thingsfile.append("// %s\n" % homedesc)
                x = x.replace("[home-location-alt]", "geolocation=\"%s,%s,%d\", interval=%d" % (homelatitude, homelongitude, 
                homealtitude, homerefresh))
            elif "[home-location]" in x:
                x = x.replace("[home-location]", "geolocation=\"%s,%s\", interval=%d" % (homelatitude, homelongitude, 
                homerefresh))
            thingsfile.append(x)

    with open(os.path.join(confdir, "sarah.things"), 'w', encoding='utf-8') as fout:
        fout.writelines(thingsfile)


    #  Create mail file
    mailfile = []

    with open(os.path.join(confdir, "mail.frag"), 'r', encoding='utf-8') as fin:
        t = fin.readlines()

    keys = [ ["hostname","emailhost"], ["port","emailport"], ["username","emailuser"], ["password","emailpasswd"], 
            ["from","emailfrom"], ["tls","emailusestarttls"], ["ssl","emailusessl"], ["popbeforesmtp","emailusepop"], 
            ["charset","emailcharset"] ]

    mailfile.append("# " + headermsg + "\n\n")

    with open(os.path.join(confdir, "mail.frag")) as fin:
        for x in fin:
            if "=" in x:
                name, sep, val = x.partition("=")
                if name[0] == "#": name = name[1:]

                found = False
                for key, var in keys:
                    if key == name:
                        found = True
                        break

                if found:
                    if cMaint[0][var] == 1:
                        val = "true"
                    elif cMaint[0][var] == 0:
                        val = "false"
                    else:
                        val = str(cMaint[0][var])

                    t = name + sep + val + "\n"
                    mailfile.append(t)
                else:
                    mailfile.append(x)

            else:
                mailfile.append(x)
            
    with open(os.path.join(confdir, "mail.cfg"), 'w', encoding='utf-8') as fout:
        fout.writelines(mailfile)

#     pprint(mailfile)


def installfiles():
#     print ("from sarah-installing...")

    confdir = r"/usr/local/sarah/www/conffiles"
    dstdir = r"/etc/openhab2"

    shutil.copyfile(os.path.join(confdir, "sarah.items"), os.path.join(dstdir, "items", "sarah.items"))
    shutil.copyfile(os.path.join(confdir, "sarah.sitemap"), os.path.join(dstdir, "sitemaps", "sarah.sitemap"))
    shutil.copyfile(os.path.join(confdir, "sarah.rules"), os.path.join(dstdir, "rules", "sarah.rules"))
    shutil.copyfile(os.path.join(confdir, "sarah.things"), os.path.join(dstdir, "things", "sarah.things"))
    shutil.copyfile(os.path.join(confdir, "mail.cfg"), os.path.join(dstdir, "services", "mail.cfg"))


def getThings(): 
    things  = []
    channels = []

    try:
        url = r"http://"+servername+"/rest/things"
        
        response = requests.get(url,verify=False) #, files=files)
#         print ('status code: ', response.status_code)
#         print ('status hdrs: ', response.headers)
        #print ( 'now: ', response)
    except:
        e = sys.exc_info()[0]
        print ( "Error: %s" % e )

        success = False
        return success, 'API call failed. Please check your network connection.'
    else:
        success = True
        #x=response.content
        r = response.json()  #.decode("ascii")
#         print ( 'r: ', r, response)

    for x in r:
#         print(x['label'])
        label = x['label']
        if label[:11] == "Z-Wave Node":
            things.append(label)
        
            for channel in x['channels']:
#                 print(channel['id'])
#                 print(channel['uid'])
                channels.append(tuple([label, channel['id'], channel['uid']]))

    things = sorted(things)
    channels = sorted(channels)

#     for x in things:
#         print(x)
# 
#     for x in channels:
#         print(x)

    return things, channels


def executeCmd(c, p1="", p2="", p3="", p4="", p5="", p6=""):
    cmd = []
    cmd.append(c)
    
    if p1:
        cmd.append(p1)
    if p2:
        cmd.append(p2)
    if p3:
        cmd.append(p3)
    if p4:
        cmd.append(p4)
    if p5:
        cmd.append(p5)
    if p6:
        cmd.append(p6)
    
#     print(cmd)
    ret = subprocess.check_call(cmd)

#     print(ret.communicate()[0])
#     print(ret.stdout.read())
#     print(ret)

    return ret


def executeCmdNoWait(c, p1="", p2="", p3="", p4="", p5="", p6=""):
    cmd = []
    cmd.append(c)
    
    if p1:
        cmd.append(p1)
    if p2:
        cmd.append(p2)
    if p3:
        cmd.append(p3)
    if p4:
        cmd.append(p4)
    if p5:
        cmd.append(p5)
    if p6:
        cmd.append(p6)
    
#     print(cmd)
    ret = subprocess.call(cmd)
#     print(ret)

    return ret


def executeCmdRet(c, p1="", p2="", p3="", p4="", p5="", p6=""):
    cmd = []
    cmd.append(c)
    
    if p1:
        cmd.append(p1)
    if p2:
        cmd.append(p2)
    if p3:
        cmd.append(p3)
    if p4:
        cmd.append(p4)
    if p5:
        cmd.append(p5)
    if p6:
        cmd.append(p6)
    
#     print(cmd)
#     ret = subprocess.check_call(cmd)
    ret = subprocess.Popen(cmd, stdout=subprocess.PIPE)
#     ret = subprocess.check_call(cmd,  shell=True)

#     print(ret.communicate()[0])
#     print(ret.stdout.read())
#     print(ret.communicate()[0])

    return ret.communicate()[0]
