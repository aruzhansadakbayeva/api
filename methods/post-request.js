const crypto = require("crypto");
const requestBodyparser = require("../util/body-parser");
const data = require("../data/meetings.json");

module.exports = (req, res) => {
  if (!res || !res.writeHead) {
    console.error("Invalid response object provided");
    return;
  }

  if (req.url === "/api/meetings" && req.method === "POST") {
    requestBodyparser(req)
      .then((body) => {
        const { type, action, visitId, userId } = body;

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
