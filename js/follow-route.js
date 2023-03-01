map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/kenji-shima/clbq4qj5m000c15s1fm2ayr8r',
    bounds: [-75.825258, 38.192806, -74.921632, 38.636125],
    projection: "globe"
});


map.on("style.load", () => {
    // https://en.wikipedia.org/wiki/Transpeninsular_Line
    const transpeninsularLine = {
        type: "Feature",
        properties: {
            stroke: "#555555",
            "stroke-width": 2,
            "stroke-opacity": 1
        },
        geometry: {
            type: "LineString",
            coordinates: [
                [-76.328140, 38.472938],
                [-75.04914164543152, 38.451252947957364]
            ]
        }
    };

    map.addSource("tp-line", {
        type: "geojson",
        data: transpeninsularLine,
        // Line metrics is required to use the 'line-progress' property
        lineMetrics: true
    });

    map.addLayer({
        id: "tp-line-line",
        type: "line",
        source: "tp-line",
        paint: {
            "line-color": "rgba(0,0,0,0)",
            "line-width": 8,
            "line-opacity": 0.7
        }
    });
    map.setFog({}); // Set the default atmosphere style

    // アニメーションの前に、線の長さを計算します。
    const pathDistance = turf.lineDistance(transpeninsularLine);

    let startTime;
    const duration = 3000;

    const frame = (time) => {
        if (!startTime) startTime = time;
        const animationPhase = (time - startTime) / duration;
        //const animationPhaseDisplay = animationPhase.toFixed(2);

        // animationPhase に基づいて、パスに沿った距離を計算します。
        const targetPosition = turf.along(transpeninsularLine, pathDistance * animationPhase).geometry.coordinates;
        const bearing = 60 - animationPhase * 200.0;

        const cameraPosition = computeCameraPosition(60, bearing, targetPosition, 3000);
        const camera = map.getFreeCameraOptions();

        //const position = [138.72649, 35.33974];
        const altitude = 3000;

        camera.position = mapboxgl.MercatorCoordinate.fromLngLat(cameraPosition, altitude);
        //camera.lookAtPoint([138.73036, 35.36197]);
        //camera.position = cameraPosition;
        camera.lookAtPoint(targetPosition);

        map.setFreeCameraOptions(camera);

        // Reduce the visible length of the line by using a line-gradient to cutoff the line
        // animationPhase is a value between 0 and 1 that reprents the progress of the animation
        map.setPaintProperty("tp-line-line", "line-gradient", [
            "step",
            ["line-progress"],
            "yellow",
            animationPhase,
            "rgba(0, 0, 0, 0)"
        ]);

        if (animationPhase > 1) {
            return;
        }
        window.requestAnimationFrame(frame);
    };

    window.requestAnimationFrame(frame);

    // repeat
    setInterval(() => {
        startTime = undefined;
        window.requestAnimationFrame(frame);
    }, duration + 1500);
});



const computeCameraPosition = (
    pitch,
    bearing,
    targetPosition,
    altitude,
    smooth = false
) => {
    var bearingInRadian = bearing / 57.29;
    var pitchInRadian = (90 - pitch) / 57.29;

    var lngDiff =
        ((altitude / Math.tan(pitchInRadian)) *
            Math.sin(-bearingInRadian)) /
        70000; // ~70km/degree longitude
    var latDiff =
        ((altitude / Math.tan(pitchInRadian)) *
            Math.cos(-bearingInRadian)) /
        110000 // 110km/degree latitude

    var correctedLng = targetPosition[0] + lngDiff;
    var correctedLat = targetPosition[1] - latDiff;
    
    const newCameraPosition = {
        lng: correctedLng,
        lat: correctedLat
    };

    return newCameraPosition
}