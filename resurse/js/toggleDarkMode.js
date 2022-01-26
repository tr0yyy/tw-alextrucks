function toggle() {
    var element = document.body;
    element.classList.toggle("dark");
    var elementgr = document.getElementById("gr");
    if(elementgr) {
        elementgr.classList.toggle("dark");
        var elementinterior = document.getElementById("gr").children;
        if(elementinterior) {
            for (let i = 0; i < elementinterior.length; i++) {
                elementinterior[i].classList.toggle("dark");
            }
        }
    }
    var tabelepic = document.getElementsByClassName("tabel-epic-frate")[0];
    if(tabelepic) {
        tabelepic.classList.toggle("dark");
    }
    var h1 = document.getElementById("top-h1");
    h1.classList.toggle("darkk");

}