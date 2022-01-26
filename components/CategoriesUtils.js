const {Client}= require("pg");
const fs = require("fs");

function getAllCategoriesToFile(client, path) {
   client.query("select * from unnest(enum_range(null::categ_camion))", function(errCateg, rezCateg) {
        v_optiuni = [];
        //console.log(rezCateg);
        for (let elem of rezCateg.rows) {
            v_optiuni.push(elem.unnest);
        }
        fs.writeFileSync(path, v_optiuni.toString(), function(err, result) {
           if(err) console.log('error', err);
       });
    })
}

module.exports = {
    getAllCategoriesToFile
}