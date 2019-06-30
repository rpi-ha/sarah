// voice messages
// N.B. spelling phonetically sometimes sounds better!
//      commas (,) are pauses
var String waterHeaterAlarmMsg      = "Pardon me, but the water heater is leaking. You should fix it right away."
var String newMailMsg               = "Uh hum, pardon me, but, youv got male!"
var String attemptingCloseAllGarageDoorsMsg = "Attempting, to close all garage doors for you now."
var String noGarageDoorsOpenMsg     = "No garage doors were open."
var int internetRadio               = 0
var int internetRadioVol            = 0


// Alarm settings
var String alarmCommand           = ""
var int alarmEnabledTimeoutSecs   = 60
//var boolean alarmEnabled          = false

var Timer alarmTriggeredTimer     = null
var boolean alarmTriggered        = false
var int alarmTriggeredTimeoutMins = 20
var int sirenTimeoutSecs          = 1200  // must be < ((alarmTriggeredTimeoutMins * 60) - alarmEnabledTimeoutSecs) !!

var Timer motionInsideTriggeredTimer     = null
var boolean motionInsideTriggered        = false
var int motionInsideTriggeredTimeoutMins = 10

var Timer tamperDisabledTimer      = null
var Timer tamperTriggeredTimer     = null
var boolean tamperTriggered        = false

var int tamperDisabledTimeoutMins  = 20
var int tamperTriggeredTimeoutMins = 10
//var boolean tamperEnabled          = true

// Vacation mode
var Timer vacationOutsideTriggeredTimer = null



val sendEmail = [ String list, String subject, String msg, String logFile |
    if(EnableEmailSwitch.state == ON) {
        //sendMail("you@email.net", "Test", "This is the message.", attachmentUrlList)
        sendMail(list, subject, "Date/Time: " + new DateTime(now.millis).toString("yyyy-MM-dd HH:mm:ss") + "\n\n" + msg)
        logInfo(logFile, "Email sent: " + subject)
    }
]

val sirenLoop = [ int sirenTimeoutSecs, GenericItem someItem, String logFile |
    var int countDown = sirenTimeoutSecs
	var int sleepMils = 1000

    logInfo(logFile, "now: siren loop - started (" + sirenTimeoutSecs.toString + " - secs)" )

    try {
        while (true) {
            Sirens.sendCommand(ON)
            Thread.sleep(sleepMils)
            countDown = countDown - (sleepMils / 1000)
            if(someItem.state == OFF || countDown <= 0 || Sirens.state == OFF) {
                Sirens.sendCommand(OFF)
                throw new RuntimeException()
            }
            //logInfo("Alarm", "now: siren loop - " + countDown)
        }
    } catch(Exception e) {
        Sirens.sendCommand(OFF)
        logInfo("Alarm", "now: siren loop - exited")
    }
]

val delaySome = [ long delaySecs, GenericItem someItem, String logFile |
    logInfo(logFile, "now: delay loop - " + delaySecs + " (" + delaySecs / 60 + ")" )

    try {
        var long sleepMils = 1000
        var long countDown = delaySecs
        while (true) {
            Thread.sleep(sleepMils)
            countDown = countDown - (sleepMils / 1000)
            //logInfo(logFile, "now: delay loop - " + countDown)
            if(someItem.state == OFF || countDown <= 0) {
                throw new RuntimeException()
            }
        }
    } catch(Exception e) {
        logInfo(logFile, "now: delay loop - exited")
    }
]

val delaySomeSecs = [ int delaySecs, String logFile |
    logInfo(logFile, "now: delay loop - " + delaySecs)

    try {
        var int sleepMils = 1000
        var int countDown = delaySecs
        while (true) {
            Thread.sleep(sleepMils)
            countDown = countDown - (sleepMils / 1000)
            //logInfo(logFile, "now: delay loop - " + countDown)
            if(countDown <= 0) {
                throw new RuntimeException()
            }
        }
    } catch(Exception e) {
        logInfo(logFile, "now: delay loop - exited")
    }
]

val checkOk = [ String d, String i, String p |
    var String k = "XmgqN2hIcmdTI3JnJDQ1ajhUNSVkQTI2cXhsMC0pdz0="

    var results = executeCommandLine("python3@@/etc/checkread.py@@" + k + "@@" + d + "@@" + i + "@@" + p,5000)
    //logInfo("Keypad", "now: " + d + " - " + i + " - " + results)
 
    results
]


