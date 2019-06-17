Group:Number:AVG                 Temperature   "Avg. Room Temperature [%.1f °F]"   <temperature>    
Group:Number:AVG                 Humidity      "Avg. Room Humidity [%.1f %%]"      <humidity>       
Group:Number:AVG                 Luminance     "Avg. Luminance level [(%d)]"       <sun>            
Group:Number:AVG                 Batteries     "Avg. Battery level [(%d)]"         <battery>        

Group gWthr         "Weather"                     <sun>                  
Group gStatus       "gStatus"                     <settings>

Group Dimmers
Group Status        "Status"                      <settings>    (gStatus)
Group Settings      "Settings"                    <settings>    (gStatus)
Group Binaries      "Binaries"                    <switch>
Group Alarms        "Alarm Triggered"             <siren>          
Group Tamper        "Tamper Alarm Triggered"      <siren>          
Group Switches      "Switches"                    <switch>
//Group PowerSwitches "Power Switches"              <switch>
//Group MotionSensors "Motion Sensors"              <motion>
Group Sirens        "Sirens"                      <siren>
Group Mailboxes     "Mailboxes"                   <switch>
Group GDSwitches


/* Weather */
Number   CurrVisibility       "Visibility [%.2f mi]"                               {weather="locationId=home, type=atmosphere, property=visibility, unit=mph"}
Number   CurrHumidity         "Humidity [%d %%]"                                   {weather="locationId=home, type=atmosphere, property=humidity"}
Number   CurrPressure         "Pressure [%.2f in]"                                 {weather="locationId=home, type=atmosphere, property=pressure, unit=inches"}
String   CurrPressure_Trend   "Pressure trend [%s]"                                {weather="locationId=home, type=atmosphere, property=pressureTrend"}
Number   CurrOzone            "Ozone [%d ppm]"    	                               {weather="locationId=home, type=atmosphere, property=ozone"}
Number   CurrUV_Index         "UV Index"                                           {weather="locationId=home, type=atmosphere, property=uvIndex, scale=0"}

Number   CurrClouds           "Clouds [%.0f %%]"                                   {weather="locationId=home, type=clouds, property=percent"}

String   CurrCondition        "Condition [%s]"                                     {weather="locationId=home, type=condition, property=text"}
String   CurrCondition_ID     "Condition id [%s]"                                  {weather="locationId=home, type=condition, property=id"}
DateTime CurrObservationTime  "Observation time [%1$tm.%1$td.%1$tY %1$tH:%1$tM]"   {weather="locationId=home, type=condition, property=observationTime"}
DateTime CurrLastUpdate       "Last update [%1$tm.%1$td.%1$tY %1$tH:%1$tM]"        {weather="locationId=home, type=condition, property=lastUpdate"}
String   CurrCommonId         "Common id [%s]"                                     {weather="locationId=home, type=condition, property=commonId"}

Number   CurrRain             "Rain [%.2f in/h]"                                   {weather="locationId=home, type=precipitation, property=rain, unit=inches"}
Number   CurrSnow             "Snow [%.2f in/h]"                                   {weather="locationId=home, type=precipitation, property=snow, unit=inches"}
Number   CurrPrecip_Probability  "Precip probability [%d %%]"                      {weather="locationId=home, type=precipitation, property=probability"}
// new total property in 1.8, only Wunderground
Number   CurrPrecip_Total     "Precip total [%d in]"                               {weather="locationId=home, type=precipitation, property=total, unit=inches"}

Number   CurrTemperature      "Temperature [%.2f °F]"                              {weather="locationId=home, type=temperature, property=current"}
Number   CurrTemp_Feel        "Temperature feel [%.2f °F]"                         {weather="locationId=home, type=temperature, property=feel"}
Number   CurrTemp_Dewpoint    "Dewpoint [%.2f °F]"                                 {weather="locationId=home, type=temperature, property=dewpoint"}

