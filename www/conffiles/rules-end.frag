rule "Close all garage doors"
when
    Item GarageCloseAllSwitch received update ON
then
    var boolean doorsOpen = false
    
    if(SilentSwitch.state != ON) { 
        sayText.apply(attemptingCloseAllGarageDoorsMsg)
    }

	/* GarageDoors.members.forEach(door| 
		if(door.state == ON || door.state == OPEN) { 
            //GarageDoor1Switch  GarageDoor2
            //var String switch = door.name.toString.substring(0, door.name.toString.indexOf('_')) + "Switch"
            logInfo("Garagedoor", door.state.toString + " - " + door.name.toString)
			    door.sendCommand(ON) 
			    doorsOpen = true
		}
	) */
	
    GarageDoors.members.forEach(door| 
		if(door.state == ON || door.state == OPEN) {  // || door.state == OFF || door.state == CLOSED) { 
            //logInfo("Garagedoor", door.name.toString + " - " + door.state.toString)
            
			if(door.name.contains('GarageDoor1')) { 
			    GarageDoor1Switch.sendCommand(ON) 
			    doorsOpen = true
			} else if(door.name.contains('GarageDoor2')) { 
			    GarageDoor2Switch.sendCommand(ON) 
			    doorsOpen = true
			} else if(door.name.contains('GarageDoor3')) { 
			    GarageDoor3Switch.sendCommand(ON) 
			    doorsOpen = true
			} else if(door.name.contains('GarageDoor4')) { 
			    GarageDoor4Switch.sendCommand(ON) 
			    doorsOpen = true
			} else if(door.name.contains('GarageDoor5')) { 
			    GarageDoor5Switch.sendCommand(ON) 
			    doorsOpen = true
			} else if(door.name.contains('GarageDoor6')) { 
			    GarageDoor6Switch.sendCommand(ON) 
			    doorsOpen = true
			}
		}
	)

    if(SilentSwitch.state != ON && !doorsOpen) { 
        sayText.apply(noGarageDoorsOpenMsg)
    }
end


rule "Set Vacation mode"
when
    Time cron "0 5-55/10 * * * ?" or
    Item VacationSwitch received update ON
