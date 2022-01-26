const {response} = require('express');
const express = require('express');
const {Client}= require("pg");
const fs = require("fs");
const sharp = require("sharp");
const categoriesUtils = require("./components/CategoriesUtils");
const url = require('url');
const path = require('path');
const sass=require('sass');
const formidable= require('formidable');
const crypto= require('crypto');
const nodemailer= require('nodemailer');
const session= require('express-session');
const xmljs = require('xml-js');
const request = require('request');
const html_to_pdf = require('html-pdf-node');
var QRCode = require('qrcode');
const helmet=require('helmet');

//var client=new Client({ user: 'alex', password:'alex', database:'postgres', host:'localhost', port:5432 });

var client; //folosit pentru conexiunea la baza de date
if(process.env.SITE_ONLINE){
    protocol="https://";
    numeDomeniu="ancient-cliffs-59708.herokuapp.com"//atentie, acesta e domeniul pentru aplicatia mea; voi trebuie sa completati cu datele voastre
    client=new Client({
        user: 'wdmgtqdmwczcts',
        password:'733ca6c423028c5fbe8e82b153abf6007abfb96519d34cd08d63c9a83dd7dcbd',
        database:'dbb3cktv37626g', host:'ec2-52-2-245-64.compute-1.amazonaws.com', port:5432,
        ssl: {
            rejectUnauthorized: false
        } });

}
else{
    client=new Client({
        user: 'wdmgtqdmwczcts',
        password:'733ca6c423028c5fbe8e82b153abf6007abfb96519d34cd08d63c9a83dd7dcbd',
        database:'dbb3cktv37626g', host:'ec2-52-2-245-64.compute-1.amazonaws.com', port:5432,
        ssl: {
            rejectUnauthorized: false
        } });
    protocol="http://";
    numeDomeniu="localhost:8080";
}

client.connect();

async function trimiteMail(username, email, token){
    var transp= nodemailer.createTransport({
        service: "gmail",
        secure: false,
        auth:{//date login
            user:"tehniciwebalextrucks@gmail.com",
            pass:"pass123!!"
        },
        tls:{
            rejectUnauthorized:false
        }
    });
    //genereaza html
    await transp.sendMail({
        from:"tehniciwebalextrucks@gmail.com",
        to:email,
        subject:"Te-ai inregistrat cu succes",
        text:"Username-ul tau este "+username,
        html:`<h1>Salut!</h1><p style='color:blue'>Username-ul tau este ${username}.</p> <p><a href='http://${numeDomeniu}/cod/${username}/${token}'>Click aici pentru confirmare</a></p>`,
    })
    console.log("trimis mail");
}


sirAlphaNum="";
v_intervale=[[48,57],[65,90],[97,122]];
for (let interval of v_intervale){
    for (let i=interval[0];i<=interval[1];i++)
        sirAlphaNum+=String.fromCharCode(i);
}
console.log(sirAlphaNum);



function genereazaToken(lungime){
    sirAleator="";
    for(let i=0;i<lungime; i++){
        sirAleator+= sirAlphaNum[ Math.floor( Math.random()* sirAlphaNum.length) ];
    }
    return sirAleator
}


app = express();

console.log(__dirname)

app.set("view engine", "ejs");
app.use("/resurse", express.static(__dirname + "/resurse"));
categoriesUtils.getAllCategoriesToFile(client, "resurse/json/categorii.json")



app.get('*', function (req, res, next) {
    const protocol = req.protocol;
    const host = req.hostname;
    if(protocol === 'http' || host === 'localhost' || client.valueOf(host) === 'localhost') {
        console.log("ESTI PE LOCALHOST");
    } else {
        console.log("ESTI PE HEROKU FRATE");
    }
    next();
});

app.get("/", function(req, res){

    let ip = req.ip;
    res.render("pagini/index", {your_ip: ip, imagini:obImagini.imagini, cale:obImagini.cale_galerie});
})

app.get("/index", function(req, res){
    console.log(req.url);
    let ip = req.ip;
    res.render("pagini/index",{your_ip: ip, imagini:obImagini.imagini, cale:obImagini.cale_galerie});
})

app.get("/produse", function(req, res){
    console.log(req.query)
    var conditie=""
    if(req.query.tip)
        conditie+=` and categorie='${req.query.tip}'`;
    client.query(`select * from produse where 1=1 ${conditie}`, function(err,rez){
        console.log(err)
        if (!err){
            console.log(rez);
            client.query("select * from unnest(enum_range(null::categ_camion))", function(errCateg, rezCateg){
                v_optiuni=[];
                console.log(rezCateg);
                for(let elem of rezCateg.rows){
                    v_optiuni.push(elem.unnest);
                }
                client.query("select * from unnest(enum_range(null::tipuri_produs))", function(errProd, rezProd){
                    v_tipuri_produs=[];
                    console.log(rezProd);
                    for(let elem of rezProd.rows){
                        v_tipuri_produs.push(elem.unnest);
                    }
                    res.render("pagini/produse",{produse:rez.rows, optiuni:v_optiuni, tipuri_produs:v_tipuri_produs});
                })

            })
        } else {//TO DO curs
        }
    })
})

