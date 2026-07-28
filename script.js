const players = document.querySelectorAll("audio");

players.forEach(player=>{
    player.addEventListener("play",()=>{
        players.forEach(other=>{
            if(other!==player){
                other.pause();
            }
        });
    });
});


function unlock(){

    const pin=document.getElementById("pin").value;

    if(pin==="0000"){

        document.getElementById("lockscreen").style.display="none";
        document.getElementById("site").style.display="flex";

    }else{

        document.getElementById("error").textContent="Incorrect access code.";
        document.getElementById("pin").value="";

    }

}


document.getElementById("pin").addEventListener("keydown",function(e){

    if(e.key==="Enter"){
        unlock();
    }

});