then
    if(VacationSwitch.state == ON && VacationIsRunningSwitch.state == OFF) {
        VacationIsRunningSwitch.sendCommand(ON) 

        var long startTime      = 0
        var long endTime        = 0
        var int devicesCount    = 0
        var int randDevice      = 0
        var int chgOutdoorLight = 0
        var int numLightsOn     = 0
        var long delaySecs      = 0
        var long startDelay     = 0
        var boolean wasTriggered = false

        var GenericItem lightInside  = null
        var GenericItem lightOutside = null

        var String currentDateTimeString = now.toString("yyyy-MM-dd'T'HH:mm:ss.SSSZ")
        var String currentDateTimeLeft = currentDateTimeString.substring(0, 11)
        var String currentDateTimeRight = currentDateTimeString.substring(16, currentDateTimeString.length)
        var String wakeDateTimeString = currentDateTimeLeft + wakeTimeHours + currentDateTimeRight
        var String bedDateTimeString = currentDateTimeLeft + bedTimeHours + currentDateTimeRight

        var long sunriseEpoch = (Sunrise_Start_Time.state as DateTimeType).getZonedDateTime.toInstant.toEpochMilli
        var long sunsetEpoch  = (Sunset_Start_Time.state as DateTimeType).getZonedDateTime.toInstant.toEpochMilli - (30*60*1000L)
        var long currentEpoch = new DateTime(currentDateTimeString).millis  //now.millis
        var long wakeEpoch    = new DateTime(wakeDateTimeString).millis
        var long bedEpoch     = new DateTime(bedDateTimeString).millis

        var String sunriseDateTimeString = new DateTime(sunriseEpoch).toString	
        var String sunsetDateTimeString = new DateTime(sunsetEpoch).toString
        
        // adjust times if bed time is next day
        if(bedTimeIsNextDay) {
            bedEpoch          = bedEpoch + (24*60*60*1000L)
            bedDateTimeString = new DateTime(bedEpoch).toString

            sunriseEpoch          = sunriseEpoch + (24*60*60*1000L) + (60*1000L)  // plus one minute for changing sun position
            sunriseDateTimeString = new DateTime(sunriseEpoch).toString
        }

        var int outdoorTimeoutMins

        logInfo("Vacation", "sun: " + sunriseEpoch + " - " + sunsetEpoch)
        logInfo("Vacation", "curr: " + currentEpoch)
        logInfo("Vacation", "wake: " + wakeEpoch + " - " + bedEpoch)
        logInfo("Vacation", "")
    
        logInfo("Vacation", "sun: " + sunriseDateTimeString + " - " + sunsetDateTimeString)
        logInfo("Vacation", "curr: " + currentDateTimeString + " - " + currentDateTimeLeft + " - " + currentDateTimeRight)
        logInfo("Vacation", "wake: " + wakeTimeHours + " - " + wakeDateTimeString)
        logInfo("Vacation", "bed: " + bedTimeHours + " - " + bedDateTimeString)
        logInfo("Vacation", "")
    

        // account for all combinations of waking, bed time, sunrise & sunset
        // and get start and end time for all periods of darkness during waking hours
        if(!bedTimeIsNextDay && (wakeEpoch < sunriseEpoch && bedEpoch <= sunsetEpoch)) {
            startTime = wakeEpoch
            endTime   = sunriseEpoch
            logInfo("Vacation", "rule 1 fired")
        } else if(!bedTimeIsNextDay && (wakeEpoch < sunriseEpoch && bedEpoch > sunsetEpoch) && (currentEpoch >= wakeEpoch && currentEpoch < sunriseEpoch)) {
            startTime = wakeEpoch
            endTime   = sunriseEpoch
            logInfo("Vacation", "rule 2 fired")
        } else if(!bedTimeIsNextDay && (wakeEpoch < sunriseEpoch && bedEpoch > sunsetEpoch) && (currentEpoch >= sunsetEpoch && currentEpoch < bedEpoch)) {
            startTime = sunsetEpoch
            endTime   = bedEpoch
            logInfo("Vacation", "rule 3 fired")
        } else if(!bedTimeIsNextDay && (wakeEpoch >= sunriseEpoch && bedEpoch > sunsetEpoch)) {
            startTime = sunsetEpoch
            endTime   = bedEpoch
            logInfo("Vacation", "rule 4 fired")

        } else if(bedTimeIsNextDay && (wakeEpoch < sunsetEpoch && bedEpoch <= sunriseEpoch)) {
            startTime = sunsetEpoch
            endTime   = bedEpoch
            logInfo("Vacation", "rule 5 fired")
        } else if(bedTimeIsNextDay && (wakeEpoch >= sunsetEpoch && bedEpoch <= sunriseEpoch)) {
            startTime = wakeEpoch
            endTime   = bedEpoch
            logInfo("Vacation", "rule 6 fired")
        } else if(bedTimeIsNextDay && (wakeEpoch <= sunsetEpoch && bedEpoch > sunriseEpoch)) {
            startTime = sunsetEpoch
            endTime   = sunriseEpoch
            logInfo("Vacation", "rule 7 fired")
        } else if(bedTimeIsNextDay && (wakeEpoch > sunsetEpoch && bedEpoch > sunriseEpoch)) {
            startTime = wakeEpoch
            endTime   = sunriseEpoch
            logInfo("Vacation", "rule 8 fired")
        } else {
            startTime = currentEpoch
            endTime   = currentEpoch
            logInfo("Vacation", "rule 0 fired")
        }
    
        if(startTime != currentEpoch) {
            if((Math::random * 2.0).intValue == 1) {
                logInfo("Vacation", "start: plus")
                startTime = startTime + ((Math::random * 27.0).intValue)*60*1000L
            } else {
                logInfo("Vacation", "start: minus")
                startTime = startTime - ((Math::random * 27.0).intValue)*60*1000L
            }
            if((Math::random * 2.0).intValue == 1) {
                logInfo("Vacation", "end: plus")
                endTime = endTime + ((Math::random * 38.0).intValue)*60*1000L
            } else {
                logInfo("Vacation", "end: minus")
                endTime = endTime - ((Math::random * 38.0).intValue)*60*1000L
            }
        }

        logInfo("Vacation", "start: " + startTime + " - " + endTime)
        logInfo("Vacation", "start: " + new DateTime(startTime).toString + " - " + new DateTime(endTime).toString)

        Lights.members.forEach(light| devicesCount = devicesCount + 1)
        if(devicesCount <= minLightsOn) { minLightsOn = devicesCount - 1 }
        logInfo("Vacation", "devices " + devicesCount + " - " + minLightsOn)

        if(devicesCount < 2 || minLightsOn < 1) { 
            logInfo("Vacation", "Please select at least 2 lights for Vacation mode and make sure the minimum number of lights is set appropriately from the SCC.")
        }

        // wait to start at calculated time if close
        if(VacationTestSwitch.state != ON) {
            startDelay = ((startTime - currentEpoch)/1000)
            if(startDelay < 3600 && startDelay > 0) {
                logInfo("Vacation", "waitForInside " + startDelay + " - " + startDelay/60)
                delaySome.apply( startDelay, VacationSwitch, "Vacation")

                currentEpoch = now.millis
                logInfo("Vacation", "curr: " + currentEpoch + " - " + new DateTimeType(new DateTime(currentEpoch).toString))
            }
        }

        while ((currentEpoch >= startTime && currentEpoch < endTime) || (VacationSwitch.state == ON && VacationTestSwitch.state == ON)) {
            wasTriggered = true
            logInfo("Vacation", "loop " + " - " + startTime + " - " + currentEpoch + " - " + endTime)
            logInfo("Vacation", "loop " + " - " + new DateTime(startTime).toString + " - " + new DateTime(currentEpoch).toString + " - " + new DateTime(endTime).toString)

            // make sure at least one vacation button is on
            if(VacationInsideSwitch.state != ON && VacationOutsideSwitch.state != ON) {
                VacationInsideSwitch.sendCommand(ON)
            }


            logInfo("Vacation", "indoor: ")

            if(VacationInsideSwitch.state == ON) {
                // pick an indoor light
                lightInside = null

                while (lightInside === null) {
                    numLightsOn  = 0
                    Lights.members.forEach(light| 
                        if(light.state == ON && light.label.contains('*') && !light.label.toLowerCase.contains('outside')) { 
                            numLightsOn = numLightsOn + 1
                            logInfo("Vacation", "light is on: " + light.label + " - " + light.state)
                        }
                    )
                    logInfo("Vacation", "numLightsOn: " + numLightsOn + " - " + minLightsOn)

                    randDevice = (Math::random * devicesCount).intValue
                    lightInside = Lights.members.get(randDevice)
                    logInfo("Vacation", "light for inside guess: " + randDevice + " - " + lightInside.label)

                    if(lightInside.label.contains('*') && !lightInside.label.toLowerCase.contains('outside')) {
                        logInfo("Vacation", "light for inside: " + lightInside.label + " - " + lightInside.state)

                        if(lightInside.state != ON) {
                            lightInside.sendCommand(ON)
                            delaySomeSecs.apply(5, "Vacation")
                            lightInside.sendCommand(ON)
                            numLightsOn = numLightsOn + 1
                            logInfo("Vacation", "light inside - on: " + lightInside.label + " - " + lightInside.state)
                        } else {
                            if(numLightsOn > minLightsOn) {
                                if((Math::random * 10.0).intValue < 5) {
                                    lightInside.sendCommand(OFF)
                                    delaySomeSecs.apply(5, "Vacation")
                                    lightInside.sendCommand(OFF)
                                    numLightsOn = numLightsOn - 1
                                    logInfo("Vacation", "light inside - off: " + lightInside.label + " - " + lightInside.state)
                                }
                            }
                        }

                        logInfo("Vacation", "numLightsOn: " + numLightsOn + " - " + minLightsOn)

                        if(numLightsOn < minLightsOn) {
                            lightInside = null
                            logInfo("Vacation", "loop around - too few")
                        } else {
                            //logInfo("Vacation", "wait...")
                        }
                    } else { 
                        lightInside = null
                        logInfo("Vacation", "loop around - no * or is outside")
                    }
                }
            }

            delaySecs = ((Math::random * 29.0).intValue + 19) * 60
            logInfo("Vacation", "waitForOutside " + delaySecs + " - " + delaySecs/60)
            if(VacationTestSwitch.state != ON) {
                delaySome.apply( delaySecs, VacationSwitch, "Vacation")
            }


           if(VacationSwitch.state == OFF || currentEpoch >= endTime) {
                currentEpoch = endTime
            } else {
                logInfo("Vacation", "outdoor: ")
                chgOutdoorLight = (Math::random * 3.0).intValue
                logInfo("Vacation", "chgOutdoorLight: " + chgOutdoorLight)
                if(VacationOutsideSwitch.state == ON && chgOutdoorLight == 1) {
                    // pick an outdoor light
                    lightOutside = null
                    while (lightOutside === null) {
                        randDevice = (Math::random * devicesCount).intValue
                        lightOutside = Lights.members.get(randDevice)

                        if(lightOutside.label.contains('*') && lightOutside.label.toLowerCase.contains('outside')) {

                            logInfo("Vacation", "light for outside: " + lightOutside.label + " - " + lightOutside.state)
                            if(lightOutside.state != ON) {
                                lightOutside.sendCommand(ON)

                                outdoorTimeoutMins = (Math::random * 20.0).intValue + 8
                                logInfo("Vacation", "outdoor timeout mins - " + outdoorTimeoutMins)
                                vacationOutsideTriggeredTimer = createTimer(now.plusMinutes(outdoorTimeoutMins), [|
                                    logInfo("Vacation", "cancel outdoor light timer")

                                    lightOutside.sendCommand(OFF)
                                    delaySomeSecs.apply(5, "Vacation")
                                    lightOutside.sendCommand(OFF)

                                    vacationOutsideTriggeredTimer.cancel
                                    vacationOutsideTriggeredTimer = null
                                ])
                            } else {
                                lightOutside.sendCommand(OFF)
                                delaySomeSecs.apply(5, "Vacation")
                                lightOutside.sendCommand(OFF)
                            }

                        } else { 
                            lightOutside = null
                        }
                    }

                    delaySecs = ((Math::random * 14.0).intValue + 24) * 60
                    logInfo("Vacation", "eol wait...  " + delaySecs + " - " + delaySecs/60)
                    if(VacationTestSwitch.state != ON) {
                        delaySome.apply( delaySecs, VacationSwitch, "Vacation")
                    }
                }

                logInfo("Vacation", "")

                //currentTime = String::format( "%1$tH:%1$tM", new java.util.Date )
                currentEpoch = now.millis
                logInfo("Vacation", "curr: " + currentEpoch + " - " + new DateTimeType(new DateTime(currentEpoch).toString))             
            }

            if(VacationTestSwitch.state == ON) {
                logInfo("Vacation", "test wait...  ")
                delaySomeSecs.apply(20, "Vacation")
            }
        }

        if(VacationSwitch.state == ON && wasTriggered == true) {
            // go through lights in reverse and turn off one by one???
            // would have to find lights in each group

            // find these groups
            //Garden.members.filter[i|i.state == ON].forEach[i | i.sendCommand(OFF)]
            //Basement.members.filter[i|i.state == ON].forEach[i | i.sendCommand(OFF)]
            //Groundfloor.members.filter[i|i.state == ON].forEach[i | i.sendCommand(OFF)]
            //Secondfloor.members.filter[i|i.state == ON].forEach[i | i.sendCommand(OFF)]
            //Attic.members.filter[i|i.state == ON].forEach[i | i.sendCommand(OFF)]

            Lights.sendCommand(OFF)
            delaySomeSecs.apply(5, "Vacation")
            Lights.sendCommand(OFF)
        }
        logInfo("Vacation", "exit vacation loop")
        VacationIsRunningSwitch.sendCommand(OFF)
    }
