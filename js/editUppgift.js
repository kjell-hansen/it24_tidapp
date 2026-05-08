let aktiviteter = []
window.onload = () => {
    let queryString = window.location.search
    let parameters = new URLSearchParams(queryString)

    getActivities()
        .finally(() => {
            if (parameters.has('id')) {
                fillForm(parameters.get('id'))
            } else {
                emptyForm()
            }
        })

    // Händelselyssnare för sparaknappen
    document.getElementById('spara').addEventListener("click", sparaUppgift)

    // Sätta maxdatum för datumkontrollen
    document.getElementById("inputDatum").max = (new Date()).toISOString().substring(0,10)
}

async function getActivities() {
    try {
        let response = await fetch("dummy/aktiviteter.json")
        if (response.ok) {
            let data = await response.json()
            aktiviteter = data.activities
            fillDropdown(aktiviteter)
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

function fillDropdown(aktiviteter) {
    let dropdown = document.getElementById("inputAktivitet")
    // Töm dropdown
    dropdown.innerHTML=''

    // Fyll med data
    for(let i=0;i<aktiviteter.length;i++) {
        let option = document.createElement("option")
        option.value=aktiviteter[i].id
        option.text=aktiviteter[i].activity
        dropdown.append(option)
    }
}

async function fillForm(id) {
    // Hämta uppgifter, just nu alla och välj rätt sedan hämta rätt.
    try {
        let response = await fetch("dummy/uppgifter.json")
        if (response.ok) {
            let data = await response.json()
            // Hitta rätt post
            let post = data.tasks.find(uppg => uppg.id == id)
            if (!post) {
                alert("Uppgiften hittades inte")
                emptyForm()
                return
            }
            document.getElementById('labelId').style.display = "initial"
            document.getElementById('valueId').innerText = post.id
            document.getElementById('inputDatum').value = post.date
            document.getElementById('inputVaraktighet').value = post.time
            document.getElementById('inputBeskrivning').value = post.description
            // Aktivitet är en dropdown!
            document.getElementById('inputAktivitet').value = post.activityId
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

function emptyForm() {
    // Dölj ID-fältet
    document.getElementById('labelId').style.display = "none"

    // Töm alla inputs
    document.getElementById('inputDatum').value = (new Date).toISOString().substring(0, 10)
    document.getElementById('inputVaraktighet').value = '01:00'
    document.getElementById('inputBeskrivning').value = ''
    // Aktivitet är en dropdown!
    document.getElementById('inputAktivitet').value = -1
}

function sparaUppgift() {
    if(!valideraFormular()) {
        alert ("Fixa uppgifterna")
        return
    }

    alert ('Hurra, sparar detta direkt')
}

function valideraFormular() {
    let valid=true

    // Inte i framtiden
    if(document.getElementById('inputDatum').value>(new Date()).toISOString().substring(0,10)) {
        valid=false
    }

    // Max 8h
    if(document.getElementById('inputVaraktighet').value>"08:00") {
        valid=false
    }

    // Min 15 min
    if(document.getElementById('inputVaraktighet').value<"00:15") {
        valid=false
    }

    // Rapportering med 15-minuters intervall
    if(!["00", "15", "30", "45"].includes(document.getElementById('inputVaraktighet').value.substring(3,5))) {
        valid=false
    }

    // Aktivitet ska finnas
    if(document.getElementById('inputAktivitet').selectedIndex < 0) {
        valid = false
    }

    return valid;
}