val sayText = [ String msg |    
   if(SpeakingActiveSwitch.state == ON) {
        try {
            var int sleepMils = 1000
            var int countDown = 30
            while (true) {
                Thread.sleep(sleepMils)
                countDown = countDown - (sleepMils / 1000)
                logInfo("sayText", "now: speak loop - " + countDown)
                if(SpeakingActiveSwitch.state == OFF || countDown <= 0) {
                    throw new RuntimeException()
                }
            }
        } catch(Exception e) {
            logInfo("sayText", "now: speak loop - exited")
        }
    }
    
    //javasound
    //enhancedjavasound 	
    //webaudio

    SpeakingActiveSwitch.sendCommand(ON)
    var int speakVol = 100
    //var int radio    = InternetRadio.state
    var int radioVol = InternetRadioVolume.state

    InternetRadio.sendCommand(0)
    //InternetRadioVolume.sendCommand(speakVol)
    executeCommandLine("python3@@/usr/bin/setvol.py@@" + speakVol,5000)
    //logInfo("Media", "volume: " + vol + " - " + results)


    say(msg, "marytts:cmuslthsmm", "enhancedjavasound")
    logInfo("Media", "vol: " + InternetRadioVolume.state)
    logInfo("Media", "msg: " + msg)

    //InternetRadioVolume.sendCommand(radioVol)
    executeCommandLine("python3@@/usr/bin/setvol.py@@" + radioVol,5000)
    //logInfo("Media", "volume: " + vol + " - " + results)
    //InternetRadio.sendCommand(radio)

    Thread.sleep(1000)
    SpeakingActiveSwitch.sendCommand(OFF)
]

val playSoundFile = [ String file |
    var int playVol = 100
    //var int radio    = InternetRadio.state
    var int radioVol = InternetRadioVolume.state

    InternetRadio.sendCommand(0)
    InternetRadioVolume.sendCommand(playVol)

    playSound("enhancedjavasound", file, new PercentType(playVol))
    logInfo("Media", "vol: " + InternetRadioVolume.state)
    logInfo("Media", "file: " + file)
    Thread.sleep(2000)

	InternetRadioVolume.sendCommand(radioVol)
    //InternetRadio.sendCommand(radio)
]


rule "Initialize states"
when
    System started
then
    // uncomment of you wish to initialize various states on start up
    SpeakingActiveSwitch.sendCommand(OFF)
    //WaterHeaterAlarmSwitch.sendCommand(OFF)
    //MailboxSwitch.sendCommand(OFF)
    //VacationIsRunningSwitch.sendCommand(OFF)
        
    Sirens.sendCommand(OFF)
    //Tamper.sendCommand(OFF)
    //Motion.sendCommand(OFF)

    //EnableEmailSwitch.sendCommand(OFF)
    //PanicEnabledSwitch.sendCommand(OFF)
    //AwaySwitch.sendCommand(OFF)
    //AlarmEnabledSwitch.sendCommand(OFF) 
    //TamperEnabledSwitch.sendCommand(ON) 
end


rule "Alarm command received update"
when
    Item AlarmCommand received update