end


/* rule "Set Nightlight mode"
when
    //Time cron "0 * / 6 * * * ?" or
    //Time cron "0 0 16 * * ?" or
    Channel 'astro:sun:local:set#event' triggered START or
    Item NightlightSwitch received update ON
then
    //if(  time is >= sunset
    // turn on all lights with ! in name
    // turn them off at night time
    //logInfo("Nightlight", Sunset_Start_Time)
end */


/* rule "Set away mode"
when
    Item AwaySwitch received update
then
    if(AwaySwitch.state == ON) {
        //FOSCAMIPCamera001_EnableDisableTheMotionAlarm.sendCommand(ON)
        //FOSCAMIPCamera002_EnableDisableTheMotionAlarm.sendCommand(ON)

        logInfo("Mode", "away mode is on.")
    } else if(AwaySwitch.state == OFF) {
        //FOSCAMIPCamera001_EnableDisableTheMotionAlarm.sendCommand(OFF)
        //FOSCAMIPCamera002_EnableDisableTheMotionAlarm.sendCommand(OFF)

        logInfo("Mode", "away mode is off.")
    }
end */


rule "Set Morning mode"
when
    Time cron "[morning-cron]" //or
    //Time cron "0 0 6 * * ?" //or
    //Item MorningSwitch received update ON
