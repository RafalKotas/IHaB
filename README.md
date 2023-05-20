# IHaB
Intelligent House and Buildings - project, weather conditions visualizer + comfort indicator

### How to use
React app:
1. Download zip and unpack/clone repository
2. Install npm packages:
* Run command: "npm install"
* Install react-jsx-highcharts (https://www.npmjs.com/package/react-jsx-highcharts): "npm i react-jsx-highcharts"
3. Run node app using command "npm start"

Python Flask endpoint (not available at this moment):
1. Run Python app from file "main.py" (Initially, the values for the comfort indicator (temperature, humidity) were determined in the endpoint, but due to the fact that the external API stopped working, the values are determined locally at random.)

### App usage
1. "Year to year" chart

     1.1 Select the beginning of the interval from the date picker below the graph - day and hour (year is not important)
     
     1.2 Select the end of the interval from the date picker below the graph - day and hour (year is not important)
     
     1.3 Select years (max 5) to compare data from selected interval of time
     
2. "Day to day" chart

    2.1 Select the beginning of the interval from the time picker below the graph
    
    2.2 Select the end of the interval from the time picker below the graph
    
    2.3 Select days from DAY TO DAY SELECTOR (you can remove selected day from select list by clicking on day to remove)
    
3. "Hour to hour" chart
    
    3.1 Select days from "Days Selector Picker" (MAX 5)

    3.2 Select the day for which the hourly interval is to be selected (on side panel)
    
    3.3 Select hourly interval duration (1, 2, 3, 4, 6, 8, 12)

    3.4 Select start and end hour for interval

After adding selected years on time/hour intervals check if provided data is correct by clicking **"CHECK DATA CORRECT"** button.
Next step is to click **"FETCH DATA"** on changed button. In case of errors, an explanation dialog appears.

Notes:
- the maximum number of samples to be downloaded at one time is 8000, so despite choosing a longer interval, the latest data will be downloaded (about 3.5 days)
- you can check the real time checkbox to download new data if the end of at least one of the selected intervals is in the future (enabled after successful data validation).