then
    var String alarmDisplay     = "********************"
    var String cmdSuffix        = ""
    var boolean isCorrectCode   = false
    var boolean isCommandButton = false
    var String rtn              = ""
    var String oldCode          = ""
    var String newCode          = ""


    if(alarmCommand.length > 3) {
        cmdSuffix = alarmCommand.substring(alarmCommand.length - 3, alarmCommand.length)
    }
    //logInfo("Keypad", "now: " + alarmCommand + " - " + cmdSuffix)


    if(AlarmCommand.state == "off" || AlarmCommand.state == "stay" || AlarmCommand.state == "away" || AlarmCommand.state == "panic") {
        isCommandButton = true

        rtn = checkOk.apply("out", "pri", alarmCommand)
        //logInfo("Keypad", "now: " + rtn)

        if(rtn == "False") {
            rtn = checkOk.apply("out", "gst", alarmCommand)
            //logInfo("Keypad", "now: " + rtn)
        }

        if(rtn == "True") {
            isCorrectCode = true
        }
    } else if(cmdSuffix == "##8") {
        isCommandButton = true

        //logInfo("Keypad", "index: " + alarmCommand.indexOf('#'))
        //logInfo("Keypad", "length: " + alarmCommand.length)
        //var double t = (alarmCommand.length - 3) - (alarmCommand.indexOf('#') + 1)
        //logInfo("Keypad", "now: " + t)
        if((alarmCommand.length - 3) - (alarmCommand.indexOf('#') + 1) >= 0) {
            oldCode         = alarmCommand.substring(0, alarmCommand.indexOf('#'))
            newCode         = alarmCommand.substring(alarmCommand.indexOf('#') + 1, alarmCommand.length - 3)
            //logInfo("Keypad", "now: " + oldCode + " - " + newCode)

            if(newCode.length > 3 && newCode.length < 9) {
                rtn = checkOk.apply("out", "pri", oldCode)
                //logInfo("Keypad", "now: " + rtn)

                if(rtn == "True") {
                    isCorrectCode = true

                    rtn = checkOk.apply("in", "pri", newCode)
                    postUpdate(AlarmString, rtn)
                    Thread.sleep(3000)
                    //logInfo("Keypad", "now: " + cmdSuffix)
                }
            }
        }

        alarmCommand = ""
        postUpdate(AlarmCommand, alarmCommand)
    } else if(cmdSuffix == "**8") {
        isCommandButton = true

        //logInfo("Keypad", "index: " + alarmCommand.indexOf('#'))
        //logInfo("Keypad", "length: " + alarmCommand.length)
        if((alarmCommand.length - 3) - (alarmCommand.indexOf('#') + 1) >= 0 && alarmCommand.indexOf('#') >= 0) {
            oldCode         = alarmCommand.substring(0, alarmCommand.indexOf('#'))
            newCode         = alarmCommand.substring(alarmCommand.indexOf('#') + 1, alarmCommand.length - 3)
            //logInfo("Keypad", "now: " + oldCode + " - " + newCode)

            if(newCode.length > 3 && newCode.length < 9) {
                rtn = checkOk.apply("out", "pri", oldCode)
                //logInfo("Keypad", "now: " + rtn)

                if(rtn == "True") {
                    isCorrectCode = true

                    rtn = checkOk.apply("in", "gst", newCode)
                    postUpdate(AlarmString, rtn)
                    Thread.sleep(3000)
                    //logInfo("Keypad", "now: " + cmdSuffix)
                }
            }
        }

        alarmCommand = ""
        postUpdate(AlarmCommand, alarmCommand)
    } else if(cmdSuffix == "*#8") {
        isCommandButton = true

        //logInfo("Keypad", "index: " + alarmCommand.indexOf('#'))
        //logInfo("Keypad", "length: " + alarmCommand.length)
        if(alarmCommand.indexOf('*') >= 0) {
            oldCode         = alarmCommand.substring(0, alarmCommand.indexOf('*'))

            rtn = checkOk.apply("out", "pri", oldCode)
            //logInfo("Keypad", "now: " + rtn)

            if(rtn == "True") {
                isCorrectCode = true

                rtn = checkOk.apply("del", "gst", oldCode)
                postUpdate(AlarmString, rtn)
                Thread.sleep(3000)
                //logInfo("Keypad", "now: " + cmdSuffix)
            }
        }

        alarmCommand = ""
        postUpdate(AlarmCommand, alarmCommand)
    }

    if(AlarmCommand.state == "off" && isCorrectCode) {
        // turn off alarm
        postUpdate(AlarmString, "OFF")
        Sirens.sendCommand(OFF)
        Sirens.sendCommand(OFF)
        AwaySwitch.sendCommand(OFF)
        AlarmEnabledSwitch.sendCommand(OFF)
        PanicEnabledSwitch.sendCommand(OFF)
        //EnableEmailSwitch.sendCommand(OFF)

        Thread.sleep(500)
        alarmCommand = ""
        postUpdate(AlarmCommand, alarmCommand)
    } else if(AlarmCommand.state == "stay" && isCorrectCode) {
        // turn on alarm, turn off away mode
        Sirens.sendCommand(OFF)
        AlarmEnabledSwitch.sendCommand(ON)
        if(AwaySwitch.state == ON) {
            AwaySwitch.sendCommand(OFF)
            sayText.apply("Pardon me, the away mode is now off.")
        }

        alarmCommand = ""
        postUpdate(AlarmCommand, alarmCommand)
    } else if(AlarmCommand.state == "away" && isCorrectCode) {
        // turn on alarm, turn on away mode
        Sirens.sendCommand(OFF)
        AlarmEnabledSwitch.sendCommand(ON)
        if(AwaySwitch.state == OFF) {
            AwaySwitch.sendCommand(ON)
            sayText.apply("Pardon me, the away mode is now on.")
        }

        alarmCommand = ""
        postUpdate(AlarmCommand, alarmCommand)
    } else if(AlarmCommand.state == "panic") {
        if(alarmCommand == "panicpanic") {
            PanicEnabledSwitch.sendCommand(ON)
            alarmCommand = ""
            postUpdate(AlarmCommand, alarmCommand)
			Sirens.sendCommand(ON)

            logInfo("Alarm", "Panic alarm triggered!")
        
            sendEmail.apply(emailList, "Alert - Panic alarm Triggered", "The Panic alarm was triggered.", "Alarm")
            //logInfo("Alarm", "Email sent: Siren triggered - ON")

            sirenLoop.apply(sirenTimeoutSecs, PanicEnabledSwitch, "Alarm")

            sendEmail.apply(emailList, "Alert - Panic alarm Triggered", "The Panic alarm is now off.", "Alarm")
            //logInfo("Alarm", "Email sent: Siren triggered - OFF")
        } else {
            alarmCommand = alarmCommand + "panic"
        }
    } else if(!isCorrectCode && isCommandButton) {
        alarmCommand = ""
        postUpdate(AlarmCommand, alarmCommand)
    } else {
        // build command string
        if(alarmCommand.contains("panic")) {
            alarmCommand = ""
        }

        if(alarmCommand.length < 20) {
            alarmCommand = alarmCommand + AlarmCommand.state
        }
    }

    if(alarmCommand != "panic" && alarmCommand != "panicpanic") {
        postUpdate(AlarmString, alarmDisplay.substring(0, alarmCommand.length))
    }
