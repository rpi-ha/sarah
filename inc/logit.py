#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Jan 8, 17:21:53 2019

@author: seeLive
"""


import logging, os, shutil
from logging.handlers import RotatingFileHandler
#from logging.handlers import WatchedFileHandler

file   = ''
name   = ''
size   = 1*1024*1024
bkps   = 3
logger = logging.getLogger(name)
log_hndlr = None
level  = 20
#Log levels
#-----------
#CRITICAL 50 
#ERROR 40 
#WARNING 30 
#INFO 20 
#DEBUG 10 
#NOTSET 0 


def init(loglevel):
    global log_hndlr

    log_hndlr = RotatingFileHandler(file, mode='a', maxBytes=size, backupCount=bkps, encoding='utf-8', delay=False)
#     log_hndlr = logging.FileHandler(file)
    formatter = logging.Formatter('[%(asctime)s] p%(process)s %(levelname)s - %(message)s','%m-%d-%y %H:%M:%S')
    log_hndlr.setFormatter(formatter)
    logger.addHandler(log_hndlr)

#    logging.basicConfig(format='[%(asctime)s] p%(process)s %(levelname)s - %(message)s',filename=file,filemode='a',datefmt='%m/%d/%Y %I:%M:%S %p')

#    log_hndlr = RotatingFileHandler(file, mode='a', maxBytes=size, backupCount=bkps, encoding='utf-8', delay=False)
#    log_hndlr = RotatingFileHandler(file, maxBytes=size, backupCount=bkps)
#    log_hndlr = logging.handlers.WatchedFileHandler(file)
#    formatter = logging.Formatter('[%(asctime)s] p%(process)s %(levelname)s - %(message)s','%m-%d-%y %H:%M:%S')
#    #formatter = logging.Formatter('[%(asctime)s] {%(filename)s:%(lineno)d} %(levelname)s - %(message)s','%m-%d-%y %H:%M:%S')
#    log_hndlr.setFormatter(formatter)
#    logger.addHandler(log_hndlr)
    
    if loglevel == 'critical':
        logger.setLevel(logging.CRITICAL)
    elif loglevel == 'error':
        logger.setLevel(logging.ERROR)
    elif loglevel == 'warning':
        logger.setLevel(logging.WARNING)
    elif loglevel == 'debug':
        logger.setLevel(logging.DEBUG)
    else:
        logger.setLevel(logging.INFO)

    return logging.getLogger(name).getEffectiveLevel()


def rotate():
    print ( 'rotating logs...')
    log_hndlr.flush()
#        for handler in log_hndlr:
#            handler.close()
#            handler.removeHandler(handler)
#        log = logging.getLogger(logger_name)

##        for i in list(logger.handlers):
#        for i in list(logging._handlers.copy()):
#            logger.removeHandler(i)
#            i.flush()
#            i.close()

#        logger.removeHandler(log_hndlr)
#        log_hndlr.close()
##        os.rename(filename, filename[7:])
#        logging.shutdown()


    try:
        print ( file + str(bkps))
        os.remove(file + str(bkps))
    except OSError as e:
        print ( "Error: %s" % e, e.errno, e.strerror )

    for i in reversed(range(bkps)):
        print ( i)

        try:
            if i == 0:
                print ( file, file + str(i+1))
                shutil.copy2(file, file + str(i+1))
                #os.rename(file, file + str(i+1))
            else:
                print ( file + str(i), file + str(i+1))
                os.rename(file + str(i), file + str(i+1))
        except OSError as e:
            print ( "Error: %s" % e, e.errno, e.strerror )

    with open(file, 'w', encoding='utf-8') as fout:
        fout.writelines('')


def write(loglevel, msg):
    if level <= 20: print ( msg)

    if loglevel == 'critical':
        logger.critical(msg)
    elif loglevel == 'error':
        logger.error(msg)
    elif loglevel == 'warning':
        logger.warning(msg)
    elif loglevel == 'debug':
        logger.debug(msg)
    else:
        logger.info(msg)

    #print ( size, os.path.getsize(file))

#   for windows to overcome file lock bug
#     if os.path.getsize(file) >= size:
#         rotate()

