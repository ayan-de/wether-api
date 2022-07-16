const http = require('http');
const fs = require('fs');
var requests = require('requests');

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
    var Temp = orgVal.main.temp -273.15;
    let n = Temp.toFixed(2);
    var Temp_min = orgVal.main.temp_min -273.15;
    let n_min = Temp_min.toFixed(2);
    var Temp_max = orgVal.main.temp_max -273.15;
    let n_max = Temp_max.toFixed(2);
    let temperature = tempVal.replace("{%tempval%}", n);
     temperature = temperature.replace("{%tempmin%}", n_min);
     temperature = temperature.replace("{%tempmax%}", n_max);
     temperature = temperature.replace("{%location%}", orgVal.name);
     temperature = temperature.replace("{%country%}", orgVal.sys.country);
     temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
     return temperature;
 };

const server = http.createServer((req, res) => {

  if (req.url == "/") {
    requests("https://api.openweathermap.org/data/2.5/weather?q=Kolkata&appid=a9dc75a033dbadadc0eb572ec96975d8")
      .on("data", (chunk) => {
        const objdata = JSON.parse(chunk);
        const arrData = [objdata];
        // console.log(arrData[0].main.temp); 
        const realTimeData = arrData.map((val) => replaceVal(homeFile, val)).join("");
         res.write(realTimeData);
        //console.log(realTimeData);  
    })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
      });
  }
  else if(req.url != "/"){
    console.log("url not found");
  }
});

server.listen(8000, "127.0.0.1");