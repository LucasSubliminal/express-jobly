const { BadRequestError } = require("../expressError");

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");
  // If the keys objects length is equal to zero there will be an error that says "No Data"
  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );
  //The cols array is is mapped over the keys of dataToUpdate.
  //It checks if theres a sql name to jsToSql that is corresponding.
  //If there is a corresponding name it used the name if not it uses the original key.

  return {
    setCols: cols.join(", "),
    //Joins together the cols by a comma
    values: Object.values(dataToUpdate),
    //Uses the parameters by extraccting the values from dataToUpdate.
  };
}

module.exports = { sqlForPartialUpdate };

//Exports the only function in this file
