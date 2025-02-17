let converter = new showdown.Converter();

function dayNumbToDay(n) {
    return ["su", "m", "t", "w", "th", "f", "s"][Number(n)];
}

if (localStorage.getItem("api-key") == null || localStorage.getItem("user-id") == null) {
    document.body.innerHTML = "<form id=\"token\">please input your <a href=\"https://habitica.com/user/settings/siteData\" target=\"_blank\">api key</a>: <input type=\"password\" id=\"apikey\"> and <a href=\"https://habitica.com/user/settings/siteData\" target=\"_blank\">user id</a>: <input id=\"userid\" type=\"text\"><input type=\"submit\" value=\"Login\" /></form>";
    document.getElementById("token").addEventListener("submit", function (e) {
        e.preventDefault();
        localStorage.setItem("api-key", document.getElementById("apikey").value);
        localStorage.setItem("user-id", document.getElementById("userid").value);
        location.reload();
    });
} else {
    document.body.innerHTML = `<input style="margin-bottom: 5vh" type="date" id="date" />`;

    let page = (async (noreq = false, noreqresp = "") => {
        let n = 0;
        let g = false;
        let origdate = "";
        let date = -1;
        let change = async function () {
            if (date == -1) {
                date = 1 * new Date(document.getElementById("date").value);
                origdate = document.getElementById("date").value;
            }
            if (!g) document.body.innerHTML = `loading${".".repeat(n++ % 3)}`;
            await new Promise((resolve) => setTimeout(resolve, 100));
            return await change();
        };
        document.getElementById("date").addEventListener("change", change);

        let origresp;
        if (!noreq) {
            let a = await fetch("https://habitica.com/api/v3/tasks/user?type=dailys&dueDate", {
                mode: "cors",
                headers: {
                    "x-api-user": localStorage.getItem("user-id"),
                    "x-api-key": localStorage.getItem("api-key"),
                    "x-client": "e2979104-ff68-4050-9c52-a7c109ba9fe5 - Foresight"
                }
            });
            origresp = (await a.json()).data;
        } else {
            origresp = noreqresp;
        }

        window.data = structuredClone(origresp);
        window.data = data.filter((task) => task.type == "daily");
        window.data = data.map((task) => {
            let isDueOn = (date) => {
                date = 1 * date;

                startDate = 1 * new Date(new Date(task.startDate) * 1 - 1 * ((new Date(task.startDate)).getTimezoneOffset() * 60 * 1000));

                switch (task.frequency) {
                    case "daily":
                        return (date >= new Date(startDate) && (date - new Date(startDate)) % (task.everyX * 24 * 60 * 60 * 1000) == 0);
                    case "weekly":
                        {
                            let sW = new Date(startDate);
                            sW.setDate(sW.getDate() - sW.getDay());
                            let dW = new Date(date);
                            dW.setDate(dW.getDate() - dW.getDay());

                            if (Math.abs((sW - dW - ((new Date(sW)).getTimezoneOffset() * 60 * 1000 - (new Date(dW)).getTimezoneOffset() * 60 * 1000)) % (task.everyX * 7 * 24 * 60 * 60 * 1000)) < (1000 * 60 * 60 * 4) || Math.abs((sW - dW - ((new Date(dW)).getTimezoneOffset() * 60 * 1000 - (new Date(sW)).getTimezoneOffset() * 60 * 1000)) % (task.everyX * 7 * 24 * 60 * 60 * 1000)) < (1000 * 60 * 60 * 4) || Math.abs((sW - dW) % (task.everyX * 7 * 24 * 60 * 60 * 1000)) < (1000 * 60 * 60 * 4)) return Object.assign({ su: true, m: true, t: true, w: true, th: true, f: true, s: true }, task.repeat)[dayNumbToDay((new Date(date)).getDay())] && date >= startDate;

                            return false;
                        }
                    case "monthly": {
                        if (task.daysOfMonth.length > 0) {
                            for (let i of task.daysOfMonth) {
                                if ((new Date(date)).getUTCMonth() != (new Date(date + 24 * 60 * 60 * 1000)).getUTCMonth()) {
                                    if (i >= (new Date(date)).getUTCDate()) return date >= startDate && ((new Date(date).getUTCFullYear() * 12 + new Date(date).getUTCMonth()) - (new Date(startDate).getUTCFullYear() * 12 + new Date(startDate).getUTCMonth())) % task.everyX === 0;
                                } else {
                                    if (i == (new Date(date)).getUTCDate()) return date >= startDate && ((new Date(date).getUTCFullYear() * 12 + new Date(date).getUTCMonth()) - (new Date(startDate).getUTCFullYear() * 12 + new Date(startDate).getUTCMonth())) % task.everyX === 0;
                                }
                            }
                        }

                        if (task.weeksOfMonth.length > 0) {
                            for (let i of task.weeksOfMonth) {
                                if ((new Date(date)).getUTCMonth() != (new Date(date + 24 * 60 * 60 * 1000)).getUTCMonth()) {
                                    if (i >= (Math.ceil((new Date(date)).getUTCDate() / 7)) - 1) return Object.assign({ su: true, m: true, t: true, w: true, th: true, f: true, s: true }, task.repeat)[dayNumbToDay((new Date(date)).getDay())] && date >= startDate && ((new Date(date).getUTCFullYear() * 12 + new Date(date).getUTCMonth()) - (new Date(startDate).getUTCFullYear() * 12 + new Date(startDate).getUTCMonth())) % task.everyX === 0;
                                } else {
                                    if (i == (Math.ceil((new Date(date)).getUTCDate() / 7) - 1)) return Object.assign({ su: true, m: true, t: true, w: true, th: true, f: true, s: true }, task.repeat)[dayNumbToDay((new Date(date)).getDay())] && date >= startDate && ((new Date(date).getUTCFullYear() * 12 + new Date(date).getUTCMonth()) - (new Date(startDate).getUTCFullYear() * 12 + new Date(startDate).getUTCMonth())) % task.everyX === 0;
                                }
                            }
                        }

                        return false;
                    }
                    case "yearly":
                        if ((new Date(date)).getUTCMonth() == (new Date(startDate)).getUTCMonth() && (new Date(date)).getUTCDate() == (new Date(startDate)).getUTCDate() && ((new Date(date)).getUTCFullYear() - (new Date(startDate)).getUTCFullYear()) % task.everyX == 0) {
                            return date >= startDate;
                        }

                        return false;
                    default:
                        return false;
                }
            };

            return {
                text: task.text,
                notes: task.notes,
                isDueOn: isDueOn,
                original_task: task
            };
        });

        g = true;
        change = async function () {
            let ldata = window.data;
            let data = ldata;

            data = data.sort((task1, task2) => {
                if (task1.isDueOn(date) && !task2.isDueOn(date)) return -1;
                if (!task1.isDueOn(date) && task2.isDueOn(date)) return 1;
                return 0;
            });

            data = data.map((task) => {
                let n = 1;
                let nextDue = date + 24 * 60 * 60 * 1000;
                while (!task.isDueOn(nextDue)) {
                    nextDue += 24 * 60 * 60 * 1000;
                    n++;

                    if (n > 3650) {
                        console.error("more thans 10 years in the future, breaking");
                        nextDue = 2000000001337; // Wed May 18 2033 03:33:21.337 (UTC)
                        break;
                    }
                }

                return Object.assign(task, { nextDue: nextDue });
            });

            data = [...data.filter((task) => task.isDueOn(date)), ...data.filter((task) => !task.isDueOn(date)).sort((task1, task2) => task1.nextDue - task2.nextDue)];

            document.body.innerHTML = "";

            document.body.innerHTML += `<div style="margin-top: 1.5vh; display: flex; justify-content: center;"><input type="date" id="date" value="${origdate}" /></div>`;

            document.getElementById("style").innerHTML = `*:visited { text-decoration: none; color: rgb(0, 0, 238); }\n* { margin: 0; font-family: sans-serif; }`;
            document.getElementById("style").innerHTML += 'table {\n  margin-top: 1.5vh; margin-bottom: 5vh; margin-left: auto; margin-right: auto;    border-collapse: collapse;\n    border: 2px solid rgb(200, 200, 200);\n    letter-spacing: 1px;\n    font-size: 0.8rem;\n    /* width: 100%; */\n}\n\ntd,\nth {\n    border: 1px solid rgb(190, 190, 190);\n    padding: 10px 20px;\n}\n\nth {\n    background-color: rgb(235, 235, 235);\n}\n\ntd {\n    text-align: center;\n}\n\ntr:nth-child(even) td {\n    background-color: rgb(250, 250, 250);\n}\n\ntr:nth-child(odd) td {\n    background-color: rgb(245, 245, 245);\n}\n\ncaption {\n    padding: 10px;\n}\n\n';
            document.getElementById("style").innerHTML += `.dag {
  display: inline-block;
  min-width: 70px;
  text-align: center;
}
  
.dagn {
  display: inline-block;
  min-width: 35px;
  text-align: center;
}
  
.maand {
  display: inline-block;
  min-width: 70px;
  text-align: center;
}

.jaar {
  display: inline-block;
  min-width: 35px;
  text-align: center;
}`;

            let tasks = document.createElement("table");

            ["Task", "Next due"].forEach((text) => {
                let th = document.createElement("th");
                th.innerHTML = text;
                tasks.appendChild(th);
            });
            data.forEach((task) => {
                let tr = document.createElement("tr");
                let td = document.createElement("td");
                td.innerHTML = `<span style="font-size: larger; text-align: left;">${converter.makeHtml(task.text)}</span><span style="font-size: smaller; text-align: left">${converter.makeHtml(task.notes)}</span>`;
                if (task.isDueOn(date)) {
                    td.style.backgroundColor = "rgb(230, 255, 230)";
                }
                tr.appendChild(td);

                let td2 = document.createElement("td");
                let gg = new Date(new Date(task.nextDue) * 1 + 1 * ((new Date(task.nextDue)).getTimezoneOffset() * 60 * 1000));
                if (task.nextDue == 2000000001337) td2.innerHTML = "-"; // too far in the future (>10 years), if due date is this made up date, display "-"
                else if (localStorage.getItem("user-id") != "e2979104-ff68-4050-9c52-a7c109ba9fe5") {
                    td2.innerHTML = new Date(new Date(task.nextDue) * 1 + 1 * ((new Date(task.nextDue)).getTimezoneOffset() * 60 * 1000)).toLocaleDateString();
                } else {
                    td2.innerHTML += `<span class="dag">${["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"][gg.getDay()]}</span>`;
                    td2.innerHTML += " ";
                    td2.innerHTML += `<span class="dagn">${gg.getDate()}</span>`;
                    td2.innerHTML += " ";
                    td2.innerHTML += `<span class="maand">${["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"][gg.getMonth()]}</span>`;
                    td2.innerHTML += " ";
                    td2.innerHTML += `<span class="jaar">${gg.getFullYear()}</span>`;
                }

                if (task.isDueOn(date)) {
                    td2.style.backgroundColor = "rgb(230, 255, 230)";
                }
                tr.appendChild(td2);

                tasks.appendChild(tr);
            });
            document.body.appendChild(tasks);

            page(true, origresp);

            return 0;
        };
    });

    page();
}