then
    MorningSwitch.sendCommand(ON)
    DaySwitch.sendCommand(OFF)
    EveningSwitch.sendCommand(OFF)
    NightSwitch.sendCommand(OFF)
    logInfo("Mode", "set mode to morning")
end


rule "Set Day mode"
when
    Time cron "[day-cron]" //or
    //Time cron "0 0 10 * * ?" //or
    //Item DaySwitch received update ON
then
    DaySwitch.sendCommand(ON)
    MorningSwitch.sendCommand(OFF)
    EveningSwitch.sendCommand(OFF)
    NightSwitch.sendCommand(OFF)
    if(SilentSwitch.state == ON && SilentFollowsModeSwitch.state == ON) {
        SilentSwitch.sendCommand(OFF)
    }
    logInfo("Mode", "set mode to day")
end


rule "Set Evening mode"
when
    Time cron "[evening-cron]" //or
    //Time cron "0 0 17 * * ?" //or
    //Item EveningSwitch received update ON
then
    EveningSwitch.sendCommand(ON)
    MorningSwitch.sendCommand(OFF)
    DaySwitch.sendCommand(OFF)
    NightSwitch.sendCommand(OFF)
    logInfo("Mode", "set mode to evening")
end


rule "Set Night mode"
when
    Time cron "[night-cron]" //or
    //Time cron "0 0 23 * * ?" //or
    //Item NightSwitch received update ON
