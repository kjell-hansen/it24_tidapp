let allaAktiviteter = []
let aktivitetsId = null
window.onload = () => {
    let queryString = window.location.search
    let parameters = new URLSearchParams(queryString)

    if (parameters.has('id')) {
        fillForm(parameters.get('id'))
        aktivitetsId = parameters.get('id')
    } else {
        emptyForm()
    }

    // Hämta alla befintliga aktiviteter
    fetch('api/activity')
        .then(response => {
            if (response.ok) {
                return response.json()
            } else {
                throw response.json()
            }
        })
        .then(data => {
            allaAktiviteter = data.activities
        })
        .catch(error => {
            console.error(error)
        })

    // Händelselyssnare för sparaknappen
    document.getElementById('spara').addEventListener("click", sparaAktivitet)

}

function fillForm(id) {
    // Hämta data (just nu all data och sen hitta rätt, senare hämta bara rätt data)
    fetch(`api/activity/${id}`)
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
                    // Töm formuläret
                    emptyForm()

                    throw fel
                })
        })
        .then(data => {
            // Fyll formuläret och se till att ID syns
            document.getElementById('valueId').innerText = data.id
            document.getElementById('labelId').style.display = 'initial'
            document.getElementById('inputAktivitet').value = data.activity
        })
        .catch(error => {
            console.error(error)
        })
}

function emptyForm() {
    // Göm ID-fältet
    document.getElementById('labelId').style.display = 'none'
    // Töm inmatningsfältet och sätt fokus
    document.getElementById('inputAktivitet').value = ''
    document.getElementById('inputAktivitet').focus()
}

async function sparaAktivitet() {
    if (!verifieraForm()) {
        alert("Åtgärda felen")
        return
    }

    let formData = new FormData()
    formData.set('action', "save")
    formData.set('activity', document.getElementById('inputAktivitet').value.trim())
    let response = await fetch(`api/activity/${aktivitetsId ?? ''}`,
        {
            "method": "POST",
            body:formData
        })
    if (!response.ok) {
        alert('Kunde inte spara aktivitet, kontrollera konsolen')
        console.error(await response.json())
        return
    }

    let svar = await response.json();
    if (aktivitetsId) {
        alert('Uppdatera lyckades')
    } else {
        alert('Spara ny aktivitet lyckades')
        window.location.href = `editAktivitet.html?id=${svar.id}`
    }

}

function verifieraForm() {
    // Sätt standard returkod
    let returKod = true

    // Återställ alla fält
    document.getElementById('inputAktivitet_Err').innerText = ""
    document.getElementById('inputAktivitet').setCustomValidity("")

    // Kontrollera indata
    let aktivitet = window.document.getElementById("inputAktivitet").value.trim();
    if (aktivitet === '') {
        document.getElementById('inputAktivitet_Err').innerText = "Aktiviteten måste finnas"
        document.getElementById('inputAktivitet').setCustomValidity("Aktiviteten måste finnas")
        returKod = false
    } else if (allaAktiviteter.find(a => {
        // Returnera aktiviteten om den finns
        return a.activity.toLocaleLowerCase() === aktivitet.toLocaleLowerCase()
    })) {
        document.getElementById('inputAktivitet_Err').innerText = "Aktiviteten finns redan"
        document.getElementById('inputAktivitet').setCustomValidity("Aktiviteten finns redan")
        returKod = false
    }

    // Returnera svarskod
    return returKod
}