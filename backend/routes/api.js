var express = require("express");
const db = require("../db");
var azure = require("../ml/azure");
var tangram = require("../ml/tangram");
var router = express.Router();

router.post("/api", async (req, res, next) => {
  const { type } = req.body;
  const userId = (req.user_ ?? {}).id ?? null;
  console.log(req.isAuthenticated(), userId);
  if (type === "getCourseAssignments") {
    // name, numCompleted, numStudents, forecastTime
    const { course } = req.body;
    const assignments = await db.getRows(
      "SELECT id, name FROM classcaster_schema.assignments WHERE course_id = $1",
      [course]
    );
    const assignmentById = {};
    for (const assignment of assignments) {
      assignmentById[assignment.id] = assignment.name;
    }
    const assignments_str = assignments
      .map((x) => `'${x.id.toString()}'`)
      .join(", ");
    const rows = await db.getRows(
      `
        SELECT assignment_id, count(*) AS numStudents, count(*) filter (where completed) AS numCompleted, MAX(completed) filter (where user_id = $1) AS completed FROM (
            SELECT assignment_id, user_id, MAX(completed) AS completed FROM classcaster_schema.times
            WHERE assignment_id IN (${assignments_str})
            GROUP BY (assignment_id, user_id)
        ) GROUP BY (assignment_id) ORDER BY assignment_id;
        `,
      [userId]
    );
    console.log(assignmentById);
    rows.forEach((row) => {
      row.numStudents = parseInt(row.numstudents);
      row.numCompleted = parseInt(row.numcompleted);
      delete row.numstudents;
      delete row.numcompleted;
      row.name = assignmentById[row.assignment_id];
    });
    return res.json(rows);
  } else if (type === "runAzurePredictions") {
    const { user, course } = req.body;
    const output = await azure.getRecommendedGroup(user, course);
    return res.json(output);
  } else if (type == "trainTangram") {
    const { assignment } = req.body;
    const output = await tangram.updatePredictedScores(assignment);
    return res.json(output);
  } else if (type == "predictTangram") {
    const { user, assignment } = req.body;
    const output = await tangram.getPredictedScore(user, assignment);
    return res.json(output);
  }
});

module.exports = router;
