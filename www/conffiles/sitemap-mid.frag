			Group item=Temperature
			Group item=Humidity
			Group item=Luminance
			Group item=Batteries
			Group item=Switches label="Settings"
        }
    }
	Frame label="Weather" {
		Text label="Current temperature" icon="temperature" item=CurrTemperature valuecolor=[CurrLastUpdate=="NULL"="lightgray",CurrLastUpdate>90="green",>25="orange",>15="green",>5="orange",<=5="blue"] {
			Frame label="Current weather" {
				Text item=CurrTemp_Max valuecolor=[>25="orange",>15="green",>5="orange",<=5="blue"]
				Text item=CurrTemp_Min valuecolor=[>25="orange",>15="green",>5="orange",<=5="blue"]
				Text item=CurrLastUpdate visibility=[CurrObservationTime>30] valuecolor=[CurrObservationTime>120="orange", CurrObservationTime>300="red"]
				Text item=   CurrVisibility       
				Text item=   CurrHumidity         
				Text item=   CurrPressure         
				Text item=   CurrPressure_Trend   
				Text item=   CurrOzone            
				Text item=   CurrUV_Index         

				Text item=   CurrClouds           

				Text item=   CurrCondition        
				Text item=   CurrCondition_ID     
				Text item= CurrObservationTime  
				Text item= CurrLastUpdate       
				Text item=   CurrCommonId         

				Text item=   CurrRain             
				Text item=   CurrSnow             
				Text item=   CurrPrecip_Probability  
				Text item=   CurrPrecip_Total     

				Text item=   CurrTemperature      
				Text item=   CurrTemp_Feel        
				Text item=   CurrTemp_Dewpoint    

				Text item=   CurrTemp_Min         
				Text item=   CurrTemp_Max         
				Text item=   CurrTemp_MinMax      

				Text item=   CurrWind_Speed       
				Text item=   CurrWind_Direction   
				Text item=   CurrWind_Degree      
				Text item=   CurrWind_Gust        
				Text item=   CurrWind_Chill 
            }   
			Frame label="Today's forecast" {
				Text item=   Day0Temp_MinMax      
				Text item=   Day0Temp_Min         
				Text item=   Day0Temp_Max         
				Text item=   Day0Humidity         
				Text item=   Day0Temp_Dewpoint    
				Text item=   Day0Pressure         
				Text item=   Day0Clouds           
				Text item=   Day0Condition        
				Text item=   Day0CommonId         
				Text item= Day0ObservationTime  
				Text item=   Day0Rain             
				Text item=   Day0Snow             
				Text item=   Day0Precip_Probability  
				Text item=   Day0Wind_Speed       
				Text item=   Day0Wind_Direction   
				Text item=   Day0Wind_Chill
			}
			Frame item=Day1ObservationTime {
				Text item=   Day1Temp_MinMax      
				Text item=   Day1Temp_Min         
				Text item=   Day1Temp_Max         
				Text item=   Day1Condition        
				Text item=   Day1CommonId         
				Text item= Day1ObservationTime  
				Text item=   Day1Rain             
				Text item=   Day1Snow             
				Text item=   Day1Precip_Probability  
				Text item=   Day1Wind_Speed       
				Text item=   Day1Wind_Direction
			}
			Frame item=Day2ObservationTime {
				Text item=   Day2Temp_MinMax      
				Text item=   Day2Temp_Min         
				Text item=   Day2Temp_Max         
				Text item=   Day2Condition        
				Text item=   Day2CommonId         
				Text item= Day2ObservationTime  
				Text item=   Day2Rain             
				Text item=   Day2Snow             
				Text item=   Day2Precip_Probability  
				Text item=   Day2Wind_Speed       
				Text item=   Day2Wind_Direction
			}
			/* Frame {
				Switch item=Weather_Chart_Period label="Chart Period" icon="chart" mappings=[0="Hour", 1="Day", 2="Week"]
				Chart item=Weather_Chart period=h refresh=600000 visibility=[Weather_Chart_Period==0, Weather_Chart_Period=="NULL"]
				Chart item=Weather_Chart period=D refresh=3600000 visibility=[Weather_Chart_Period==1]
				Chart item=Weather_Chart period=W refresh=3600000 visibility=[Weather_Chart_Period==2]
			} */
		}
		Text label="Astronomical Data" icon="sun" {
			Text item=Sun_Elevation
			Text item=Sun_Azimuth
			Text item=Sunrise_Start_Time label="Sunrise Start"
			Text item=Sunrise_End_Time   label="Sunrise End"
			Text item=Sunset_Start_Time  label="Sunset Start"
			Text item=Sunset_End_Time    label="Sunset End"
			Text item=Sun_Total_Eclipse 
			Text item=Sun_Part_Eclipse
			Text item=Moon_Elevation
			Text item=Moon_Azimuth
			Text item=Moonrise_Time
			Text item=Moonset_Time
			Text item=Moon_Total_Eclipse
			Text item=Moon_Part_Eclipse
			Text item=Moon_Phase
			Text item=Season
		}
	}