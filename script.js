/* ===============================
   CONFIG
================================ */

// Change this to whatever 4-digit code you want
const PASSCODE = "1234";

/* ===============================
   ELEMENT REFERENCES
================================ */

const lockscreen   = document.getElementById("lockscreen");
const app          = document.getElementById("app");
const pinInput     = document.getElementById("pin");
const dots         = document.querySelectorAll(".dot");
const errorMsg     = document.getElementById("error");

const vinyl        = document.getElementById("vinyl");
const miniVinyl    = document.getElementById("miniVinyl");

const songEls      = document.querySelectorAll(".song");
const audio        = document.getElementById("audio");

const currentTitle = document.getElementById("currentTitle");
const playBtn      = document.getElementById("play");
const playIcon     = document.getElementById("playIcon");
const prevBtn      = document.getElementById("prev");
const nextBtn      = document.getElementById("next");

const progress     = document.getElementById("progress");
const currentTime  = document.getElementById("currentTime");
const duration     = document.getElementById("duration");

/* ===============================
   ICON PATHS (play <-> pause)
================================ */

const PLAY_PATH  = "M8 5v14l11-7z";
const PAUSE_PATH = "M6 5h4v14H6zm8 0h4v14h-4z";

/* ===============================
   STATE
================================ */

let songs = Array.from(songEls).map(el => ({
	el,
	title: el.dataset.title,
	src: el.dataset.src
}));

let currentIndex = -1;
let isPlaying = false;

/* ===============================
   LOCK SCREEN LOGIC
================================ */

let enteredPin = "";

function updateDots(){
	dots.forEach((dot, i) => {
		dot.classList.toggle("active", i < enteredPin.length);
	});
}

function showError(){
	errorMsg.style.opacity = "1";
	lockscreen.style.transform = "translateX(0)";

	// simple shake
	lockscreen.animate(
		[
			{ transform: "translateX(0)" },
			{ transform: "translateX(-10px)" },
			{ transform: "translateX(10px)" },
			{ transform: "translateX(-6px)" },
			{ transform: "translateX(6px)" },
			{ transform: "translateX(0)" }
		],
		{ duration: 350 }
	);

	setTimeout(() => {
		enteredPin = "";
		updateDots();
		errorMsg.style.opacity = "0";
	}, 500);
}

function unlockApp(){
	lockscreen.style.opacity = "0";
	setTimeout(() => {
		lockscreen.style.display = "none";
	}, 450);

	app.style.opacity = "1";
}

function handlePinInput(value){
	enteredPin = value.slice(0, 4);
	updateDots();

	if(enteredPin.length === 4){
		if(enteredPin === PASSCODE){
			unlockApp();
		} else {
			showError();
		}
	}
}

pinInput.addEventListener("input", () => {
	// only allow digits
	const digits = pinInput.value.replace(/\D/g, "");
	pinInput.value = digits;
	handlePinInput(digits);
});

// Focus hidden input whenever the lockscreen is clicked/tapped
lockscreen.addEventListener("click", () => {
	pinInput.focus();
});

// Auto-focus on load
window.addEventListener("load", () => {
	pinInput.focus();
});

// Keep focus on the pin input if it's lost while locked
document.addEventListener("click", () => {
	if(lockscreen.style.display !== "none"){
		pinInput.focus();
	}
});

/* ===============================
   TIME FORMATTING
================================ */

function formatTime(seconds){
	if(isNaN(seconds) || seconds === Infinity) return "0:00";

	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);

	return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/* ===============================
   VINYL SPIN CONTROL
================================ */

function setSpinning(spin){
	vinyl.style.animationPlayState = spin ? "running" : "paused";
	miniVinyl.querySelector(".miniCentre");

	if(spin){
		vinyl.classList.add("spinning");
		miniVinyl.classList.add("rotate");
	} else {
		vinyl.style.animationPlayState = "paused";
	}

	// pause/resume rather than remove, so rotation position is kept
	vinyl.style.animationPlayState = spin ? "running" : "paused";
	miniVinyl.style.animationPlayState = spin ? "running" : "paused";
}

