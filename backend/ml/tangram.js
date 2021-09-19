const db = require("../db/index");

async function updatePredictedScores(assignment_id) {
  // TODO: Retrain model
  // To run a query, do:
  // const output = db.getRows(YOUR_SQL_QUERY, []);
  // e.g. db.getRows("SELECT * FROM classcaster_schema.users WHERE id = $1", [user_id])

  // TODO: Get data into CSV form
  // Save CSV file
  // Call from tangram train --file heart_disease.csv --target diagnosis

  const info = await db.getRows("SELECT user_id, assignment_id, SUM(num_hours) AS time, MAX(completed) AS complete, SUM(num_entries) AS days FROM (SELECT user_id, assignment_id, SUM(hours) AS num_hours, completed, COUNT(*) as num_entries FROM classcaster_schema.times GROUP BY (user_id, assignment_id, completed)) GROUP BY (user_id, assignment_id)", []);
  const background_info = await db.getRows("SELECT id AS user_id, race, gender, age, num_upper_taken, num_lower_taken FROM classcaster_schema.users", []);

  const createCsvWriter = require('csv-writer').createObjectCsvWriter;
  const csvWriter = createCsvWriter({
    path: 'out.csv',
    header: [
      {id: 'race', title: 'race'},
      {id: 'gender', title: 'gender'},
      {id: 'age', title: 'age'},
      {id: 'upper', title: 'upper'},
      {id: 'lower', title: 'lower'},
      {id: 'd2eb5e79-2a94-43db-b586-f522449f489e_time', title: 'd2eb5e79-2a94-43db-b586-f522449f489e_time'}, 
      {id: 'd2eb5e79-2a94-43db-b586-f522449f489e_days', title: 'd2eb5e79-2a94-43db-b586-f522449f489e_days'} ,
      {id: 'd2eb5e79-2a94-43db-b586-f522449f489e_complete', title: 'd2eb5e79-2a94-43db-b586-f522449f489e_complete'},
      {id: '6856acb6-248f-4596-a259-f52a472df78e_time', title: '6856acb6-248f-4596-a259-f52a472df78e_time'},
      {id: '6856acb6-248f-4596-a259-f52a472df78e_days', title: '6856acb6-248f-4596-a259-f52a472df78e_days'} ,
      {id: '6856acb6-248f-4596-a259-f52a472df78e_complete', title: '6856acb6-248f-4596-a259-f52a472df78e_complete'} ,
      {id: 'dda9d40a-6161-4b4f-b82b-72166ad7b476_time', title: 'dda9d40a-6161-4b4f-b82b-72166ad7b476_time'} ,
      {id: 'dda9d40a-6161-4b4f-b82b-72166ad7b476_days', title: 'dda9d40a-6161-4b4f-b82b-72166ad7b476_days'},
      {id: 'dda9d40a-6161-4b4f-b82b-72166ad7b476_complete', title: 'dda9d40a-6161-4b4f-b82b-72166ad7b476_complete'} ,
      {id: 'e19831e8-f092-4e94-bcc0-25ce5f4cfbf5_time', title: 'e19831e8-f092-4e94-bcc0-25ce5f4cfbf5_time'} ,
      {id: 'e19831e8-f092-4e94-bcc0-25ce5f4cfbf5_days', title: 'e19831e8-f092-4e94-bcc0-25ce5f4cfbf5_days'} ,
      {id: 'e19831e8-f092-4e94-bcc0-25ce5f4cfbf5_complete', title: 'e19831e8-f092-4e94-bcc0-25ce5f4cfbf5_complete'} 
    ]
  });

  var race_map = {
    "white": 0,
    "black": 1,
    "asian": 2,
    "hawaiian": 3,
    "american_indian": 4,
    "other": 5,
    "not_provided": 6
  }
  var gender_map = {
    "male": 0,
    "female": 1,
    "other": 2,
    "not_provided": 3
  }

  var class_feat = {};

   // Collect values for mean and std
  for (const row of background_info) {
    let intage = parseInt(row.age);
    if (intage == null || isNaN(intage)){
      intage = 20;
    }

    class_feat[row.user_id] = {
      "race": race_map[row.race],
      "gender": gender_map[row.gender],
      "age": intage,
      "upper": parseInt(row.num_upper_taken),
      "lower": parseInt(row.num_lower_taken)
    }
  }

  for (const row of info) {
    class_feat[row.user_id][(row.assignment_id)+"_time"] = parseFloat(row.time);
    class_feat[row.user_id][(row.assignment_id)+"_days"] = parseInt(row.days);
    let complete = 1 ? row.complete : 0;
    class_feat[row.user_id][(row.assignment_id)+"_complete"] = complete;
  }

  var data = [];
  for (const [uid, value] of Object.entries(class_feat)) {
    // If uid didn't complete the assignment, don't push
    let c = assignment_id+"_complete";
    if (value[c] == true) {
      data.push(value);
    } else {
      console.log(uid)
    }

  }

  // console.log(class_feat);

  csvWriter
  .writeRecords(data)
  .then(()=> console.log('The CSV file was written successfully'));

  var exec = require('child_process').exec, child;
  let cmd = 'tangram train --file out.csv --target ' + assignment_id + "_time";

  child = exec(cmd,
    function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
              console.log('exec error: ' + error);
        }
    });
  child();
}