// min and max values only available in forecasts
Number   CurrTemp_Min         "Temperature min [%.2f °F]"                          {weather="locationId=home, type=temperature, property=min"}
Number   CurrTemp_Max         "Temperature max [%.2f °F]"                          {weather="locationId=home, type=temperature, property=max"}
String   CurrTemp_MinMax      "Min/Max [%s °F]"                                    {weather="locationId=home, type=temperature, property=minMax"}

Number   CurrWind_Speed       "Windspeed [%.2f mph]"                               {weather="locationId=home, type=wind, property=speed, unit=mph"}
String   CurrWind_Direction   "Wind direction [%s]"                                {weather="locationId=home, type=wind, property=direction"}
Number   CurrWind_Degree      "Wind degree [%.0f °]"                               {weather="locationId=home, type=wind, property=degree"}
Number   CurrWind_Gust        "Wind gust [%.2f mph]"                               {weather="locationId=home, type=wind, property=gust, unit=mph"}
Number   CurrWind_Chill       "Wind chill [%.2f °F]"                               {weather="locationId=home, type=wind, property=chill, unit=fahrenheit"}

//forecast
String   Day0Temp_MinMax      "Min/Max [%s °F]"                                    {weather="locationId=home, forecast=0, type=temperature, property=minMax"}
Number   Day0Temp_Min         "Temperature min [%.2f °F]"                          {weather="locationId=home, forecast=0, type=temperature, property=min"}
Number   Day0Temp_Max         "Temperature max [%.2f °F]"                          {weather="locationId=home, forecast=0, type=temperature, property=max"}
Number   Day0Humidity         "Humidity [%d %%]"                                   {weather="locationId=home, forecast=0, type=atmosphere, property=humidity"}
Number   Day0Temp_Dewpoint    "Dewpoint [%.2f °F]"                                 {weather="locationId=home, forecast=0, type=temperature, property=dewpoint"}
Number   Day0Pressure         "Pressure [%.2f in]"                                 {weather="locationId=home, forecast=0, type=atmosphere, property=pressure, unit=inches"}
Number   Day0Clouds           "Clouds [%.0f %%]"                                   {weather="locationId=home, forecast=0, type=clouds, property=percent"}
String   Day0Condition        "Condition [%s]"                                     {weather="locationId=home, forecast=0, type=condition, property=text"}
String   Day0CommonId         "Common id [%s]"                                     {weather="locationId=home, forecast=0, type=condition, property=commonId"}
DateTime Day0ObservationTime  "Observation time [%1$ta, %1$tm.%1$td.%1$tY %1$tH:%1$tM]"   {weather="locationId=home, forecast=0, type=condition, property=observationTime"}
Number   Day0Rain             "Rain [%.2f in/h]"                                   {weather="locationId=home, forecast=0, type=precipitation, property=rain, unit=inches"}
Number   Day0Snow             "Snow [%.2f in/h]"                                   {weather="locationId=home, forecast=0, type=precipitation, property=snow, unit=inches"}
Number   Day0Precip_Probability  "Precip probability [%d %%]"                      {weather="locationId=home, forecast=0, type=precipitation, property=probability"}
Number   Day0Wind_Speed       "Windspeed [%.2f mph]"                               {weather="locationId=home, forecast=0, type=wind, property=speed, unit=mph"}
String   Day0Wind_Direction   "Wind direction [%s]"                                {weather="locationId=home, forecast=0, type=wind, property=direction"}
Number   Day0Wind_Chill       "Wind chill [%.2f °F]"                               {weather="locationId=home, forecast=0, type=wind, property=chill"}

