Interaction log placeholder

Initially the excercise description was pasted into ChatGPT along with a description of what the project should achieve. 
The goal was for ChatGPT to generate a thorough README.md file that explained the project, requirements structure and tech stack.
This README.md was given to Copilot as context for generating the entire project. 

Copilot managed to override the README.md without asking for permission.
The original context was moved to AI_CONTEXT.md and Copilot was asked specifically not to touch it in order to preserve it.

Installing Java and NPM because Agent managed to delete JAVA_HOME and npm installation.

could you replace the in memory database with an actual postgres database that runs locally in a docker container?

Create a gitignore.


When starting the application, clicking on the buttons to generate a QR code gives an error.
Error: <html> <head><title>404 Not Found</title></head> <body> <center><h1>404 Not Found</h1></center> <hr><center>nginx/1.29.3</center> </body> </html> <!-- a padding to disable MSIE and Chrome friendly error page --> <!-- a padding to disable MSIE and Chrome friendly error page --> <!-- a padding to disable MSIE and Chrome friendly error page --> <!-- a padding to disable MSIE and Chrome friendly error page --> <!-- a padding to disable MSIE and Chrome friendly error page --> <!-- a padding to disable MSIE and Chrome friendly error page -->
Fix this.


Can you make the frontend more inviting?
Still looks very basic. Adding screenshot of UI to context for Copilot. It agrees that it looks really sad. It'll try to do better now :)

nice.
Now can you think of a way to test the functionality (actually persisting the events in DB) without pulling out a separate device with camera?
The logic is that a separate device would scan the QR code with the app running on their device and the scan should trigger the actual event.
Just clicking the button should only generate the QR code

Database doesn't seem to work:
psql -h localhost -p 5432 -U postgres -d qrcode
psql: error: connection to server at "localhost" (::1), port 5432 failed: FATAL:  database "qrcode" does not exist

Add button simulating a scan and a button fetching all events from DB.
please add the userId to the time logs in frontend