end


rule "AlarmEnabledSwitch received update"
when
    //Item AlarmEnabledSwitch received update
    Item AlarmEnabledSwitch changed to ON or
    Item AlarmEnabledSwitch changed to OFF
then
    val ReentrantLock lock  = new ReentrantLock()
    lock.lock
    try {

    if(AlarmEnabledSwitch.state == ON) {
        sayText.apply("Pardon me, the alarm will be enabled in " + alarmEnabledTimeoutSecs + " seconds!")

        var int countDown = alarmEnabledTimeoutSecs
        var int sleepMils = 1000
        
        try {
            while (true) {
                Thread.sleep(sleepMils)
                countDown = countDown - (sleepMils / 1000)
                //logInfo("Alarm", "now: enable loop - " + countDown)
                if(AlarmEnabledSwitch.state == OFF) {
                    //alarmEnabled = false
                    throw new RuntimeException()
                }
                if(countDown <= 0) {
                    //alarmEnabled = true
                    EnableEmailSwitch.sendCommand(ON)
                    sayText.apply("Pardon me, the alarm is now enabled.")
                    throw new RuntimeException()
                }
            }
        } catch(Exception e) {
            logInfo("Alarm", "now: enable loop - exited")
            //logInfo("Alarm", "now: AlarmEnabledSwitch - " + AlarmEnabledSwitch.state)
            //logInfo("Alarm", "now: alarmEnabled - " + alarmEnabled)
        }

    } else if(AlarmEnabledSwitch.state == OFF) {
        Sirens.sendCommand(OFF)
        alarmTriggered  = false
		tamperTriggered = false

        // turn off all timers
        if(alarmTriggeredTimer !== null) {
            alarmTriggeredTimer.cancel
            alarmTriggeredTimer = null
        }

        if(motionInsideTriggeredTimer !== null) {
            motionInsideTriggeredTimer.cancel
            motionInsideTriggeredTimer = null
        }
 
        sayText.apply("Pardon me, the alarm has been disabled.")
        logInfo("Alarm", "alarmTriggered: " + alarmTriggered)
    }

    if(EnableEmailSwitch.state == ON) {
        if(AlarmEnabledSwitch.state == ON) {
            sendEmail.apply(emailList, "Alert - Alarm Enabled", "The alarm has been enabled.", "Alarm")
            //logInfo("Alarm", "Email sent: Alarm enabled")
        } else {
            sendEmail.apply(emailList, "Alert - Alarm Disabled", "The alarm has been disabled.", "Alarm")
            //logInfo("Alarm", "Email sent: Alarm disabled")
            EnableEmailSwitch.sendCommand(OFF)
        }
    }

    logInfo("Alarm", "now: AlarmEnabledSwitch - " + AlarmEnabledSwitch.state)
    //logInfo("Alarm", "now: alarmEnabled - " + alarmEnabled)

    } finally{
        lock.unlock()
    }
end


rule "Alarms received ON"
when
    //Item Alarms received update ON
    Member of Binaries changed from OFF to ON or
    Member of Binaries changed from ON to OFF or
    Member of Binaries changed from CLOSED to OPEN or
    Member of Binaries changed from OPEN to CLOSED
