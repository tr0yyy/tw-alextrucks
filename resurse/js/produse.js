window.onload= function(){


    var btn=document.getElementById("filtrare");
    btn.onclick=function(){
        var articole=document.getElementsByClassName("produs");
        for(let art of articole){

            art.style.display="none";

            /*
            v=art.getElementsByClassName("nume")
            nume=v[0]*/
            var nume=art.getElementsByClassName("val-nume")[0];//<span class="val-nume">aa</span>
            console.log(nume.innerHTML)
            var conditie1=nume.innerHTML.startsWith(document.getElementById("inp-nume").value)

            var cuvinte_cheie = document.getElementById("inp-cuvinte-cheie").value.split(',');
            var conditie6 = false;
            for (let i = 0 ; i < cuvinte_cheie.length ; i++) {
                if(art.getElementsByClassName("val-descriere")[0].innerHTML.includes(cuvinte_cheie[i])) {
                    conditie6 = true;
                    break;
                }
            }

            var pret=art.getElementsByClassName("val-pret")[0]
            var conditie2=parseInt(pret.innerHTML) > parseInt(document.getElementById("inp-pret").value);

            var radbtns=document.getElementsByName("gr_rad");
            for (let rad of radbtns){
                if (rad.checked){
                    var valCalorii=rad.value;//poate fi 1, 2 sau 3
                    break;
                }
            }

            var caloriiArt= art.getElementsByClassName("val-np")[0].innerHTML;
            var conditie3=false;
            var valoareNormaPoluare = parseInt(caloriiArt.split(' ')[1])
            console.log(valoareNormaPoluare)
            switch (valCalorii){
                case "1": conditie3= (valoareNormaPoluare < 4); break;
                case "2": conditie3= (valoareNormaPoluare>=4 && valoareNormaPoluare<6); break;
                case "3": conditie3= (valoareNormaPoluare>=6); break;
                default: conditie3=true;

            }
            console.log(conditie3);

            var selCateg=document.getElementById("inp-categorie");
            var conditie4= (art.getElementsByClassName("val-categorie")[0].innerHTML === selCateg.value ||  selCateg.value==="toate");
            var opMultiple = Array.prototype.slice.call(document.querySelectorAll('#tipuri_produs option:checked'),0).map(function(v,i,a) {
                console.log(v.value);
                return v.value;
            });
            var conditie5 = (opMultiple.includes(art.getElementsByClassName("val-tip-produs")[0].innerHTML) || opMultiple.includes("toate"));
            console.log(conditie5);

            if(conditie1 && conditie2 && conditie3 && conditie4 && conditie5 && conditie6)
                art.style.display="grid";
            
        }
    }
    var rng=document.getElementById("inp-pret");
    rng.onchange=function(){
        var info = document.getElementById("infoRange");//returneaza null daca nu gaseste elementul
        if(!info){
            info=document.createElement("span");
            info.id="infoRange"
            this.parentNode.appendChild(info);
        }
        
        info.innerHTML="("+this.value+")";
    }



    function sorteaza(semn){
        var articole=document.getElementsByClassName("produs");
        var v_articole=Array.from(articole);
        v_articole.sort(function(a,b){
            var pret_a=parseInt(a.getElementsByClassName("val-pret")[0].innerHTML);
            var pret_b=parseInt(b.getElementsByClassName("val-pret")[0].innerHTML);
            if(pret_a !== pret_b){
                return semn*(pret_a-pret_b);
            }
            else{
                var dotari_a = a.getElementsByClassName("val-dotari")[0].innerHTML;
                var dotari_b = b.getElementsByClassName("val-dotari")[0].innerHTML;
                return semn * (dotari_a.split(",").length - dotari_b.split(",").length);
            }
        });
        for(let art of v_articole){
            art.parentNode.appendChild(art);
        }
    }

    var btn2=document.getElementById("sortCrescNume");
    btn2.onclick=function(){
        
        sorteaza(1)
    }

    var btn3=document.getElementById("sortDescrescNume");
    btn3.onclick=function(){
        sorteaza(-1)
    }


    document.getElementById("resetare").onclick=function(){
        //resetare inputuri
        document.getElementById("i_rad4").checked=true;
        document.getElementById("inp-pret").value=document.getElementById("inp-pret").min;
        document.getElementById("infoRange").innerHTML="("+document.getElementById("inp-pret").min+")";

        //de completat...


        //resetare articole
        var articole=document.getElementsByClassName("produs");
        for(let art of articole){

            art.style.display="grid";
        }
    }
 }


 window.onkeydown=function(e){
    console.log(e);
    if(e.key=="c" && e.altKey==true){
        var suma=0;
        var articole=document.getElementsByClassName("produs");
        for(let art of articole){
            if(art.style.display!="none")
                suma+=parseFloat(art.getElementsByClassName("val-pret")[0].innerHTML);
        }

        var spanSuma;
        spanSuma=document.getElementById("numar-suma");
        if(!spanSuma){
            spanSuma=document.createElement("span");
            spanSuma.innerHTML=" Suma:"+suma;//<span> Suma:...
            spanSuma.id="numar-suma";//<span id="..."
            document.getElementById("p-suma").appendChild(spanSuma);
            setTimeout(function(){document.getElementById("numar-suma").remove()}, 1500);
        }
    }
 }

