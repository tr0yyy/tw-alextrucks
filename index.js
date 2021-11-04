const express = require('express');

app = express();

console.log(__dirname)

app.set("view engine", "ejs");
app.get("/resurse", express.static(__dirname + "/resurse"));

app.get("/", function(req, res){
    console.log(req.url);
    res.render("pagini/index");
})

app.get("/ceva", function(req, res){
    console.log(req.url);
    res.write("Pagina21!");
    res.end();
})

app.get("/*", function(req, res){
    console.log(req.url);
    res.render("pagini" + req.url, function(err, rezultatRender){
        console.log(err);
        if(err){
            res.render("pagini/404");
        }
        else{
            res.send(rezultatRender);
        }
        console.log(rezultatRender);
        res.send(rezultatRender);
    })

})

app.listen(8080);

console.log("Serverul a pornit")