String   Day1Temp_MinMax      "Min/Max [%s °F]"                                    {weather="locationId=home, forecast=1, type=temperature, property=minMax"}
Number   Day1Temp_Min         "Temperature min [%.2f °F]"                          {weather="locationId=home, forecast=1, type=temperature, property=min"}
Number   Day1Temp_Max         "Temperature max [%.2f °F]"                          {weather="locationId=home, forecast=1, type=temperature, property=max"}
Number   Day1Humidity         "Humidity [%d %%]"                                   {weather="locationId=home, forecast=1, type=atmosphere, property=humidity"}
Number   Day1Temp_Dewpoint    "Dewpoint [%.2f °F]"                                 {weather="locationId=home, forecast=1, type=temperature, property=dewpoint"}
Number   Day1Pressure         "Pressure [%.2f in]"                                 {weather="locationId=home, forecast=1, type=atmosphere, property=pressure, unit=inches"}
Number   Day1Clouds           "Clouds [%.0f %%]"                                   {weather="locationId=home, forecast=1, type=clouds, property=percent"}
String   Day1Condition        "Condition [%s]"                                     {weather="locationId=home, forecast=1, type=condition, property=text"}
String   Day1CommonId         "Common id [%s]"                                     {weather="locationId=home, forecast=1, type=condition, property=commonId"}
DateTime Day1ObservationTime  "Observation time [%1$ta, %1$tm.%1$td.%1$tY %1$tH:%1$tM]"   {weather="locationId=home, forecast=1, type=condition, property=observationTime"}
Number   Day1Rain             "Rain [%.2f in/h]"                                   {weather="locationId=home, forecast=1, type=precipitation, property=rain, unit=inches"}
Number   Day1Snow             "Snow [%.2f in/h]"                                   {weather="locationId=home, forecast=1, type=precipitation, property=snow, unit=inches"}
Number   Day1Precip_Probability  "Precip probability [%d %%]"                      {weather="locationId=home, forecast=1, type=precipitation, property=probability"}
Number   Day1Wind_Speed       "Windspeed [%.2f mph]"                               {weather="locationId=home, forecast=1, type=wind, property=speed, unit=mph"}
String   Day1Wind_Direction   "Wind direction [%s]"                                {weather="locationId=home, forecast=1, type=wind, property=direction"}
Number   Day1Wind_Chill       "Wind chill [%.2f °F]"                               {weather="locationId=home, forecast=1, type=wind, property=chill"}

String   Day2Temp_MinMax      "Min/Max [%s °F]"                                    {weather="locationId=home, forecast=2, type=temperature, property=minMax"}
Number   Day2Temp_Min         "Temperature min [%.2f °F]"                          {weather="locationId=home, forecast=2, type=temperature, property=min"}
Number   Day2Temp_Max         "Temperature max [%.2f °F]"                          {weather="locationId=home, forecast=2, type=temperature, property=max"}
Number   Day2Humidity         "Humidity [%d %%]"                                   {weather="locationId=home, forecast=2, type=atmosphere, property=humidity"}
Number   Day2Temp_Dewpoint    "Dewpoint [%.2f °F]"                                 {weather="locationId=home, forecast=2, type=temperature, property=dewpoint"}
Number   Day2Pressure         "Pressure [%.2f in]"                                 {weather="locationId=home, forecast=2, type=atmosphere, property=pressure, unit=inches"}
Number   Day2Clouds           "Clouds [%.0f %%]"                                   {weather="locationId=home, forecast=2, type=clouds, property=percent"}
String   Day2Condition        "Condition [%s]"                                     {weather="locationId=home, forecast=2, type=condition, property=text"}
String   Day2CommonId         "Common id [%s]"                                     {weather="locationId=home, forecast=2, type=condition, property=commonId"}
DateTime Day2ObservationTime  "Observation time [%1$ta, %1$tm.%1$td.%1$tY %1$tH:%1$tM]"   {weather="locationId=home, forecast=2, type=condition, property=observationTime"}
Number   Day2Rain             "Rain [%.2f in/h]"                                   {weather="locationId=home, forecast=2, type=precipitation, property=rain, unit=inches"}
Number   Day2Snow             "Snow [%.2f in/h]"                                   {weather="locationId=home, forecast=2, type=precipitation, property=snow, unit=inches"}
Number   Day2Precip_Probability  "Precip probability [%d %%]"                      {weather="locationId=home, forecast=2, type=precipitation, property=probability"}
Number   Day2Wind_Speed       "Windspeed [%.2f mph]"                               {weather="locationId=home, forecast=2, type=wind, property=speed, unit=mph"}
String   Day2Wind_Direction   "Wind direction [%s]"                                {weather="locationId=home, forecast=2, type=wind, property=direction"}
Number   Day2Wind_Chill       "Wind chill [%.2f °F]"                               {weather="locationId=home, forecast=2, type=wind, property=chill"}

