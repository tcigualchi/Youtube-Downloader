//packages
const express = require("express")
const fetch = require("node-fetch")
require("dotenv").config();

//express server
const app = express();

//server config
const PORT = process.env.PORT || 3000;

//template
app.set("engine", "ejs");
app.use(express.static(__dirname + '/public'));


//html data
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json());

app.get("/", (req, res) => {
    res.render("index.ejs")
})

app.post("/convert-mp3", async (req, res) => {

    const videoId = req.body.videoId;
    
    if(
      videoId === undefined ||
      videoId === "" ||
      videoId === null
    ){
      return res.render("index.ejs", { success : false, message : "Coloque o ID Correto"});
    } else {
      
      const fetchAPI = await fetch(`https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`, {
        "method": "GET",
        "headers": {
          "x-rapidapi-key": process.env.API_KEY,
          "x-rapidapi-host": process.env.API_HOST
          }
      });
  
      const fetchResponse = await fetchAPI.json();
   
      if(fetchResponse.status === "ok")
        return res.render("index.ejs",{ success : true,  song_title : fetchResponse.title, song_link : fetchResponse.link})
      else
        return res.render("index.ejs", { success : false, message : fetchResponse.msg});
    }
  });

//run server
app.listen(PORT, ()=> {
    console.log(`Servidor Iniciado. Está na PORT: ${PORT}`);
})

