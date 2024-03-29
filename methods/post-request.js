const crypto = require("crypto");
const requestBodyparser = require("../util/body-parser");
const data = require("../data/meetings.json");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require('fs');
const path = require('path');
const formidable = require("formidable");

module.exports = (req, res) => {
  if (!res || !res.writeHead) {
    console.error("Invalid response object provided");
    return;
  }
  if (req.url === "/api/auth/login" && req.method === "POST") {
    requestBodyparser(req)
      .then((body) => {
        const { email, password } = body;

        if (email === 'a_sadakbayeva@alemagro.com' && password === 'password') {
          const user = {
            id: 1174,
            email: 'a_sadakbayeva@alemagro.com',
            name: 'Aruzhan Sadakbayeva',
            access_availability: [1, 2, 3],
            version: 1.0,
            telegramId: '123456',
            workPosition: 'iOS developer',
            active: 1,
            unFollowClients: [4, 5, 6],
            favoriteClients: [7, 8, 9],
            subscribesRegion: [10, 11, 12]
          };

          const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({
              user,
              status: true,
              token,
              token_type: 'Bearer',
              token_validity: 3600
            })
          );
        } else {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(
            JSON.stringify({
              error: 'Unauthorized',
              message: 'Invalid email or password'
            })
          );
        }
      });
  }




  else if (req.url === "/api/meetings" && req.method === "POST") {
    if (req.headers["content-type"].startsWith("multipart/form-data")) {
      upload.single("file")(req, res, (err) => {
        if (err) {
          console.error(err);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "File upload failed" }));
          return;
        }

        const { type, key, src, value } = req.body;

        if ([key === "file" && src && type === "file"], [key === "type" && value === "uploadFile" && type === "text"],
         [key === "action" && value === "visitProfile" && type === "text"], [key === "visitId" && value && type === "text"]) {
          const filePath = req.file.path;
          const { visitId } = req.body;

          // Read the existing meetings data from the JSON file
          fs.readFile("./data/meetings.json", (err, data) => {
            if (err) {
              console.error(err);
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "Failed to read meetings data" }));
              return;
            }

            // Parse the JSON data into a JavaScript object
            const meetingsObj = JSON.parse(data);

            // Push the uploaded file to the appropriate array
            meetingsObj.data.plannedMeetingMob.uploadFile.push({
              name: req.file.originalname,
              path: filePath,
              date: new Date().toISOString(),
              visitId: visitId
            });

            // Convert the updated object back to a JSON string and write it to the file
            fs.writeFile("./data/meetings.json", JSON.stringify(meetingsObj), (err) => {
              if (err) {
                console.error(err);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Failed to write meetings data" }));
                return;
              }

              // Send the response
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ success: true }));
            });
          });
        } else if ([key === "file" && type === "file"], [key === "type" && value === "uploadFile" && type === "text"],
         [key === "action" && value === "recommendations" && type === "text"], [key === "visitId" && value && type === "text"]) {
          const filePath = req.file.path;
          const { visitId } = req.body;

          // Read the existing meetings data from the JSON file
          fs.readFile("./data/meetings.json", (err, data) => {
            if (err) {
              console.error(err);
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "Failed to read meetings data" }));
              return;
            }

            // Parse the JSON data into a JavaScript object
            const meetingsObj = JSON.parse(data);

            // Push the uploaded file to the appropriate array
            meetingsObj.data.plannedMeetingMob.uploadFile.push({
              name: req.file.originalname,
              path: filePath,
              date: new Date().toISOString(),
              visitId: visitId
            });

            // Convert the updated object back to a JSON string and write it to the file
            fs.writeFile("./data/meetings.json", JSON.stringify(meetingsObj), (err) => {
              if (err) {
                console.error(err);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Failed to write meetings data" }));
                return;
              }

              // Send the response
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ success: true }));
            });
          });
        } else {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              title: "Validation Failed",
              message: "Request body is not valid",
            })
          );
        }
      });
    } else {
      requestBodyparser(req)
        .then((body) => {
          const { type, action, visitId, userId, clientId, workDone, fieldInspection, contractComplication, recomendation } = body;

          if (type === "plannedMeetingMob" && action === "getMeetings" && userId) {
            const message = data.data[type][action][userId];

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(message));
          }
          else if (type === "plannedMeetingMob" && action === "getDetailMeeting" && visitId) {
            const message = data.data[type][action][visitId];

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(message));
          }
          else if (type === "meetingSurvey" && action === "getHandBookWorkDone") {
            const message = data.data[type][action];

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(message));
          }
          else if (type === "meetingSurvey" && action === "getHandBookFieldInsp") {
            const message = data.data[type][action];

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(message));
          }
          else if (type === "meetingSurvey" && action === "getHandBookContractComplications") {
            const message = data.data[type][action];

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(message));
          }
          else if (type === "meetingSurvey" && action === "getHandBookMeetingRecommendations") {
            const message = data.data[type][action];

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(message));
          }
          else if (type === "plannedMeetingMob" && action === "setStartVisit" && visitId) {
            const meeting = data.data[type]["getDetailMeeting"][visitId];
            if (meeting) {
              meeting.statusVisit = true;
              meeting.startVisit = new Date().toISOString();
              const fs = require("fs");
              const filePath = "./data/meetings.json";
              const dataToSave = JSON.stringify(data);
              fs.writeFile(filePath, dataToSave, (err) => {
                if (err) {
                  console.error("Error saving data:", err);
                  res.writeHead(500, { "Content-Type": "application/json" });
                  res.end(JSON.stringify({ message: "Error saving data" }));
                } else {
                  res.writeHead(200, { "Content-Type": "application/json" });
                  res.end(JSON.stringify({ message: "startdate fixed" }));
                }
              });
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({
                message: "Start date fixed",
                meeting: meeting
              }));
            }
          }
          else if (type === "plannedMeetingMob" && action === "setFinishVisit" && visitId) {
            const meeting = data.data[type]["getDetailMeeting"][visitId];
            if (meeting) {
              meeting.statusVisit = false;
              meeting.finishVisit = new Date().toISOString();
              const fs = require("fs");
              const filePath = "./data/meetings.json";
              const dataToSave = JSON.stringify(data);
              fs.writeFile(filePath, dataToSave, (err) => {
                if (err) {
                  console.error("Error saving data:", err);
                  res.writeHead(500, { "Content-Type": "application/json" });
                  res.end(JSON.stringify({ message: "Error saving data" }));
                } else {
                  res.writeHead(200, { "Content-Type": "application/json" });
                  res.end(JSON.stringify({ message: "startdate fixed" }));
                }
              });
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({
                message: "Finish date fixed",
                meeting: meeting
              }));
            }
          }
          else if (type === "client" && action === "getContractAnalysis" && clientId) {
            const message = data.data[type][action][clientId];

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(message));
          }
          else if (type === "client" && action === "getSubscidesList" && clientId) {
            const message = data.data[type][action][clientId];

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(message));
          }
          else if (type === "client" && action === "getCropRotation" && clientId) {
            const message = data.data[type][action][clientId];

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(message));
          }
          else if (type === "client" && action === "getContract" && clientId) {
            const message = data.data[type][action][clientId];

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(message));
          }
          else if (type === "meetingSurvey" && action === "fixedSurvey" && visitId && workDone && fieldInspection && contractComplication && recomendation)  {
           
           
  
            // Read the existing meetings data from the JSON file
            fs.readFile("./data/meetings.json", (err, data) => {
              if (err) {
                console.error(err);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Failed to read meetings data" }));
                return;
              }
  
              // Parse the JSON data into a JavaScript object
              const meetingsObj = JSON.parse(data);
  
              // Push the uploaded file to the appropriate array
              meetingsObj.data.meetingSurvey.fixedSurvey.push({
               
                date: new Date().toISOString(),
                visitId: visitId,
                workDone: workDone,
                fieldInspection: fieldInspection,
                contractComplication: contractComplication,
                recomendation: recomendation

              });
  
              // Convert the updated object back to a JSON string and write it to the file
              fs.writeFile("./data/meetings.json", JSON.stringify(meetingsObj), (err) => {
                if (err) {
                  console.error(err);
                  res.writeHead(500, { "Content-Type": "application/json" });
                  res.end(JSON.stringify({ error: "Failed to write meetings data" }));
                  return;
                }
  
                // Send the response
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: true }));
              });
            });
          } 

          else {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                title: "Validation Failed",
                message: "Request body is not valid",
              })
            );
          }

        })
        .catch((err) => {
          console.log(err);
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              title: "Validation Failed",
              message: "Request body is not valid",
            })
          );
        });
    }

  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ title: "Not Found", message: "Route not found" }));
  }
};