String   Day3Temp_MinMax      "Min/Max [%s °F]"                                    {weather="locationId=home, forecast=3, type=temperature, property=minMax"}
Number   Day3Temp_Min         "Temperature min [%.2f °F]"                          {weather="locationId=home, forecast=3, type=temperature, property=min"}
Number   Day3Temp_Max         "Temperature max [%.2f °F]"                          {weather="locationId=home, forecast=3, type=temperature, property=max"}
Number   Day3Humidity         "Humidity [%d %%]"                                   {weather="locationId=home, forecast=3, type=atmosphere, property=humidity"}
Number   Day3Temp_Dewpoint    "Dewpoint [%.2f °F]"                                 {weather="locationId=home, forecast=3, type=temperature, property=dewpoint"}
Number   Day3Pressure         "Pressure [%.2f in]"                                 {weather="locationId=home, forecast=3, type=atmosphere, property=pressure, unit=inches"}
Number   Day3Clouds           "Clouds [%.0f %%]"                                   {weather="locationId=home, forecast=3, type=clouds, property=percent"}
String   Day3Condition        "Condition [%s]"                                     {weather="locationId=home, forecast=3, type=condition, property=text"}
String   Day3CommonId         "Common id [%s]"                                     {weather="locationId=home, forecast=3, type=condition, property=commonId"}
DateTime Day3ObservationTime  "Observation time [%1$ta, %1$tm.%1$td.%1$tY %1$tH:%1$tM]"   {weather="locationId=home, forecast=3, type=condition, property=observationTime"}
Number   Day3Rain             "Rain [%.2f in/h]"                                   {weather="locationId=home, forecast=3, type=precipitation, property=rain, unit=inches"}
Number   Day3Snow             "Snow [%.2f in/h]"                                   {weather="locationId=home, forecast=3, type=precipitation, property=snow, unit=inches"}
Number   Day3Precip_Probability  "Precip probability [%d %%]"                      {weather="locationId=home, forecast=3, type=precipitation, property=probability"}
Number   Day3Wind_Speed       "Windspeed [%.2f mph]"                               {weather="locationId=home, forecast=3, type=wind, property=speed, unit=mph"}
String   Day3Wind_Direction   "Wind direction [%s]"                                {weather="locationId=home, forecast=3, type=wind, property=direction"}
Number   Day3Wind_Chill       "Wind chill [%.2f °F]"                               {weather="locationId=home, forecast=3, type=wind, property=chill"}

String   Day4Temp_MinMax      "Min/Max [%s °F]"                                    {weather="locationId=home, forecast=4, type=temperature, property=minMax"}
Number   Day4Temp_Min         "Temperature min [%.2f °F]"                          {weather="locationId=home, forecast=4, type=temperature, property=min"}
Number   Day4Temp_Max         "Temperature max [%.2f °F]"                          {weather="locationId=home, forecast=4, type=temperature, property=max"}
Number   Day4Humidity         "Humidity [%d %%]"                                   {weather="locationId=home, forecast=4, type=atmosphere, property=humidity"}
Number   Day4Temp_Dewpoint    "Dewpoint [%.2f °F]"                                 {weather="locationId=home, forecast=4, type=temperature, property=dewpoint"}
Number   Day4Pressure         "Pressure [%.2f in]"                                 {weather="locationId=home, forecast=4, type=atmosphere, property=pressure, unit=inches"}
Number   Day4Clouds           "Clouds [%.0f %%]"                                   {weather="locationId=home, forecast=4, type=clouds, property=percent"}
String   Day4Condition        "Condition [%s]"                                     {weather="locationId=home, forecast=4, type=condition, property=text"}
String   Day4CommonId         "Common id [%s]"                                     {weather="locationId=home, forecast=4, type=condition, property=commonId"}
DateTime Day4ObservationTime  "Observation time [%1$ta, %1$tm.%1$td.%1$tY %1$tH:%1$tM]"   {weather="locationId=home, forecast=4, type=condition, property=observationTime"}
Number   Day4Rain             "Rain [%.2f in/h]"                                   {weather="locationId=home, forecast=4, type=precipitation, property=rain, unit=inches"}
Number   Day4Snow             "Snow [%.2f in/h]"                                   {weather="locationId=home, forecast=4, type=precipitation, property=snow, unit=inches"}
Number   Day4Precip_Probability  "Precip probability [%d %%]"                      {weather="locationId=home, forecast=4, type=precipitation, property=probability"}
Number   Day4Wind_Speed       "Windspeed [%.2f mph]"                               {weather="locationId=home, forecast=4, type=wind, property=speed, unit=mph"}
String   Day4Wind_Direction   "Wind direction [%s]"                                {weather="locationId=home, forecast=4, type=wind, property=direction"}
Number   Day4Wind_Chill       "Wind chill [%.2f °F]"                               {weather="locationId=home, forecast=4, type=wind, property=chill"}

