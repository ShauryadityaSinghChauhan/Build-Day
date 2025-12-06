const add = document.getElementById("add");
const sec = document.getElementById("sec");
const list = document.getElementById("list");
const sound = document.getElementById("beep");

let timers = [];

if (Notification.permission === "default") {
    Notification.requestPermission();
}

load();
show();

add.onclick = () => {
    let n = parseInt(sec.value);
    if (!n || n <= 0) return;

    let id = Date.now();
    timers.push({
        id: id,
        time: n,
        run: false
    });

    save();
    show();
};

function show() {
    list.innerHTML = "";

    timers.forEach(t => {
        let box = document.createElement("div");
        box.id = "t" + t.id;

        box.innerHTML = `
            <div>${t.time}s</div>
            <button class="start">Start</button>
            <button class="stop">Stop</button>
            <button class="del">Delete</button>
            <br><br>
        `;

        list.appendChild(box);

        box.querySelector(".start").onclick = () => start(t);
        box.querySelector(".stop").onclick = () => stop(t);
        box.querySelector(".del").onclick = () => remove(t.id);
    });
}

function start(t) {
    if (t.run) return;
    t.run = true;

    t.int = setInterval(() => {
        t.time--;
        update(t.id);

        if (t.time <= 0) {
            clearInterval(t.int);
            t.time = 0;
            t.run = false;
            update(t.id);
            sound.play();
            alert("Time Finished")
            if (Notification.permission === "granted") {
                new Notification("Timer finished!");
            }

            save();
        }
    }, 1000);

    save();
}

function stop(t) {
    if (t.run) {
        clearInterval(t.int);
        t.run = false;
        save();
    }
}

function remove(id) {
    timers = timers.filter(x => x.id !== id);
    save();
    show();
}

function update(id) {
    let t = timers.find(x => x.id === id);
    let box = document.getElementById("t" + id);
    if (box) box.querySelector("div").textContent = t.time + "s";
}

function save() {
    let data = timers.map(t => ({
        id: t.id,
        time: t.time,
        run: false
    }));

    localStorage.setItem("simpleTimers", JSON.stringify(data));
}

function load() {
    let a = localStorage.getItem("simpleTimers");
    if (a) timers = JSON.parse(a);
}