/* ===============================
   PLAY / PAUSE ICON
================================ */

function setPlayIcon(playing){
	playIcon.setAttribute("d", playing ? PAUSE_PATH : PLAY_PATH);
	playBtn.setAttribute("aria-label", playing ? "Pause" : "Play");
}

/* ===============================
   LOAD & PLAY A SONG
================================ */

function loadSong(index, autoplay = true){
	if(index < 0 || index >= songs.length) return;

	currentIndex = index;
	const song = songs[currentIndex];

	audio.src = song.src;
	currentTitle.textContent = song.title;

	songEls.forEach(el => el.classList.remove("active"));
	song.el.classList.add("active");

	progress.value = 0;
	currentTime.textContent = "0:00";
	duration.textContent = "0:00";

	if(autoplay){
		playAudio();
	}
}

function playAudio(){
	audio.play().then(() => {
		isPlaying = true;
		setPlayIcon(true);
		setSpinning(true);
	}).catch(() => {
		// autoplay might be blocked, ignore
	});
}

function pauseAudio(){
	audio.pause();
	isPlaying = false;
	setPlayIcon(false);
	setSpinning(false);
}

function togglePlay(){
	if(currentIndex === -1){
		loadSong(0);
		return;
	}

	if(isPlaying){
		pauseAudio();
	} else {
		playAudio();
	}
}

function playNext(){
	if(songs.length === 0) return;
	const nextIndex = (currentIndex + 1) % songs.length;
	loadSong(nextIndex);
}

function playPrev(){
	if(songs.length === 0) return;
	const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
	loadSong(prevIndex);
}

/* ===============================
   EVENT: SONG LIST CLICK
================================ */

songEls.forEach((el, index) => {
	el.addEventListener("click", () => {
		loadSong(index);
	});
});

/* ===============================
   EVENT: CONTROLS
================================ */

playBtn.addEventListener("click", togglePlay);
nextBtn.addEventListener("click", playNext);
prevBtn.addEventListener("click", playPrev);

/* ===============================
   EVENT: AUDIO TIME UPDATES
================================ */

audio.addEventListener("loadedmetadata", () => {
	duration.textContent = formatTime(audio.duration);
	progress.max = 100;
});

audio.addEventListener("timeupdate", () => {
	if(audio.duration){
		const percent = (audio.currentTime / audio.duration) * 100;
		progress.value = percent;
	}
	currentTime.textContent = formatTime(audio.currentTime);
});

audio.addEventListener("ended", () => {
	playNext();
});

/* ===============================
   EVENT: PROGRESS BAR SEEK
================================ */

progress.addEventListener("input", () => {
	if(audio.duration){
		audio.currentTime = (progress.value / 100) * audio.duration;
	}
});

/* ===============================
   KEYBOARD SHORTCUTS
================================ */

document.addEventListener("keydown", (e) => {
	// while locked, let numeric keys type into the pin
	if(lockscreen.style.display !== "none"){
		if(/^[0-9]$/.test(e.key)){
			pinInput.value += e.key;
			pinInput.dispatchEvent(new Event("input"));
		} else if(e.key === "Backspace"){
			pinInput.value = pinInput.value.slice(0, -1);
			pinInput.dispatchEvent(new Event("input"));
		}
		return;
	}

	switch(e.key){
		case " ":
			e.preventDefault();
			togglePlay();
			break;
		case "ArrowRight":
			playNext();
			break;
		case "ArrowLeft":
			playPrev();
			break;
		case "ArrowUp":
			e.preventDefault();
			audio.volume = Math.min(1, audio.volume + 0.1);
			break;
		case "ArrowDown":
			e.preventDefault();
			audio.volume = Math.max(0, audio.volume - 0.1);
			break;
	}
});
