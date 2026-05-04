window.onload = () => {
    // Rensa listan
    rensaLista()

    // Sätt standardvärden för perioden
    setDateInterval()

    // Hämta från API:et
    getCompilation()

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

function getCompilation() {
    fetch("dummy/sammanstallning.json")
        .then(response =>{
            if(response.ok) {
                return response.json()
            }

            // response är inte ok...
            return response.json()
                .catch(()=>null) // Är svaret inte json händer inget
                .then(message =>{
                    let fel ={status:response.status,
                        text: response.statusText,
                        url: response.url,
                        message
                    }

                    throw fel
                })
        })
        .then(data =>{
            fyllLista(data)
        })
        .catch(error => {
            console.error(error)
        })
}

function fyllLista(data) {
    let target=document.getElementById("tom")

    // Loopa igenom all data
    for(let i=0; i<data.tasks.length; i++) {
        let rad=document.createElement("ul")
        rad.className="lista"
        rad.innerHTML=`<li>${data.tasks[i].activity}</li><li class="right">${data.tasks[i].time}</li>`
        target.appendChild(rad)
    }
}