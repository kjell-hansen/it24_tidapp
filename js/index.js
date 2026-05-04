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
    let retur = {
        tasks: [
            {
                id: 1,
                time: "03:00",
                name:"Databas"
            },
            {
                id: 3,
                time: "02:15",
                name:"API-anrop"
            },
            {
                id: 4,
                time: "03:30",
                name:"Javascript"
            },
            {
                id: 5,
                time: "01:00",
                name:"Styling"
            },
        ]
    }
    fyllLista(retur)
}

function fyllLista(data) {
    let target=document.getElementById("tom")

    // Loopa igenom all data
    for(let i=0; i<data.tasks.length; i++) {
        let rad=document.createElement("ul")
        rad.className="lista"
        rad.innerHTML=`<li>${data.tasks[i].name}</li><li class="right">${data.tasks[i].time}</li>`
        target.appendChild(rad)
    }
}