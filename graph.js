const TramStop = (id, name) => ({ id, name });

const EdgeInfo = (timeCost, time, dayType, lineId) =>
  ({ timeCost, time, dayType, lineId });

const LineId = (lineId, varianceId) => ({ lineId, varianceId });

const Edge = (stop, info) => ({ stop, info });

const Graph = (stops, edges) => ({
  getStop: (stopId) => stops[stopId],
  getAllStops: () => Object.values(stops),
  getStopEdges: (stop) => edges[stop.id] || []
});


const fromLines = (lines) => {
    const nodeMap = getStops(lines)
      .reduce((map, node) => ({ ...map, [node.name]: node }), {});
  
    const missingStops = getMissingStopsFromDestinations(lines, nodeMap);
    missingStops.forEach((node) => {
      nodeMap[node.name] = node;
    });
  
    const edges = createEdges(nodeMap, lines);
  
    const stops = Object.fromEntries(
      Object.values(nodeMap).map((stop) => [stop.id, stop])
    );
  
    return Graph(stops, edges);
  };



  function createEdgesFromStop(nodeMap, stop, lineId) {
    const edges = [];
  
    if (!stop.board) {
      return edges;
    }
  
    for (const board of stop.board) {
      if (!board.days) {
        continue;
      }
  
      for (const day of board.days) {
        if (!day.toDayTimes) {
          continue;
        }
  
        for (const dayTime of day.toDayTimes) {
          if (!stop.times || stop.times.length < 2) {
            continue;
          }
  
          for (let i = 0; i < stop.times.length - 1; i++) {
            const start = stop.times[i];
            const target = stop.times[i + 1];
            const startNode = nodeMap[start.name];
            const targetNode = nodeMap[target.name];
            const timeCost = target.time - start.time;
            const time = new Time(dayTime.time + start.time);
            const dayType = dayTime.day;
            const edgeInfo = new EdgeInfo(timeCost, time, dayType, lineId);
            edges.push([startNode, new Edge(targetNode, edgeInfo)]);
          }
        }
      }
    }
  
    return edges;
  }
  
  function createEdges(nodeMap, lines) {
    const edges = [];
  
    for (const line of lines) {
      if (!line.variances) {
        continue;
      }
  
      for (const variance of line.variances) {
        if (!variance.stops) {
          continue;
        }
  
        for (const stop of variance.stops) {
          edges.push(...createEdgesFromStop(nodeMap, stop, new LineId(line.name, variance.id)));
        }
      }
    }
  
    const edgeMap = new Map();
  
    for (const [start, edge] of edges) {
      if (!edgeMap.has(start.id)) {
        edgeMap.set(start.id, []);
      }
      edgeMap.get(start.id).push(edge);
    }
  
    const result = {};
  
    for (const [id, edgeList] of edgeMap) {
      result[id] = edgeList;
    }
  
    return result;
  }
  
  function fromLines(lines) {
    const nodeMap = new Map();
  
    for (const line of lines) {
      for (const stop of line.stops) {
        if (!nodeMap.has(stop.name)) {
          nodeMap.set(stop.name, new TramStop(stop.id, stop.name));
        }
      }
    }
  
    const missingStops = getMissingStopsFromDestinations(lines, nodeMap);
    
    for (const stop of missingStops) {
      nodeMap.set(stop.name, new TramStop(stop.id, stop.name));
    }
  
    const edges = createEdges(nodeMap, lines);
    const stops = Array.from(nodeMap.values()).reduce((acc, stop) => {
      acc[stop.id] = stop;
      return acc;
    }, {});
  
    return new Graph(stops, edges);
  }