convertExcel = require('excel-as-json').processFile;

var options = {
  sheet: '1',
  isColOriented: false,
}

convertExcel('history.xlsx', 'chemicalHistory.json', options, (err, data) => {
  if (err) {
    console.log(err);
  } else {
    console.log("great success");
  }
});
