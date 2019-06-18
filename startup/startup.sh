#!/bin/bash

# resize partition on first boot
ok="/usr/local/sarah/startup/ok"
if [ ! -e "$ok" ]
then
    echo "ok" > "$ok"
    #sudo raspi-config --expand-rootfs && sudo reboot
else
    echo "$ok - already exists."
fi

