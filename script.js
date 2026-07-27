/* ===========================================
   APPLE MUSIC SCRIPT.JS - PART 1
   =========================================== */

// =========================
// CHANGE THIS TO YOUR PIN
// =========================
const PASSCODE = "0000";

// =========================
// ELEMENTS
// =========================
const pinInput = document.getElementById("pin");
const dots = document.querySelectorAll(".dot");
const lockscreen = document.getElementById("lockscreen");
const page = document.getElementById("page");
const wrong = document.getElementById("wrong");
const lockBox = document.querySelector(".lockBox");

// =========================
// FOCUS INPUT
// =========================
window.addEventListener("load", () => {
    pinInput.focus();
});

document.addEventListener("click", () => {
    pinInput.focus();
});

// =========================
// UPDATE DOTS
// =========================
function updateDots() {

    dots.forEach(dot => {
        dot.classList.remove("active");
    });

    for (let i = 0; i < pinInput.value.length; i++) {
        dots[i].classList.add("active");
    }

}

// =========================
// SHAKE ERROR
// =========================
function wrongPin() {

    lockBox.classList.add("shake");

    wrong.style.opacity = "1";

    setTimeout(() => {

        lockBox.classList.remove("shake");

        wrong.style.opacity = "0";

        pinInput.value = "";

        updateDots();

    }, 700);

}

// =========================
// UNLOCK
// =========================
function unlock() {

    lockscreen.classList.add("fadeOut");

    setTimeout(() => {

        lockscreen.style.display = "none";

        page.classList.add("fadeIn");

        animateSongs();

    }, 500);

}

// =========================
// CHECK PIN
// =========================
pinInput.addEventListener("input", () => {

    pinInput.value = pinInput.value.replace(/\D/g, "");

    updateDots();

    if (pinInput.value.length === 4) {

        if (pinInput.value === PASSCODE) {

            unlock();

        } else {

            wrongPin();

        }

    }

});

// =========================
// KEEP INPUT FOCUSED
// =========================
setInterval(() => {

    if (document.activeElement !== pinInput) {

        pinInput.focus();

    }

}, 500);

// =========================
// SONG ANIMATION
// =========================
function animateSongs() {

    const songs = document.querySelectorAll(".song");

    songs.forEach((song, index) => {

        setTimeout(() => {

            song.classList.add("show");

        }, index * 120);

    });

}

// =========================
// ONLY ONE AUDIO PLAYS
// =========================
/* ===========================================
   APPLE MUSIC PLAYER
=========================================== */

const songs = [...document.querySelectorAll(".song")];

const audio = document.getElementById("audio");

const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

const progress = document.getElementById("progress");

const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");

const currentSong = document.getElementById("currentSong");

const vinyl = document.getElementById("vinyl");
const miniVinyl = document.getElementById("miniVinyl");

let currentIndex = -1;



// -----------------------
// LOAD SONG
// -----------------------

function loadSong(index){

    currentIndex = index;

    const song = songs[index];

    audio.src = song.dataset.src;

    currentSong.textContent =
        song.querySelector("h3").textContent;

    songs.forEach(s=>s.classList.remove("active"));

    song.classList.add("active");

}



// -----------------------
// PLAY
// -----------------------

function playSong(){

    audio.play();

    playBtn.textContent = "❚❚";

    vinyl.classList.add("spinning");

    miniVinyl.classList.add("rotate");

}



// -----------------------
// PAUSE
// -----------------------

function pauseSong(){

    audio.pause();

    playBtn.textContent = "▶";

    vinyl.classList.remove("spinning");

    miniVinyl.classList.remove("rotate");

}



// -----------------------
// CLICK SONG
// -----------------------

songs.forEach((song,index)=>{

    song.onclick=()=>{

        loadSong(index);

        playSong();

    }

});



// -----------------------
// PLAY BUTTON
// -----------------------

playBtn.onclick=()=>{

    if(currentIndex===-1){

        loadSong(0);

    }

    if(audio.paused){

        playSong();

    }else{

        pauseSong();

    }

}



// -----------------------
// NEXT
// -----------------------

nextBtn.onclick=()=>{

    currentIndex++;

    if(currentIndex>=songs.length){

        currentIndex=0;

    }

    loadSong(currentIndex);

    playSong();

}



// -----------------------
// PREVIOUS
// -----------------------

prevBtn.onclick=()=>{

    currentIndex--;

    if(currentIndex<0){

        currentIndex=songs.length-1;

    }

    loadSong(currentIndex);

    playSong();

}



// -----------------------
// PROGRESS
// -----------------------

audio.addEventListener("timeupdate",()=>{

    if(audio.duration){

        progress.value=
        audio.currentTime/audio.duration*100;

        currentTime.textContent=format(audio.currentTime);

        duration.textContent=format(audio.duration);

    }

});



progress.oninput=()=>{

    if(audio.duration){

        audio.currentTime=
        progress.value/100*audio.duration;

    }

}



// -----------------------
// FORMAT TIME
// -----------------------

function format(sec){

    const m=Math.floor(sec/60);

    const s=Math.floor(sec%60);

    return `${m}:${s.toString().padStart(2,"0")}`;

}



// -----------------------
// SONG ENDED
// -----------------------

audio.onended=()=>{

    nextBtn.click();

}



// -----------------------
// SPACEBAR
// -----------------------

window.addEventListener("keydown",(e)=>{

    if(e.code==="Space"){

        e.preventDefault();

        playBtn.click();

    }

});



// -----------------------
// LEFT / RIGHT
// -----------------------

window.addEventListener("keydown",(e)=>{

    if(e.key==="ArrowRight"){

        nextBtn.click();

    }

    if(e.key==="ArrowLeft"){

        prevBtn.click();

    }

});
