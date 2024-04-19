# Crop Management System Readme

## Overview

This repository hosts the code for a Crop Management System tailored to support farmers in overseeing their tasks, crops, field irrigation, pests, soil conditions, resources, inventory, and more. Additionally, it includes a chatbot and tutorials to guide beginners in crop management.

## Features

- **Dashboard**: Users can access and manage field details, providing an overview of their fields in one centralized location.
  
- **Task Management**: The system enables users to observe, add and manage tasks associated with various farm activities, facilitating efficient task allocation and tracking.

- **Crop Management**: Users can monitor and add crops to their respective fields, while also receiving recommendations based on specific field conditions to optimize crop selection. The user will also be able to generate an entire plan from planting to harvesting automatically.

- **Irrigation Management**: The system offers a comprehensive view of field irrigation, including schedules, sensor data and statistics. Integration with Google Maps empowers users with real-time geographic data, while detailed charts provide insights into overall irrigation patterns.
  
- **Pest Management**: Users can access summarized information on pests affecting crops, along with corresponding treatment strategies. The system allows users to identify pests through images and receive tailored solutions.
  
- **Soil Management**: The platform facilitates the monitoring and addition of field nutrients, aiding users in maintaining optimal soil conditions for crop growth. 
  
- **Resource Allocation**: Users can efficiently manage equipment and inventory. The system also allows the user to store relevant records for both equipment and inventory.
  
- **Tutorial**: Educational resources such as articles and websites are provided to users to enhance their knowledge of crop management practices and techniques.

- **Chatbot**: An interactive chatbot is available to assist users with any queries.
  
- **Settings**: Users can update their account details.

## Deployment Instructions

To deploy the Crop Management System:

1. Clone this repository to your local machine.
   
2. Navigate to the path C:\crop-management-system-finals\node_modules\mysql\lib\ConnectionConfig.js and modify the port in the line below to your database port number:
  this.port               = options.port || 8080;

3. Find the keyword 'YOUR_API_KEY' and replace them with your API key. 
   
4. Download the SQL file and import it into the database.

5. Enter the command 'npm start' in the terminal and go to 'localhost:5000' in the browser. Ensure that port number '5000' is not in use to ensure smooth system operation.
