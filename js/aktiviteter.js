window.onload = () => {
    // Rensa listan
    rensaLista()

    // Sätt standardvärden för perioden
//    setDateInterval()

    // Hämta från API:et
    getActivities()

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

async function getActivities() {
    try {
        let response = await fetch("api/activity")
        if (response.ok) {
            let data = await response.json()
            fyllLista(data)
        } else {
            let message = null
            try {
                message = await response.json()
            } finally {
                let fel = {
                    status: response.status,
                    text: response.statusText,
                    url: response.url,
                    message
                }

                throw fel
            }
        }
    } catch (error) {
        console.error(error)
    }
}

function fyllLista(data) {
    let target = document.getElementById("tom")

    // Loopa igenom all data
    for (let i = 0; i < data.activities.length; i++) {
        let rad = document.createElement("ul")
        rad.className = "lista"
        let content = `<li>${data.activities[i].activity}</li>`
        content += `<li class="right"><a href="editAktivitet.html?id=${data.activities[i].id}"><img class="edit" src="images/edit.png"></a>`
        content += `<img class="delete" onclick="alertDelete(${data.activities[i].id})" src="images/delete.png"></li>`
        rad.innerHTML = content
        target.appendChild(rad)
    }
}

function alertDelete(id) {
    if (confirm('Vill du radera posten med id=' + id + '?')) {
        let formData = new FormData()
        formData.append("action", 'delete')
        fetch(`api/activity/${id}`, {
            method: "POST",
            body: formData,
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
                    alert(data.message.join('\r\n'))
                }
            })
            .catch(async (error) => {
                let meddelande = (await error).error
                alert(meddelande.join('\r\n'))
            })
    }
}