String   Day5Temp_MinMax      "Min/Max [%s °F]"                                    {weather="locationId=home, forecast=5, type=temperature, property=minMax"}
Number   Day5Temp_Min         "Temperature min [%.2f °F]"                          {weather="locationId=home, forecast=5, type=temperature, property=min"}
Number   Day5Temp_Max         "Temperature max [%.2f °F]"                          {weather="locationId=home, forecast=5, type=temperature, property=max"}
Number   Day5Humidity         "Humidity [%d %%]"                                   {weather="locationId=home, forecast=5, type=atmosphere, property=humidity"}
Number   Day5Temp_Dewpoint    "Dewpoint [%.2f °F]"                                 {weather="locationId=home, forecast=5, type=temperature, property=dewpoint"}
Number   Day5Pressure         "Pressure [%.2f in]"                                 {weather="locationId=home, forecast=5, type=atmosphere, property=pressure, unit=inches"}
Number   Day5Clouds           "Clouds [%.0f %%]"                                   {weather="locationId=home, forecast=5, type=clouds, property=percent"}
String   Day5Condition        "Condition [%s]"                                     {weather="locationId=home, forecast=5, type=condition, property=text"}
String   Day5CommonId         "Common id [%s]"                                     {weather="locationId=home, forecast=5, type=condition, property=commonId"}
DateTime Day5ObservationTime  "Observation time [%1$ta, %1$tm.%1$td.%1$tY %1$tH:%1$tM]"   {weather="locationId=home, forecast=5, type=condition, property=observationTime"}
Number   Day5Rain             "Rain [%.2f in/h]"                                   {weather="locationId=home, forecast=5, type=precipitation, property=rain, unit=inches"}
Number   Day5Snow             "Snow [%.2f in/h]"                                   {weather="locationId=home, forecast=5, type=precipitation, property=snow, unit=inches"}
Number   Day5Precip_Probability  "Precip probability [%d %%]"                      {weather="locationId=home, forecast=5, type=precipitation, property=probability"}
Number   Day5Wind_Speed       "Windspeed [%.2f mph]"                               {weather="locationId=home, forecast=5, type=wind, property=speed, unit=mph"}
String   Day5Wind_Direction   "Wind direction [%s]"                                {weather="locationId=home, forecast=5, type=wind, property=direction"}
Number   Day5Wind_Chill       "Wind chill [%.2f °F]"                               {weather="locationId=home, forecast=5, type=wind, property=chill"}