then
    NightSwitch.sendCommand(ON)
    MorningSwitch.sendCommand(OFF)
    DaySwitch.sendCommand(OFF)
    EveningSwitch.sendCommand(OFF)
    if(SilentSwitch.state == OFF && SilentFollowsModeSwitch.state == ON) {
        SilentSwitch.sendCommand(ON)
    }
    logInfo("Mode", "set mode to night")
end


rule "Play doorbell"
when
    Item DoorbellSwitch received update ON
then
    val ReentrantLock lock  = new ReentrantLock()
    lock.lock
    try {

    //var String rtn = ""

	playSoundFile.apply("doorbell.mp3")
    //val results = executeCommandLine("/usr/bin/omxplayer@@/etc/openhab2/sounds/doorbell.mp3@@-o@@alsa@@--no-osd",5000)
    //logInfo("Exec",results)

    } finally{
        lock.unlock()
    }
end


rule "Play dog barking"
when
    Item DogbarkSwitch received update ON
then
    val ReentrantLock lock  = new ReentrantLock()
    lock.lock
    try {

    //var String rtn = ""

	playSoundFile.apply("barking.mp3")
    //val results = executeCommandLine("/usr/bin/omxplayer@@/etc/openhab2/sounds/barking.mp3@@-o@@alsa@@--no-osd",5000)
    //logInfo("Exec",results)

    } finally{
        lock.unlock()
    }
end


rule "InternetRadio received update"
when
    Item InternetRadio received update
then
    if(InternetRadio.state == 0) {
        playStream("enhancedjavasound", null)
        logInfo("Media", "off")
[internet-radio]
    }
end


rule "InternetRadioVolume received update"
when
    Item InternetRadioVolume received update
then
    executeCommandLine("python3@@/usr/bin/setvol.py@@" + triggeringItem.state,5000)
    //logInfo("Media", "volume: " + vol + " - " + results)
end
