# NGA-Expedition
NGA Expedition Hackathon (9/10-9/11/2016)

Live Demo: http://chi-risk-map.s3-website-us-west-2.amazonaws.com/

_Note - The routing API only works through HTTPS so until I invest in a non-AWS domain name or find a way to generate a free SSL certificate, you will not be able to see the directions or routing features in the screenshots below. If you have PHP and Apache set up on your computer, I have included a demo PHP file that you can simply run off of localhost to get those services to work._

## Summary
**Project: Chicago Risk Map**

Uses a combination of arrest data as well as metrics correlated with incidences of crime to draw conclusions and predictive analysis on 'at-risk' housing complexes and neighborhoods. Also bundles in a suite of navigational tools, geared towards police officers, EMT, and general first responders. Geographic data visualization done with HERE Maps Javascript API and their extensive REST API suite including routing, geofencing, and shapes services.



## Default On-Load/Refresh Screen
![alt tag](/screens/initial.png)

## Neighborhood Shapes and Metrics
![alt tag](/screens/neighborhood.png)

## Reverse Isoline Implementation to Determine 'Area of Accessibility'
![alt tag](/screens/reverse-isoline.png)

## Filtered Call to Chicago Data Portal for Nearby Crime
![alt tag](/screens/crimes.png)

## Accessing Embedded GeoJSON Data On-Click
![alt tag](/screens/overview.png)

## Routing API for Verbal and Visual Directions from Current Location
![alt tag](/screens/routing.png)