String   Day6Temp_MinMax      "Min/Max [%s °F]"                                    {weather="locationId=home, forecast=6, type=temperature, property=minMax"}
Number   Day6Temp_Min         "Temperature min [%.2f °F]"                          {weather="locationId=home, forecast=6, type=temperature, property=min"}
Number   Day6Temp_Max         "Temperature max [%.2f °F]"                          {weather="locationId=home, forecast=6, type=temperature, property=max"}
Number   Day6Humidity         "Humidity [%d %%]"                                   {weather="locationId=home, forecast=6, type=atmosphere, property=humidity"}
Number   Day6Temp_Dewpoint    "Dewpoint [%.2f °F]"                                 {weather="locationId=home, forecast=6, type=temperature, property=dewpoint"}
Number   Day6Pressure         "Pressure [%.2f in]"                                 {weather="locationId=home, forecast=6, type=atmosphere, property=pressure, unit=inches"}
Number   Day6Clouds           "Clouds [%.0f %%]"                                   {weather="locationId=home, forecast=6, type=clouds, property=percent"}
String   Day6Condition        "Condition [%s]"                                     {weather="locationId=home, forecast=6, type=condition, property=text"}
String   Day6CommonId         "Common id [%s]"                                     {weather="locationId=home, forecast=6, type=condition, property=commonId"}
DateTime Day6ObservationTime  "Observation time [%1$ta, %1$tm.%1$td.%1$tY %1$tH:%1$tM]"   {weather="locationId=home, forecast=6, type=condition, property=observationTime"}
Number   Day6Rain             "Rain [%.2f in/h]"                                   {weather="locationId=home, forecast=6, type=precipitation, property=rain, unit=inches"}
Number   Day6Snow             "Snow [%.2f in/h]"                                   {weather="locationId=home, forecast=6, type=precipitation, property=snow, unit=inches"}
Number   Day6Precip_Probability  "Precip probability [%d %%]"                      {weather="locationId=home, forecast=6, type=precipitation, property=probability"}
Number   Day6Wind_Speed       "Windspeed [%.2f mph]"                               {weather="locationId=home, forecast=6, type=wind, property=speed, unit=mph"}
String   Day6Wind_Direction   "Wind direction [%s]"                                {weather="locationId=home, forecast=6, type=wind, property=direction"}
Number   Day6Wind_Chill       "Wind chill [%.2f °F]"                               {weather="locationId=home, forecast=6, type=wind, property=chill"}


/* Astro data */
DateTime CurrentDate            "Date [%1$tA, %1$tm.%1$td.%1$tY]"                     <calendar>  {channel="ntp:ntp:local:dateTime"}
DateTime CurrentTime            "Time [%1$tH:%1$tM]"                                  <time>      {channel="ntp:ntp:local:dateTime"}

Number   Sun_Elevation        "Sun Elevation"                                         <sun>       {channel="astro:sun:home:position#elevation"}
Number   Sun_Azimuth          "Sun Azimuth"                                           <sun>       {channel="astro:sun:home:position#azimuth"}
DateTime Sunrise_Start_Time   "Sunrise [%1$tH:%1$tM]"                                 <sunrise>   {channel="astro:sun:home:rise#start"}
DateTime Sunrise_End_Time     "Sunrise [%1$tH:%1$tM]"                                 <sunrise>   {channel="astro:sun:home:rise#end"}
DateTime Sunset_Start_Time    "Sunset [%1$tH:%1$tM]"                                  <sunset>    {channel="astro:sun:home:set#start"}
DateTime Sunset_End_Time      "Sunset [%1$tH:%1$tM]"                                  <sunset>    {channel="astro:sun:home:set#end"}
DateTime Sun_Total_Eclipse    "Sun Total Eclipse [%1$tH:%1$tM - %1$tm.%1$td.%1$tY]"   <sun>       {channel="astro:sun:home:eclipse#total"}
DateTime Sun_Part_Eclipse     "Sun Partial Eclipse [%1$tH:%1$tM - %1$tm.%1$td.%1$tY]" <sun>       {channel="astro:sun:home:eclipse#partial"}

