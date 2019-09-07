#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue July  13 20:50:00 2019

@author: seeLive
"""


import sys, os, glob
from pprint import pprint
import subprocess, traceback
sys.path.insert(0, "/usr/local/sarah/inc")
import logit
# sys.path.insert(0, "/usr/local/sarah/www")
# import sarah


os.chdir(os.path.dirname(os.path.realpath(__file__)))
rootdir = os.getcwd()

logit.file  = 'update.log'
logit.name  = 'update'
logit.size  = 1*1024*1024
loggerlevel = logit.init('debug')
logit.level = loggerlevel

# logit.write( 'debug', 'init... ')
# logit.write( 'debug', '%d %d' % (loggerlevel, logit.level))
# logit.write( 'debug', 'cwd: %s' % (rootdir))
# print()



logit.write( "info", "")
logit.write( "info", ">>>>>>>>>>>> Update files - begin <<<<<<<<<<<<")



logit.write( "info", "Pull files from git - begin")
logit.write( "info", "--- pull files")

success = False
try:
    os.chdir("../")

    cmd = ['git', 'pull', 'origin', 'prod']
    p1 = subprocess.Popen(cmd, stderr=subprocess.PIPE, stdout=subprocess.PIPE, shell=True, close_fds=True)
    stdout,stderr = p1.communicate()
    rc = p1.returncode

    os.chdir(rootdir)
except:
    e = sys.exc_info()[1]
    resp = "------ Error: %s\n" % e

#     print('exit code: %s' % (e.returncode))
    if e.stderr:
        resp += '%s\n' % (e.stderr.strip().decode('utf-8'))
    if e.stdout:
        resp += '%s\n' % (e.stdout.strip().decode('utf-8'))
else:
    resp = "------ OK\n"
    if stderr:
        resp += '%s\n' % (stderr.strip().decode('utf-8'))
    if stdout:
        resp += '%s\n' % (stdout.strip().decode('utf-8'))

    success = True

logit.write( "info", resp)
logit.write( "info", "Pull files from git - end")



logit.write( "info", ">>>>>>>>>>>> Update files - end <<<<<<<<<<<<")