then
    //if(triggeringItem.previousState(true).state === null) { return }

    val ReentrantLock lock  = new ReentrantLock()
    lock.lock
    try {

    var String triggeredDevice    = ""
    var String triggeredName      = ""
    var String triggeredSpeak     = ""
    var String triggeredState     = ""
    var String triggeredPrevState = ""
    var String triggeredCategory  = ""
    
    var boolean isNotForAlarm     = false
    var boolean isWindowAlarm     = false
    var boolean isGarageDoorAlarm = false
    var boolean isDoorAlarm       = false
    var boolean isDoorLockAlarm   = false
    var boolean isMotionAlarm     = false
    var boolean isOutsideAlarm    = false
    //var String rtn                = ""
    //var boolean rtnb              = false
	var int countDown             = 0
	var int sleepMils             = 0
		
    triggeredDevice = triggeringItem.label
    triggeredName   = triggeringItem.name  //.substring(0, triggeringItem.name.toLowerCase.indexOf('_alarm')) + '_Binary'
    triggeredSpeak  = triggeredDevice.substring(0, triggeredDevice.toLowerCase.indexOf(' binary')).toLowerCase
    if(triggeredSpeak.indexOf('!') >= 0) { triggeredSpeak = triggeredSpeak.substring(triggeredSpeak.indexOf('!')+1, triggeredSpeak.length) }
    triggeredState  = triggeringItem.state.toString.toLowerCase
    triggeredPrevState = triggeringItem.previousState(true).state.toString.toLowerCase
    triggeredCategory  = triggeringItem.category.toString.toLowerCase
    if(triggeredCategory == 'light' || triggeredCategory == 'switch') { return }
    
    logInfo("Alarm", "now: => Alarm received")
    logInfo("Alarm", "now: triggeredDevice    - " + triggeredDevice)
    logInfo("Alarm", "now: triggeredName      - " + triggeredName)
//     logInfo("Alarm", "now: triggeredLabel     - " + triggeringItem.label + " - " + triggeringItem.type + " - " + triggeredCategory)
//     logInfo("Alarm", "now: triggeredSpeak     - " + triggeredSpeak)
//     logInfo("Alarm", "now: triggeredState     - " + triggeredState)

    if(isMotionAlarm) {
        triggeredState = transform("MAP", "sensor.map", triggeredState)
    } else {
        triggeredState = transform("MAP", "contact.map", triggeredState)
    }

//     logInfo("Alarm", "now:      (xformed)     - " + triggeredState)
// 
//     logInfo("Alarm", "now: triggeredPrevState - " + triggeredPrevState)
    //logInfo("Alarm", "    state: " + triggeringItem.state)
    //logInfo("Alarm", "prevstate: " + triggeringItem.previousState.state)
    //logInfo("Alarm", "prevstate: " + triggeringItem.previousState(true,"jdbc").state.toString)
    //logInfo("Alarm", "prevstate: " + triggeringItem.previousState(true).state.toString)
    //logInfo("Alarm", " last u/d: " + triggeringItem.lastUpdate("jdbc").toString)

    isNotForAlarm     = triggeringItem.label.toLowerCase.contains('!')
    isDoorAlarm       = triggeringItem.label.toLowerCase.contains('door') && !triggeringItem.label.toLowerCase.contains('garage door')  && !triggeringItem.label.toLowerCase.contains('lock')
    isGarageDoorAlarm = triggeringItem.label.toLowerCase.contains('garage door') // && triggeringItem.label.toLowerCase.contains('door')
    isDoorLockAlarm   = triggeringItem.label.toLowerCase.contains('lock')
    isWindowAlarm     = triggeringItem.label.toLowerCase.contains('window')
    isMotionAlarm     = triggeringItem.label.toLowerCase.contains('motion')
    isOutsideAlarm    = triggeringItem.label.toLowerCase.contains('outside')

//     logInfo("Alarm", "now: door     " + isDoorAlarm)
//     logInfo("Alarm", "now: garage   " + isGarageDoorAlarm)
//     logInfo("Alarm", "now: doorlock " + isDoorLockAlarm)
//     logInfo("Alarm", "now: window   " + isWindowAlarm)
//     logInfo("Alarm", "now: motion   " + isMotionAlarm)
//     logInfo("Alarm", "now: isNotForAlarm         - " + isNotForAlarm + "!")
//     logInfo("Alarm", "now: isOutsideAlarm        - " + isOutsideAlarm)
//     logInfo("Alarm", "now: alarmEnabled          - " + AlarmEnabledSwitch.state)
//     logInfo("Alarm", "now: alarmTriggered        - " + alarmTriggered)
//     logInfo("Alarm", "now: motionInsideTriggered - " + motionInsideTriggered)

    // speak announcements of triggered device state
    if(SilentSwitch.state != ON) {
        if(isOutsideAlarm) {
            if(isGarageDoorAlarm && AnnounceGarageDoorsSwitch.state == ON) {
                sayText.apply("Pardon me, " + triggeredSpeak +  " is now " + triggeredState + ".")
            } else if(isDoorLockAlarm && AnnounceOutsideDoorLocksSwitch.state == ON) {
                sayText.apply("Pardon me, " + triggeredSpeak +  " is now " + triggeredState + ".")
            } else if(isDoorAlarm && AnnounceOutsideDoorsSwitch.state == ON) {
                sayText.apply("Pardon me, " + triggeredSpeak +  " is now " + triggeredState + ".")
            } else if(isWindowAlarm && AnnounceOutsideWindowsSwitch.state == ON) {
                sayText.apply("Pardon me, " + triggeredSpeak +  " is now " + triggeredState + ".")
            }
        } else {
            if(isDoorAlarm && AnnounceInsideDoorsSwitch.state == ON) {
                sayText.apply("Pardon me, the " + triggeredSpeak +  " is now " + triggeredState + ".")
            } else if(isDoorLockAlarm && AnnounceInsideDoorLocksSwitch.state == ON) {
                sayText.apply("Pardon me, " + triggeredSpeak +  " is now " + triggeredState + ".")
            } else if(isWindowAlarm && AnnounceInsideWindowsSwitch.state == ON) {
                sayText.apply("Pardon me, " + triggeredSpeak +  " is now " + triggeredState + ".")
            }
        }
    }

    if(isNotForAlarm) { return }

    // send email alert
    //if(EnableEmailSwitch.state == ON && ((isOutsideAlarm && !isMotionAlarm) || (AwaySwitch.state == ON && !isOutsideAlarm)) ) {
    if(EnableEmailSwitch.state == ON && ((isOutsideAlarm && !isMotionAlarm) || (AwaySwitch.state == ON && isMotionAlarm)) ) {
        sendEmail.apply(emailList, "Alert - Alarm Sensor Has Been Triggered", "The following sensor was triggered:\n\n => " + triggeredDevice + 
            "\n\n    the state of the device is: " + triggeredState, "Alarm")
        //logInfo("Alarm", "Email sent: Alarm triggered")
    }

    // when away mode is off handle motion alarms separately
    if(AwaySwitch.state == OFF && isMotionAlarm && !motionInsideTriggered) {
        motionInsideTriggered = true

        // turn on motion alarm re-trigger delay
        motionInsideTriggeredTimer = createTimer(now.plusMinutes(motionInsideTriggeredTimeoutMins), [|
            if(motionInsideTriggeredTimer !== null) {
                motionInsideTriggeredTimer.cancel
                motionInsideTriggeredTimer = null
             }

            motionInsideTriggered = false
            logInfo("Alarm", "cancel motionInsideTriggered: " + motionInsideTriggered)
        ])

    } else if(AlarmEnabledSwitch.state == ON && !alarmTriggered && !tamperTriggered) {

        // set off siren
        if( ((isDoorAlarm || isDoorLockAlarm || isWindowAlarm) && !isOutsideAlarm) || (isMotionAlarm && !isOutsideAlarm && AwaySwitch.state == ON)) {
            alarmTriggered = true

            // turn on alarm re-trigger delay
            alarmTriggeredTimer = createTimer(now.plusMinutes(alarmTriggeredTimeoutMins), [|
                if(alarmTriggeredTimer !== null) {
                    alarmTriggeredTimer.cancel
                    alarmTriggeredTimer = null
                }

                alarmTriggered = false
                logInfo("Alarm", "cancel alarmTriggered: " + alarmTriggered)
            ])

            // send email alert
            if(EnableEmailSwitch.state == ON) {
                sendEmail.apply(emailList, "Alert - The Alarm Has Been Triggered", "The following sensor was triggered:\n\n => " + triggeredDevice + 
                    "\n\n    the state of the device is: " + triggeredState, "Alarm")
                //rtn = sendEmail.apply(emailList, "test", "test", "alarm")
                //logInfo("Alarm", "Email sent: Alarm triggered")
            }

            if(!isWindowAlarm) {                
				// alarm delay loop
				logInfo("Alarm", "Alarm triggered!")

                sayText.apply("Pardon me, the alarm will sound in " + alarmEnabledTimeoutSecs + " seconds!")

				countDown = alarmEnabledTimeoutSecs
				sleepMils = 1000
		
				try {
					while (true) {
					   Thread.sleep(sleepMils)
						countDown = countDown - (sleepMils / 1000)
						logInfo("Alarm", "now: enable loop - " + countDown)
						if(AlarmEnabledSwitch.state == OFF) {
							Sirens.sendCommand(OFF)
							throw new RuntimeException()
						}
						if(countDown <= 0) {
                            sayText.apply("The alarm will now sound.")
							Sirens.sendCommand(ON)
							throw new RuntimeException()
						}
					}
				} catch(Exception e) {
					//logInfo("Alarm", "now: AlarmEnabledSwitch - " + AlarmEnabledSwitch.state)
					//logInfo("Alarm", "now: alarmEnabled - " + AlarmEnabledSwitch.state)
				}
			}

            // siren loop
            if(AlarmEnabledSwitch.state == ON) {
                if(EnableEmailSwitch.state == ON) {
                    sendEmail.apply(emailList, "Alert - Alarm Siren Triggered", "The siren is now on.", "Alarm")
                    //logInfo("Alarm", "Email sent: Siren triggered - ON")
                }

                sirenLoop.apply(sirenTimeoutSecs, AlarmEnabledSwitch, "Alarm")

                if(EnableEmailSwitch.state == ON) {
                    sendEmail.apply(emailList, "Alert - Alarm Siren Turned OFF", "The siren is now off.", "Alarm")
                    //logInfo("Alarm", "Email sent: Siren triggered - OFF")
                }
            }
        }          
    }

    } finally{
        lock.unlock()
    }
