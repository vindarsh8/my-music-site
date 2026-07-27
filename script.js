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
const players = document.querySelectorAll("audio");
const vinyl = document.getElementById("vinyl");
players.forEach(player => {

    player.addEventListener("play", () => {

        players.forEach(other => {

            if (other !== player) {

                other.pause();

            }

        });

    });

});

// =========================
// ESC TO RELOCK
// =========================
window.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {

        location.reload();

    }

});
