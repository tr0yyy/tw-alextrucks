const {response} = require('express');
const express = require('express');

app = express();

console.log(__dirname)

app.set("view engine", "ejs");
app.use("/resurse", express.static(__dirname + "/resurse"));


app.get("/", function(req, res){
    console.log(req.url);
    let ip = req.ip;
    res.render("pagini/index", {your_ip: ip});
})

app.get("/index", function(req, res){
    console.log(req.url);
    let ip = req.ip;
    res.render("pagini/index",{your_ip: ip});
})

app.get("/*", function(req, res){
    console.log(req.url);
    if(req.url.toString().includes(".ejs")){
        res.render("pagini/403")
    } else {
        res.render("pagini" + req.url, function (err, rezultatRender) {
            console.log(err);
            if (err) {
                res.render("pagini/404");
            } else {
                res.render("pagini/oferta")
            }
        })
    }

})

app.listen(8080);

console.log("Serverul a pornit")