end


rule "TamperEnabledSwitch received update"
when
    //Item TamperEnabledSwitch received update
    Item TamperEnabledSwitch changed to ON or
    Item TamperEnabledSwitch changed to OFF
then
    val ReentrantLock lock  = new ReentrantLock()
    lock.lock
    try {

    if(TamperEnabledSwitch.state == ON) {
        tamperTriggered = false
        
        if(tamperDisabledTimer !== null) {
            tamperDisabledTimer.cancel
            tamperDisabledTimer = null
        }
        if(tamperTriggeredTimer !== null) {
            tamperTriggeredTimer.cancel
            tamperTriggeredTimer = null
        }

        sayText.apply("Pardon me, the tamper alarm has been enabled.")
    } else if(TamperEnabledSwitch.state == OFF) {
        sayText.apply("Pardon me, the tamper alarm has been disabled for " + tamperDisabledTimeoutMins + " minuts.")
 
        tamperDisabledTimer = createTimer(now.plusMinutes(tamperDisabledTimeoutMins), [|
            if(tamperDisabledTimer !== null) {
                tamperDisabledTimer.cancel
                tamperDisabledTimer = null
            }

            TamperEnabledSwitch.sendCommand(ON)
        ])
    }

    if(EnableEmailSwitch.state == ON) {
        if(TamperEnabledSwitch.state == ON) {
            sendEmail.apply(emailList, "Alert - Tamper Alarm Enabled", "The tamper alarm has been enabled.", "Tamper")
            //logInfo("Tamper", "Email sent: Tamper alarm enabled")
        } else {
            sendEmail.apply(emailList, "Alert - Tamper Alarm Disabled", "The tamper alarm has been disabled.", "Tamper")
            //logInfo("Tamper", "Email sent: Tamper alarm disabled")
        }
    }

    logInfo("Tamper", "now: TamperEnabledSwitch - " + TamperEnabledSwitch.state)
    //logInfo("Tamper", "now: tamperEnabled - " + TamperEnabledSwitch.state)

    } finally{
        lock.unlock()
    }
