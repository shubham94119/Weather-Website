const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("index.html","utf-8");
// console.log(homeFile);
const replaceval = (tempval,orgval) =>{
   let temperature = tempval.replace("{%tempval%}",(orgval.main.temp-273.15).toPrecision(2) );
    temperature = temperature.replace("{%tempmin%}",(orgval.main.temp_min -273.15).toPrecision(2));
    temperature = temperature.replace("{%tempmax%}",(orgval.main.temp_max -273.15).toPrecision(2));
    temperature = temperature.replace("{%location%}",orgval.name);
    temperature = temperature.replace("{%country%}",orgval.sys.country);
    temperature = temperature.replace("{%tempstatus%}",orgval.weather[0].main);
    
return temperature;
}

const server = http.createServer((req,res)=>{
   if(req.url=="/") {
       requests("https://api.openweathermap.org/data/2.5/weather?q=patna&appid=2c4a73a779734975bf791edc42e11448"
       )
.on("data",  (chunk) => {
   const objdata =JSON.parse(chunk);
   const arrData = [objdata];
  const realTimeData = arrData.map((val)=>
      replaceval(homeFile,val)).join("");
  //console.log(val.main);

  res.write(realTimeData);
  console.log(realTimeData);
 
})
.on('end',  (err) => {
 if (err) return console.log('connection closed due to errors', err);

 res.end();
  console.log('end');
});
   }
   
});


 server.listen(8000,"127.0.0.1");


