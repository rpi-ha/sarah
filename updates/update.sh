#!/bin/bash

# add lines to run updates
LOG="update.log"
#cd /usr/local/sarah/updates
cd ${0%/*}

echo `date`
echo "    ${0%/*}"

echo `date` >> $LOG
echo "    ${0%/*}" >> $LOG