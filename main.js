const parseCSV =  require('./parser')

const filePath = "./connection_graph_reduced.csv";
const data = parseCSV(filePath);

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let stopA, stopB, criteria, time;

rl.question('Podaj przystanek początkowy: ', (answer) => {
  stopA = answer;
  rl.question('Podaj przystanek końcowy: ', (answer) => {
    stopB = answer;
    rl.question('Kryterium optymalizacyjne - t- minimalizacja czasu, p - przesiadek: ', (answer) => {
      criteria = answer;
      rl.question('czas pojawienia się na przystanku poczatkowym: ', (answer) => {
        time = answer;
        rl.close();
      });
    });
  });
});



// Initialize an empty object to store graphs
const graphs = {};

// Loop over each object and create a graph for each bus line
data.forEach((item) => {
  const line = item.line;

  // If graph for this line doesn't exist yet, create it
  if (!graphs[line]) {
    graphs[line] = {};
  }

  const start = item.start_stop;
  const end = item.end_stop;
  const startLat = item.start_stop_lat;
  const startLon = item.start_stop_lon;
  const endLat = item.end_stop_lat;
  const endLon = item.end_stop_lon;
  const departure = item.departure_time;
  const arrival = item.arrival_time;

  // Add edge from start to end stop
  if (!graphs[line][start]) {
    graphs[line][start] = [];
  }
  graphs[line][start].push({ stop: end, lat: endLat, lon: endLon, departure: departure, arrival: arrival });

  // Add edge from end to start stop
  if (!graphs[line][end]) {
    graphs[line][end] = [];
  }
  graphs[line][end].push({ stop: start, lat: startLat, lon: startLon });
});

// Print the resulting graphs for each bus line
Object.entries(graphs).forEach(([line, graph]) => {
  console.log(`Graph for line ${line}:`);
  console.log(graph);
});