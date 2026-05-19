window.onload = () => {
    // Skapa händelselyssnare för knapparna
    document.getElementById('hamtaDatum').addEventListener("click", hamtaDatum)
    document.getElementById('hamtaSida').addEventListener("click", hamtaSida)

    // Rensa listan
    rensaLista()

    // Sätt standardvärden för perioden
    setDateInterval()

    // Hämta från API:et
    hamtaDatum()

}

function rensaLista() {
    let lista = document.getElementById("tom");
    lista.innerHTML = "";
}

function setDateInterval() {
    let idag = new Date();
    let aktuellManad = idag.getMonth();

    let fromDatum = new Date(idag.getFullYear(), aktuellManad, 1, 24);
    let toDatum = new Date(idag.getFullYear(), aktuellManad + 1, 0, 24);

    document.getElementById("franDatum").value = fromDatum.toISOString().substring(0, 10);
    document.getElementById("tillDatum").value = toDatum.toISOString().substring(0, 10);

}

function hamtaDatum() {
    // Hämtar poster baserat på datum
    let franDatum = document.getElementById("franDatum").value;
    let tillDatum = document.getElementById("tillDatum").value;
    fetch(`api/tasklist/${franDatum}/${tillDatum}`)
        .then(response => {
            if (response.ok) {
                return response.json()
            }

            // response är inte ok...
            return response.json()
                .catch(() => null) // Är svaret inte json händer inget
                .then(message => {
                    let fel = {
                        status: response.status,
                        text: response.statusText,
                        url: response.url,
                        message
                    }

                    throw fel
                })
        })
        .then(data => {
            fyllLista(data)
        })
        .catch(error => {
            console.error(error)
        })
}

function hamtaSida() {
    // Hämtar poster baserat på sidnummer
    let sidnr = document.getElementById("sidnr").value;
    fetch(`api/tasklist/${sidnr}`)
        .then(response => {
            if (response.ok) {
                return response.json()
            }

            // response är inte ok...
            return response.json()
                .catch(() => null) // Är svaret inte json händer inget
                .then(message => {
                    let fel = {
                        status: response.status,
                        text: response.statusText,
                        url: response.url,
                        message
                    }

                    throw fel
                })
        })
        .then(data => {
            fyllLista(data)
            // Fyll dropdown-listan för sidnummer med tillgängliga sidnummer
            let select = document.getElementById("sidnr");
            select.innerHTML = '';
            for (let i = 0; i < data.pages; i++) {
                let opt = document.createElement("option");
                opt.text = `${i + 1}`
                select.appendChild(opt)
            }
            // Välj aktuellt sidnummer
            select.value = sidnr;
        })
        .catch(error => {
            console.error(error)
        })
}

function fyllLista(data) {
    // Rensa listan
    rensaLista()

    let target = document.getElementById("tom")
    // Loopa igenom all data
    for (let i = 0; i < data.tasks.length; i++) {
        let rad = document.createElement("ul")
        rad.className = "lista"
        let content = `<li>${data.tasks[i].date}</li>`
        content += `<li class="right">${data.tasks[i].time}</li>`
        content += `<li>${data.tasks[i].activity}</li>`
        content += `<li>${data.tasks[i].description ?? ''}</li>`
        content += `<li class="right"><a href="editUppgift.html?id=${data.tasks[i].id}"><img class="edit" src="images/edit.png"></a>`
        content += `<img class="delete" onclick="alertDelete(${data.tasks[i].id})" src="images/delete.png"></li>`
        rad.innerHTML = content
        target.appendChild(rad)
    }
}

function alertDelete(id) {
    if (confirm('Vill du radera posten med id=' + id + '?')) {
        let form = new FormData()
        form.append("action", 'delete')
        fetch(`api/task/${id}`, {
            method: "POST",
            body: form
        })
            .then(response => {
                if (response.ok) {
                    return response.json()
                } else {
                    throw response.json()
                }
            })
            .then(data => {
                if (data.result) {
                    alert('Radera lyckades')
                    window.location.reload();
                } else {
                    alert("Radera misslyckades, kontrollera konsolen")
                    console.log(data)
                }
            })
            .catch(error => {
                alert("Något gick fel vid radering, kontrollera konsolen")
                console.error(error);
            })
    }
}

function aktiveraAlternativ(ev) {
    try {
        if (ev.target.value === 'sida') {
            // Aktivera rätt kontroller
            document.getElementById('sidnr').disabled = false;
            document.getElementById('hamtaSida').disabled = false;
            hamtaSida()
            // Avaktivera övriga kontroller
            document.getElementById('franDatum').disabled = true;
            document.getElementById('tillDatum').disabled = true;
            document.getElementById('hamtaDatum').disabled = true;
        } else {
            // Aktivera rätt kontroller
            document.getElementById('franDatum').disabled = false;
            document.getElementById('tillDatum').disabled = false;
            document.getElementById('hamtaDatum').disabled = false;
            hamtaDatum()
            // Avaktivera övriga kontroller
            document.getElementById('sidnr').disabled = true;
            document.getElementById('hamtaSida').disabled = true;
        }
    } catch (error) {
        console.error(error)
        // Aktivera standard kontroller
        document.getElementById('franDatum').disabled = false;
        document.getElementById('tillDatum').disabled = false;
        document.getElementById('hamtaDatum').disabled = false;
        hamtaDatum()
        // Avaktivera övriga kontroller
        document.getElementById('sidnr').disabled = true;
        document.getElementById('hamtaSida').disabled = true;
    }
}