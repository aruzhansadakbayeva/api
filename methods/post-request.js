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
        const visit = { type: body.type, action: body.action, userId: body.userId };
        const message = data.data[visit.type][visit.action][visit.userId];

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(message));
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
