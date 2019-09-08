#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue July  13 20:50:00 2019

@author: seeLive
"""


from datetime import datetime, timedelta
from time import gmtime, strftime, localtime
from json import loads
import json, sys, time, os, re, glob
from pprint import pprint
import subprocess, traceback
sys.path.insert(0, "/usr/local/sarah/inc")
import logit
sys.path.insert(0, "/usr/local/sarah/www")
import sarah


os.chdir(os.path.dirname(os.path.realpath(__file__)))
rootdir = os.getcwd()

hostname = os.uname()[1] + ".local"
hostport = "8181"

logit.file  = 'install.log'
logit.name  = 'install'
logit.size  = 1*1024*1024
loggerlevel = logit.init('debug')
logit.level = loggerlevel

# logit.write( 'debug', 'init... ')
# logit.write( 'debug', 'hostname: %s:%s' % (hostname, hostport))
# logit.write( 'debug', '%d %d' % (loggerlevel, logit.level))
# logit.write( 'debug', 'cwd: %s' % (rootdir))
# print()



logit.write( "info", "")
logit.write( "info", ">>>>>>>>>>>>>>>>>>>>>>>> Install S.A.R.A.H. updates - begin <<<<<<<<<<<<<<<<<<<<<<<<")


# check for updates
logit.write( "info", "Checking for updates - begin")
logit.write( "info", "--- checking updates")

resp = ""
success = False
try:
    updates, haserrors, hasnew, msg = sarah.checkUpdates()
#     print(updates, haserrors, hasnew, msg)
#     raise Exception("Sorry, no numbers below zero")
except:
    e = sys.exc_info()[1]
    resp = "------ Error: %s" % e
else:
    resp = "------ OK"
    success = True

logit.write( "info", resp)
logit.write( "info", "Checking for updates - end")


# logit.write( "info", updates)
# logit.write( "info", str(haserrors) + " - " + str(hasnew) + " - " + str(msg))
# hasnew = True


# get current version
if success:
    logit.write( "info", "")
    logit.write( "info", "Get current version - begin")
    logit.write( "info", "--- get version")

    success = False
    try:
#         currver = sarah.loadver()   -  use this for 1.6.6 and >
        with open("/usr/local/sarah/www/version", 'r', encoding='utf-8') as fin:
            currver = fin.readline()
    #     raise Exception("Sorry, no numbers below zero")
        logit.write( "info", "------ found version: %s" % currver)
    except:
        e = sys.exc_info()[1]
        resp = "------ Error: %s" % e
    else:
        resp = "------ OK"
        success = True

    logit.write( "info", resp)
    logit.write( "info", "Get current version - end")


    
# install updates
if success:
    logit.write( "info", "")
    logit.write( "info", "Install updates - begin")
    logit.write( "info", "--- finding updates")

    resp = ""
    errmsg = "Install had ERRORS!"
    success = False
    if haserrors:
        logit.write( "info", "------ The following previous updates had errors:")
        for update in updates:
            if update[1] == "error":        
                logit.write( "info", "--------- update - [" + str(update[0]) + "] - failed.")
                logit.write( "info", "------------ see the logs under \'/usr/local/sarah/updates/%s/_out\'" % str(update[0]))
                logit.write( "info", "------------ delete \'/usr/local/sarah/updates/%s/_out/error\' to clear the error" % str(update[0]))
                logit.write( "info", "------------ after you have addressed the original problem")
        logit.write( "info", "------ Please do NOT attempt to install further updates until this is resolved!")

    elif hasnew:
        noinstall = False
        for update in updates:
            if update[1] == "new" and update[0] > currver:        
                logit.write( "info", "------ found update " + str(update[0]) )
                logit.write( "info", "------ (see install log below)")

                try:
                    log = sarah.executeCmdRet('python3', str(update[0]) + "/run.py")
                    log = log.decode("utf-8")
                    logit.write( "info", log)
#                     raise Exception("Sorry, no numbers below zero")
                    if errmsg in log:
                        raise Exception("Install updates has ERRORS!")

#                     logit.write( "info", ret)
                except:
                    e = sys.exc_info()[1]
                    resp = "------ Error: %s" % e
                    resp += "\n------ this log can be found at - /usr/local/sarah/updates/install.log"
                    success = False
                    break
                else:
                    resp = "------ Install updates completed successfully."
                    success = True
            else:
                noinstall = True
    else:
        resp = "------ There were no updates to install."
        success = True

    if not success and noinstall:
        resp = "------ There were no updates to install."
    

    logit.write( "info", "")
    logit.write( "info", resp)
    logit.write( "info", "Install updates - end")



logit.write( "info", ">>>>>>>>>>>>>>>>>>>>>>>> Install S.A.R.A.H. updates - end <<<<<<<<<<<<<<<<<<<<<<<<")
