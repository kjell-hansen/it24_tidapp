window.onload = () => {
    let queryString = window.location.search
    let parameters = new URLSearchParams(queryString)

    if (parameters.has('id')) {
        fillForm(parameters.get('id'))
    } else {
        emptyForm()
    }

}

function fillForm(id) {
    // Hämta data (just nu all data och sen hitta rätt, senare hämta bara rätt data)
    fetch('dummy/aktiviteter.json')
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
            let post = data.activities.find(akt => akt.id == id)
            if (post) {
                // Fyll formuläret och se till att ID syns
                document.getElementById('valueId').innerText = post.id
                document.getElementById('labelId').style.display = 'initial'
                document.getElementById('inputAktivitet').value = post.activity
            } else {
                alert("Posten hittades inte")
                emptyForm()
            }
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