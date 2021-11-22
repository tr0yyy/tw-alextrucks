const {response} = require('express');
const express = require('express');
const {Client}= require("pg");

/*var client=new Client({ user: 'alex', password:'alex', database:'postgres', host:'localhost', port:5432 });
 */
var client = new Client({
    user: 'wdmgtqdmwczcts',
    password: '733ca6c423028c5fbe8e82b153abf6007abfb96519d34cd08d63c9a83dd7dcbd',
    database: 'dbb3cktv37626g',
    host: 'ec2-52-2-245-64.compute-1.amazonaws.com',
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    }
})

client.connect()

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

app.get("/produse", function(req, res){
    console.log(req.query)
    var conditie=""
    if(req.query.tip)
        conditie+=` and tip_produs='${req.query.tip}'`;
    client.query(`select * from produse where 1=1 ${conditie}`, function(err,rez){
        console.log(err)
        if (!err){
            //console.log(rez);
            res.render("pagini/produse",{produse:rez.rows});
        } else {//TO DO curs
        }
    })
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

