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

  if (req.url === "/api/meetings" && req.method === "POST") {
    requestBodyparser(req)
      .then((body) => {
        const { type, action, visitId, userId} = body;
        if (type === "plannedMeetingMob" && action === "getMeetings" && userId) {
          const message = data.data[type][action][userId];

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(message));
        } else if (type === "plannedMeetingMob" && action === "getDetailMeeting" && visitId) {
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
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ title: "Not Found", message: "Route not found" }));
  }
};



module.exports = (req, res) => {
  if (!res || !res.writeHead) {
    console.error("Invalid response object provided");
    return;
  }

  if (req.url === "/api/meetings" && req.method === "POST") {
    upload.single("file")(req, res, (err) => {
      if (err) {
        console.error(err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "File upload failed" }));
        return;
      }

      const { type, key, src, value } = req.body;
      let meetingsData = [];

      if ([key === "file" && src && type === "file"], [key === "type" && value ==="uploadFile" && type === "text"], [key === "action" && value ==="visitProfile" && type === "text"], [key === "visitId" && value  && type === "text"]) {
        const filePath = req.file.path;
        const fileUrl = `http://${req.headers.host}/uploads/${req.file.filename}`; // Создаем ссылку на загруженный файл
        const message = { message: "file uploaded", fileUrl }; // Включаем ссылку в тело ответа

        // Read the contents of meetings.json file
        const meetingsFilePath =   path.join(__dirname, "meetings.json");
        if (fs.existsSync(meetingsFilePath)) {
          meetingsData = JSON.parse(fs.readFileSync(meetingsFilePath));
        }

        // Add the new file information to the parsed object
        meetingsData.push({
          fileUrl,
          createdAt: new Date(),
        });

        // Write the updated object back to the file
        fs.writeFileSync(meetingsFilePath, JSON.stringify(meetingsData));

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(message));
      }  else if (
        key === "type" &&
        value === "uploadFile" &&
        type === "text"
      ) {
        const message = "text file uploaded";

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(message));
      } else if (
        key === "action" &&
        value === "visitProfile" &&
        type === "text"
      ) {
        const message = "visit profile";

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(message));
      } else if (key === "visitId" && value && type === "text") {
        const message = "visit id";

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(message));
      } 

      else {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({ error: "Invalid request body parameters" })
        );
      }
    });
  }
};

