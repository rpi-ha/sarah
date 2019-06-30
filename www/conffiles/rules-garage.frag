rule "Activate [garage-label]"
when
    Item [garage-switch] received update ON
then
    if(SilentSwitch.state != ON && AnnounceGarageDoorsSwitch.state == ON) {
        sayText.apply("Activating, [garage-label].")
    }
    [garage-switch].sendCommand(OFF)
end
