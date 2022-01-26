window.onload = function(){
    var myData = loadFile("/resurse/json/categorii.json").split(',');
    var div = document.getElementById("lista-produse");
    var html = "";
    for(var categorie in myData) {
        html += " <a href=\"/produse?tip="+ myData[categorie] +"\"><div class=\"sageata\"><span>&#10230;</span></div>" + myData[categorie] + "</a>";
    }
    div.innerHTML = html;
}

function loadFile(filePath) {
    var result = null;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath, false);
    xmlhttp.send();
    if (xmlhttp.status === 200) {
        result = xmlhttp.responseText;
    }
    return result;
}