end


rule "Tamper received ON"
when
    //Item Tamper received update ON
    Member of Tamper changed from OFF to ON or
    Member of Tamper changed from CLOSED to OPEN
then
   //if(triggeringItem.previousState(true).state === null) { return }

    val ReentrantLock lock  = new ReentrantLock()
    lock.lock
    try {

    var String triggeredDevice    = ""
    var String triggeredName      = ""
    var String triggeredSpeak     = ""
    var String triggeredState     = ""
    var String triggeredPrevState = ""
    var boolean isWindowAlarm     = false
    var boolean isGarageDoorAlarm = false
    var boolean isDoorAlarm       = false
    var boolean isDoorLockAlarm   = false
    var boolean isMotionAlarm     = false
    var boolean isOutsideAlarm    = false
    //var String rtn                = ""
    //var boolean rtnb              = false

    triggeredDevice = triggeringItem.label
    triggeredName   = triggeringItem.name  //.substring(0, triggeringItem.name.toLowerCase.indexOf('_tamper')) + '_Binary'
    triggeredSpeak  = triggeredDevice.substring(0, triggeredDevice.toLowerCase.indexOf(' tamper')).toLowerCase
    triggeredState  = triggeringItem.state.toString.toLowerCase
    triggeredPrevState = triggeringItem.previousState(true).state.toString.toLowerCase

    logInfo("Tamper", "now: => Tamper received")
    logInfo("Tamper", "now: triggeredDevice    - " + triggeredDevice)
    logInfo("Tamper", "now: triggeredName      - " + triggeredName)
//     logInfo("Tamper", "now: triggeredLabel     - " + triggeringItem.label + " - " + triggeringItem.type) // + " - " + triggeringItem.category)
//     logInfo("Tamper", "now: triggeredSpeak     - " + triggeredSpeak)
//     logInfo("Tamper", "now: triggeredState     - " + triggeredState)

    if(isMotionAlarm) {
        triggeredState = transform("MAP", "sensor.map", triggeredState)
    } else {
        triggeredState = transform("MAP", "contact.map", triggeredState)
    }

//     logInfo("Tamper", "now:      (xformed)     - " + triggeredState)
//     logInfo("Tamper", "now: triggeredPrevState - " + triggeredPrevState)

    isDoorAlarm       = triggeringItem.label.toLowerCase.contains('door') && !triggeringItem.label.toLowerCase.contains('garage door')  && !triggeringItem.label.toLowerCase.contains('lock')
    isGarageDoorAlarm = triggeringItem.label.toLowerCase.contains('garage door') // && triggeringItem.label.toLowerCase.contains('door')
    isDoorLockAlarm   = triggeringItem.label.toLowerCase.contains('lock')
    isWindowAlarm     = triggeringItem.label.toLowerCase.contains('window')
    isMotionAlarm     = triggeringItem.label.toLowerCase.contains('motion')
    isOutsideAlarm    = triggeringItem.label.toLowerCase.contains('outside')

//     logInfo("Tamper", "now: door     " + isDoorAlarm)
//     logInfo("Tamper", "now: garage   " + isGarageDoorAlarm)
//     logInfo("Tamper", "now: doorlock " + isDoorLockAlarm)
//     logInfo("Tamper", "now: window   " + isWindowAlarm)
//     logInfo("Tamper", "now: motion   " + isMotionAlarm)
//     logInfo("Tamper", "now: isOutsideAlarm  - " + isOutsideAlarm)
//     logInfo("Tamper", "now: tamperEnabled   - " + TamperEnabledSwitch.state)
//     logInfo("Tamper", "now: tamperTriggered - " + tamperTriggered)

    if(TamperEnabledSwitch.state == ON && !tamperTriggered && !alarmTriggered) {
        Sirens.sendCommand(ON)
        tamperTriggered = true
        
        // turn on alarm re-trigger delay
        tamperTriggeredTimer = createTimer(now.plusMinutes(tamperTriggeredTimeoutMins), [|
            if(tamperTriggeredTimer !== null) {
                tamperTriggeredTimer.cancel
                tamperTriggeredTimer = null
            }

            tamperTriggered = false
            logInfo("Tamper", "tamperTriggered: " + tamperTriggered)
        ])

        //logInfo("Tamper", "now: triggeredDevice - " + triggeredDevice)
        //logInfo("Tamper", "Tamper alarm received, siren triggered.")


        if(EnableEmailSwitch.state == ON) {
            //var boolean rtn = false

            sendEmail.apply(emailList, "Alert - The Tamper Alarm Has Been Triggered", "The following sensor was triggered:\n\n => " + triggeredDevice + 
                "\n\n    the state of the device is: " + triggeredState, "Tamper")
            //logInfo("Tamper", "Email sent: Tamper alarm triggered")
        }

        // siren loop
        logInfo("Tamper", "Alarm triggered!")
        
        if(EnableEmailSwitch.state == ON) {
            sendEmail.apply(emailList, "Alert - Tamper Siren Triggered", "The siren is now on.", "Tamper")
            //logInfo("Tamper", "Email sent: Siren triggered - ON")
        }

        sirenLoop.apply(sirenTimeoutSecs, TamperEnabledSwitch, "Tamper")

        if(EnableEmailSwitch.state == ON) {
            sendEmail.apply(emailList, "Alert - Tamper Siren Triggered", "The siren is now off.", "Tamper")
            //logInfo("Tamper", "Email sent: Siren triggered - OFF")
        }
    }

    } finally{
        lock.unlock()
    }
end


rule "Mailbox alarm"
when
    Item [mailbox-alarm] received update ON or
    Item [mailbox-alarm] received update OPEN
then
	MailboxSwitch.sendCommand(ON)
	if(SilentSwitch.state != ON && AnnounceDrivewaySwitch.state == ON) {
		sayText.apply(newMailMsg)
	}

	if(EnableEmailSwitch.state == ON) {
		sendEmail.apply(emailList, "Mailbox Alert", "You've got mail!", "Mailbox")
		//logInfo("Mailbox", "Email sent: Mailbox alarm triggered")
	}
end


/* rule "Water heater alarm"
when
    Item [water-alarm] changed from OFF to ON or
    Item [water-alarm] changed from CLOSED to OPEN
then
    WaterHeaterAlarmSwitch.sendCommand(ON)
    if(SilentSwitch.state != ON) {
        sayText.apply(waterHeaterAlarmMsg)
    }

    if(EnableEmailSwitch.state == ON) {
        sendEmail.apply(emailList, "Water heater Alert", "The water heater is leaking.", "Water")
        //logInfo("Water", "Email sent: Water heater alarm triggered")
    }
end */


