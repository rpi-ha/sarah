rule "Motion sensor [motion-room-lbl] received ON"
when
    Item [motion-alarm] received update ON or
    Item [motion-alarm] received update OPEN
then
	//*** update these as needed ***//
	var GenericItem deviceLight        = [light-binary]
	val String motionLocation          = "[motion-location]"
	//var boolean motionIsOutside        = [is-outside]

	//*** leave these as is ***//
	val String motionSpeak             = [motion-msg]
	val int lumiLevel                  = [motion-lumi]
	val int timeoutMins                = [motion-timeout]
	val String lumiName                = triggeringItem.name.substring(0, triggeringItem.name.toLowerCase.indexOf('_alarm')) + '_Lumi'
	var GenericItem deviceMotionLumi   = Luminance.members.findFirst[ a | a.name == lumiName]
	//var String rtn                     = ""

	logInfo("Motion", "=> Motion sensor activated - " + motionLocation)
	logInfo("Motion", "    state: " + triggeringItem.state.toString)
	logInfo("Motion", "prevstate: " + triggeringItem.previousState(true).state.toString)
	logInfo("Motion", " litstate: " + deviceLight.state.toString)
    logInfo("Motion", " [motion-triggered]: " + [motion-triggered])

	if(deviceMotionLumi.state <= lumiLevel && deviceLight.state == OFF) {
		deviceLight.sendCommand(ON)

		if(! [motion-triggered]) {
    		[motion-triggered] = true
    		
			if(SilentSwitch.state != ON && AnnounceInsideMotionSwitch.state == ON) {
                //say(motionSpeak)
                sayText.apply(motionSpeak)
			}
		}
	} else if(deviceMotionLumi.state > lumiLevel) {
	    //if(deviceLight.state == ON) {
		//	deviceLight.sendCommand(OFF)
		//	delaySomeSecs.apply(5, "Motion")
		//	deviceLight.sendCommand(OFF)
		//}

		[motion-triggered] = false
	}

	//*** update this timer with appropriate global timer ***//
	if([motion-timer] === null) {
		logInfo("Motion", "activate motion timer - " + motionLocation)

		//*** update these 3 entries with appropriate global timer ***//
		[motion-timer] = createTimer(now.plusMinutes(timeoutMins), [|
			logInfo("Motion", "cancel motion timer - " + motionLocation)

			deviceLight.sendCommand(OFF)
			delaySomeSecs.apply(5, "Motion")
			deviceLight.sendCommand(OFF)
		
			[motion-timer].cancel
			[motion-timer] = null
			[motion-triggered] = false
		])
	} else {
		//*** update this timer with appropriate global timer ***//
		[motion-timer].reschedule(now.plusMinutes(timeoutMins))
		logInfo("Motion", "add time to motion timer - " + motionLocation)
	}
end