app.get("/produs/:id", function(req, res){
    console.log(req.params)
    client.query(`select * from produse where id=${req.params.id}`, function(err,rez){
        if (!err){
            console.log(rez);
            res.render("pagini/produs",{prod:rez.rows[0]});
        }
        else{//TO DO curs
        }
    })
})

function creeazaImagini(){
    var buf=fs.readFileSync(__dirname+"/resurse/json/galerie.json").toString("utf-8");
    obImagini=JSON.parse(buf);//global
    console.log(obImagini);
    for (let imag of obImagini.imagini){
        let nume_imag, extensie;
        [nume_imag, extensie ]=imag.cale_fisier.split(".")// "abc.de".split(".") ---> ["abc","de"]
        let dim_mic=150

        imag.mic=`${obImagini.cale_galerie}/mic/${nume_imag}-${dim_mic}.webp` //nume-150.webp // "a10" b=10 "a"+b `a${b}`
        console.log(imag.mic);
        imag.mare=`${obImagini.cale_galerie}/${imag.cale_fisier}`;
        if (!fs.existsSync(imag.mic))
            sharp(__dirname+"/"+imag.mare).resize(dim_mic).toFile(__dirname+"/"+imag.mic);


    }

}
creeazaImagini();
d=new Date()
console.log(d);
console.log(d+"");
console.log(10);


parolaCriptare="curs_tehnici_web";

app.post("/inreg", function(req, res){
    var formular= new formidable.IncomingForm();
    var username;
    formular.parse(req,function(err, campuriText, campuriFile){//4
        console.log(campuriText);
        console.log("Email: ", campuriText.email);
        //verificari - TO DO
        var eroare="";
        if (!campuriText.username)
            eroare+="Username-ul nu poate fi necompletat. ";
        //TO DO - de completat pentru restul de campuri required

        if ( !campuriText.username.match("^[A-Za-z0-9]+$"))
            eroare+="Username-ul trebuie sa contina doar litere mici/mari si cifre. ";
        //TO DO - de completat pentru restul de campuri functia match

        if (eroare!=""){
            res.render("pagini/inregistrare",{err:eroare});
            return;
        }

        queryVerifUtiliz=` select * from users where username= '${campuriText.username}' `;
        console.log(queryVerifUtiliz)

        client.query(queryVerifUtiliz, function(err, rez){
            if (err){
                console.log(err);
                res.render("pagini/inregistrare",{err:"Eroare baza date"});
            }

            else{
                if (rez.rows.length==0){

                    var criptareParola=crypto.scryptSync(campuriText.parola,parolaCriptare,32).toString('hex');
                    var token=genereazaToken(100);
                    var queryUtiliz=`insert into users (username, nume, prenume, parola, email, culoare_chat, cod) values ('${campuriText.username}','${campuriText.nume}','${campuriText.prenume}', $1 ,'${campuriText.email}','${campuriText.culoareText}','${token}')`;

                    console.log(queryUtiliz, criptareParola);
                    client.query(queryUtiliz, [criptareParola], function(err, rez){ //TO DO parametrizati restul de query
                        if (err){
                            console.log(err);
                            res.render("pagini/inregistrare",{err:"Eroare baza date"});
                        }
                        else{
                            trimiteMail(campuriText.username,campuriText.email, token);
                            res.render("pagini/inregistrare",{err:"", raspuns:"Date introduse"});
                        }
                    });
                }
                else{
                    eroare+="Username-ul mai exista. ";
                    res.render("pagini/inregistrare",{err:eroare});
                }
            }
        });
    });
    formular.on("field", function(nume,val){  // 1 pentru campuri cu continut de tip text (pentru inputuri de tip text, number, range,... si taguri select, textarea)
        console.log("----> ",nume, val );
        if(nume=="username")
            username=val;
    })
    formular.on("fileBegin", function(nume,fisier){ //2
        if(!fisier.originalFilename)
            return;
        folderUtilizator=__dirname+"/poze_uploadate/"+username+"/";
        console.log("----> ",nume, fisier);
        if (!fs.existsSync(folderUtilizator)){
            fs.mkdirSync(folderUtilizator);
            v=fisier.originalFilename.split(".");
            fisier.filepath=folderUtilizator+"poza."+v[v.length-1];//setez calea de upload
            //fisier.filepath=folderUtilizator+fisier.originalFilename;
        }

    })
    formular.on("file", function(nume,fisier){//3
        //s-a terminat de uploadat
        console.log("fisier uploadat");
    });
});

app.get("/*", function(req, res){
    console.log(req.url);
    if(req.url.toString().endsWith(".ejs")){
        res.render("pagini/403")
    } else {
        res.render("pagini" + req.url, function (err, rezultatRender) {
            console.log(err);
            if (err) {
                res.render("pagini/404");
            } else {
                res.send(rezultatRender);
            }
        })
    }

})




var s_port=process.env.PORT || 5000;
app.listen(s_port);
//app.listen(8080);

console.log("Serverul a pornit")