DateTime Moonrise_Time        "Moonrise [%1$tH:%1$tM]"                                <moon>      {channel="astro:moon:home:rise#start"}
DateTime Moonset_Time         "Moonset [%1$tH:%1$tM]"                                 <moon>      {channel="astro:moon:home:set#end"}
Number   Moon_Elevation       "Moon Elevation"                                        <moon>      {channel="astro:moon:home:position#elevation"}
Number   Moon_Azimuth         "Moon Azimuth"                                          <moon>      {channel="astro:moon:home:position#azimuth"}
DateTime Moon_Total_Eclipse   "Moon Total Eclipse [%1$tH:%1$tM - %1$tm.%1$td.%1$tY]"  <moon>      {channel="astro:moon:home:eclipse#total"}
DateTime Moon_Part_Eclipse    "Moon Partial Eclipse [%1$tH:%1$tM - %1$tm.%1$td.%1$tY]" <moon>     {channel="astro:moon:home:eclipse#partial"}
String   Moon_Phase           "Moon Phase"                                            <moon>      {channel="astro:moon:home:phase#name"}
String   Season               "Season"                                                            {channel="astro:sun:home:season#name"}

/* Misc */
Switch  WaterHeaterAlarmSwitch         "Water Heater Alarm Switch"       (Switches)
Switch  MailboxSwitch                  "Mailbox Switch"                  (Switches)
Switch  MorningSwitch                  "Morning Switch"                  (Switches)
Switch  DaySwitch                      "Day Switch"                      (Switches)
Switch  EveningSwitch                  "Evening Switch"                  (Switches)
Switch  NightSwitch                    "Night Switch"                    (Switches)
Switch  SilentSwitch                   "Silent Switch"                   (Switches)
Switch  SilentFollowsModeSwitch        "Silent Follows Mode Switch"      (Switches)
Switch  DoorbellSwitch                 "Doorbell Switch"                 (Switches)
Switch  DogbarkSwitch                  "Dog Bark Switch"                 (Switches)
Switch  VacationSwitch                 "Vacation Switch"                 (Switches)
Switch  VacationTestSwitch             "Vacation Test Switch"            (Switches)
Switch  VacationInsideSwitch           "Vacation Inside Lights Switch"   (Switches)
Switch  VacationOutsideSwitch          "Vacation Outside Lights Switch"  (Switches)
Switch  VacationIsRunningSwitch        "Vacation Is Running Switch"      (Switches)
Switch  AnnounceOutsideDoorsSwitch     "Announce Outside Doors"          (Switches)
Switch  AnnounceInsideDoorsSwitch      "Announce Inside Doors"           (Switches)
Switch  AnnounceGarageDoorsSwitch      "Announce Garage Doors"           (Switches)
Switch  AnnounceDrivewaySwitch         "Announce Driveway"               (Switches)
Switch  AnnounceInsideDoorLocksSwitch  "Announce Inside Door Locks"      (Switches)
Switch  AnnounceOutsideDoorLocksSwitch "Announce Outside Door Locks"     (Switches)
Switch  AnnounceOutsideWindowsSwitch   "Announce Outside Windows"        (Switches)
Switch  AnnounceInsideWindowsSwitch    "Announce Inside Windows"         (Switches)
Switch  AnnounceOutsideMotionSwitch    "Announce Outside Motion"         (Switches)
Switch  AnnounceInsideMotionSwitch     "Announce Inside Motion"          (Switches)
Switch  NightlightSwitch               "Nightlight"                      (Switches)
Switch  GarageCloseAllSwitch           "Close All Garage Doors Switch"   (Switches)
Switch  SpeakThisSwitch                "Speak This Switch"
Switch  SpeakingActiveSwitch           "Speaking Active Switch"
Switch  SpeakTestSwitch
Switch  SpeakTestSwitch2
Number  Volume

Switch  AlarmEnabledSwitch             "Alarm Enable Switch"             
Switch  PanicEnabledSwitch             "Panic Enable Switch"             
Switch  AwaySwitch                     "Away Switch"                     
Switch  EnableEmailSwitch              "Enable Email Switch"             
String  AlarmCommand                   "Alarm Command"                   
String  AlarmString                    "Alarm String"                   
Switch  AlarmKeypad                    "Alarm Keypad"                           
Switch  TamperEnabledSwitch            "Tamper Enable Switch"            

/* multimedia */
Number  InternetRadio                  "Internet Radio"
Dimmer  InternetRadioVolume            "Internet Radio Volume [%.0f %%]"