async function getPredictedScore(user_id, assignment_id) {
  // TODO: Return predicted score for user with id = user_id
  const fs = require("fs");
  const path = require("path");
  const tangram = require("@tangramdotdev/tangram");

  const info = await db.getRows("SELECT user_id, assignment_id, SUM(num_hours) AS time, MAX(completed) AS complete, SUM(num_entries) AS days FROM (SELECT user_id, assignment_id, SUM(hours) AS num_hours, completed, COUNT(*) as num_entries FROM classcaster_schema.times GROUP BY (user_id, assignment_id, completed)) GROUP BY (user_id, assignment_id)", []);
  const background_info = await db.getRows("SELECT id AS user_id, race, gender, age, num_upper_taken, num_lower_taken FROM classcaster_schema.users", []);
  
  // Get the path to the .tangram file.
  const modelPath = path.join("out.tangram");
  // Load the model from the path.
  const modelData = fs.readFileSync(modelPath);
  const model = new tangram.Model(modelData.buffer);
  
  var race_map = {
    "white": 0,
    "black": 1,
    "asian": 2,
    "hawaiian": 3,
    "american_indian": 4,
    "other": 5,
    "not_provided": 6
  }
  var gender_map = {
    "male": 0,
    "female": 1,
    "other": 2,
    "not_provided": 3
  }

  var class_feat = {};

   // Collect values for mean and std
  for (const row of background_info) {
    let intage = parseInt(row.age);
    if (intage == null || isNaN(intage)){
      intage = 20;
    }

    class_feat[row.user_id] = {
      "race": race_map[row.race],
      "gender": gender_map[row.gender],
      "age": intage,
      "upper": parseInt(row.num_upper_taken),
      "lower": parseInt(row.num_lower_taken)
    }
  }

  for (const row of info) {
    class_feat[row.user_id][(row.assignment_id)+"_time"] = parseFloat(row.time);
    class_feat[row.user_id][(row.assignment_id)+"_days"] = parseInt(row.days);
    let complete = 1 ? row.complete : 0;
    class_feat[row.user_id][(row.assignment_id)+"_complete"] = complete;
  }

  let input = class_feat[user_id]
  delete input[assignment_id+"_complete"]
  delete input[assignment_id+"_days"]
  delete input[assignment_id+"_time"]
  
  // Make the prediction!
  const output = model.predict(input);
  
  // Print the output.
  console.log("Output:", output);
}

module.exports.updatePredictedScores = updatePredictedScores;
module.exports.getPredictedScore = getPredictedScore;