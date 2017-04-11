convertExcel = require('excel-as-json').processFile;

var options = {
  sheet: '1',
  isColOriented: false,
}

convertExcel('Resin Data 4-11-17.xlsx', 'packagingChart.json', options, (err, data) => {
  if (err) {
    console.log(err);
  } else {
    console.log("great success");
  }
});
