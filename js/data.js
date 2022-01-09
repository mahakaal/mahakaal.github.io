const spinner = document.getElementById("spinner");

async function getData(url) {
    try {
        return await fetch(url)
            .then(response => response.json())
            .then(data => {
                return data;
            })
    } catch (error) {
        console.error(error);
    }
}

async function loadData() {
    const ANDAMENTO_NAZIONALE = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-andamento-nazionale.json";
    const SINTESI_ANDAMENTO_NAZIONALE = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-andamento-nazionale-latest.json";
    const data = await getData(ANDAMENTO_NAZIONALE);
    const sintesi = (await getData(SINTESI_ANDAMENTO_NAZIONALE))[0];

    const formatter = new Intl.NumberFormat('it-IT');
    const config = {responsive: true, locale: 'it'};

    document.getElementById("totalAffected").innerHTML = formatter.format(sintesi.totale_casi);
    document.getElementById("newPositives").innerHTML = formatter.format(sintesi.nuovi_positivi);
    document.getElementById("totalPositives").innerHTML = formatter.format(sintesi.totale_positivi);
    document.getElementById("variation").innerHTML = formatter.format(sintesi.variazione_totale_positivi);

    const general_graph = {
        x: data.map(e => e["data"]),
        y: data.map(e => e["totale_casi"]),
        x_label: "Data",
        y_label: "Totale casi",
        id: "general-graph",
        type: "lines+markers"
    }
    const new_cases_graph = {
        x: data.map(e => e["data"]),
        y: data.map(e => e["nuovi_positivi"]),
        x_label: "Data",
        y_label: "Nuovi Positivi",
        id: "new-cases-graph",
        type: "lines+markers"
    }
    const new_cases_over_total = {
        x: data.map(e => e["totale_casi"]),
        y: data.map(e => e["nuovi_positivi"]),
        x_label: "Totale casi",
        y_label: "Nuovi Positivi",
        id: "new-cases-over-total-graph",
        type: "log"
    }

    scatterGraph(general_graph, config);
    scatterGraph(new_cases_graph, config);
    scatterGraph(new_cases_over_total, config);

    spinner.setAttribute('hidden', '');
}

function scatterGraph(properties, config) {
    Plotly.newPlot(properties.id, [{
        type: 'scatter',
        x: properties.x,
        y: properties.y
    }], {
        xaxis: {
            type: properties.type,
            autorange: true,
            title: properties.x_label
        },
        yaxis: {
            type: properties.type,
            autorange: true,
            title: properties.y_label
        }
    }, config);
}