map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/satellite-v9',
    center: [139.62722, 35.45305], // starting position
    zoom: 4, // starting zoom
});

map.on('style.load', () => {

    map.addSource('typhoon', {
        type: 'vector',
        url: 'mapbox://kenji-shima.nhk-typhoon'
    });

    map.addLayer({
        'id': 'typhoon-center-dummy',
        'type': 'circle',
        'source': 'typhoon',
        'source-layer': 'nhk-typhoon',
        'minzoom': 4,
        'maxzoom': 16,
        paint: {
            'circle-color': 'red',
            'circle-radius': 5,
            'circle-opacity': 0
        }
    })

})

map.on('load', () => {
    showLayers()
})

function showLayers() {
    var features = map.querySourceFeatures('typhoon', {
        sourceLayer: 'nhk-typhoon'
    })
    features = removeDuplicates(features)
    features.sort(compareDateTime)
    features = features.map(feature => {
        let predictCenter = parseFeatureCoordinates(feature.properties["Item_Kind_Property_CenterPart_ProbabilityCircle_予報円_BasePoint_中心位置（度）"])
        if (predictCenter) {
            feature.properties.predict_center = predictCenter
            feature.properties.predict_radius = feature.properties["Item_Kind_Property_CenterPart_ProbabilityCircle_予報円_Axes_Axis_Radius_７０パーセント確率半径_km"]
        } else {
            feature.properties.predict_center = feature.geometry.coordinates
            feature.properties.predict_radius = "0"
        }
        feature.properties.bofu_radius = feature.properties.Item_Kind_Property_WarningAreaPart_暴風域_Circle_Axes_Axis_Radius_半径_km
        feature.properties.bofu_alert_radius = feature.properties.Item_Kind_Property_WarningAreaPart_暴風警戒域_Circle_Axes_Axis_Radius_半径_km
        feature.properties.kyofu_radius = feature.properties.Item_Kind_Property_WarningAreaPart_強風域_Circle_Axes_Axis_Radius_半径_km
        feature.properties.jpDate = formatJapaneseDate(feature.properties.DateTime)
        return feature
    })
    console.log("features", features)
    features = removeOverlappingCircles(features)
    const predict_circles = features
        .filter(feature => feature.properties.predict_center)
        .map(feature => {
            const center = feature.properties.predict_center
            const newFeature = createCircle(center, feature.properties.predict_radius, 64, feature); // 1 km radius, 64 points
            newFeature.properties = feature.properties
            newFeature.properties.center = center
            newFeature.properties.predict_radius = feature.properties.predict_radius
            return newFeature
        })
    const bofu_circles = features
        .filter(feature => feature.properties.bofu_radius)
        .map(feature => {
            const center = feature.geometry.coordinates;
            const newFeature = createCircle(center, feature.properties.bofu_radius, 64, feature); // 1 km radius, 64 points
            newFeature.properties = feature.properties
            newFeature.properties.center = center
            newFeature.properties.bofu_radius = feature.properties.bofu_radius
            return newFeature
        });

    const bofu_alert_circles = features
        .filter(feature => feature.properties.bofu_alert_radius)
        .map(feature => {
            const center = feature.geometry.coordinates;
            const newFeature = createCircle(center, feature.properties.bofu_alert_radius, 64, feature); // 1 km radius, 64 points
            newFeature.properties = feature.properties
            newFeature.properties.center = center
            newFeature.properties.bofu_alert_radius = feature.properties.bofu_alert_radius
            return newFeature
        });

    const kyofu_circles = features.map(feature => {
        const center = feature.geometry.coordinates;
        return createCircle(center, feature.properties.kyofu_radius, 64, feature); // 1 km radius, 64 points
    });

    const predict_circleGeoJSON = {
        type: 'FeatureCollection',
        features: predict_circles
    }
    const bofu_circleGeoJSON = {
        type: 'FeatureCollection',
        features: bofu_circles
    };
    const kyofu_circleGeoJSON = {
        type: 'FeatureCollection',
        features: kyofu_circles
    };
    map.addSource('predict', {
        type: 'geojson',
        data: predict_circleGeoJSON
    });
    map.addSource('bofu', {
        type: 'geojson',
        data: bofu_circleGeoJSON
    });
    map.addSource('kyofu', {
        type: 'geojson',
        data: kyofu_circleGeoJSON
    });

    // Add a fill layer to visualize the circles
    map.addLayer({
        id: 'predict',
        type: 'line',
        source: 'predict',
        paint: {
            'line-color': 'white',
            'line-opacity': 1.0,
            'line-dasharray': [2, 4],
            'line-width': 1
        }
    });

    map.addLayer({
        id: 'bofu',
        type: 'line',
        source: 'bofu',
        paint: {
            'line-color': 'red',
            'line-width': 3,
            'line-opacity': 1.0
        }
    });
    map.addLayer({
        id: 'bofu-fill',
        type: 'fill',
        source: 'bofu',
        paint: {
            'fill-color': 'red',
            'fill-opacity': 0.5
        }
    });

    map.addLayer({
        id: 'kyofu',
        type: 'line',
        source: 'kyofu',
        paint: {
            'line-color': 'yellow',
            'line-width': 3,
            'line-opacity': 1.0
        }
    });
    map.addLayer({
        id: 'kyofu-fill',
        type: 'fill',
        source: 'kyofu',
        paint: {
            'fill-color': 'yellow',
            'fill-opacity': 0.2
        }
    });


    const predictCenterFeatures = predict_circles.map(feature => {
        return {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: feature.properties.predict_center
            },
            properties: feature.properties
        }
    })
    const centerCollection = {
        type: 'FeatureCollection',
        features: predictCenterFeatures
    }
    centerCollection.features.push(...predictCenterFeatures)

    map.addSource('typhoon-center', {
        type: 'geojson',
        data: centerCollection
    })

    map.addLayer({
        'id': 'typhoon-center',
        'type': 'circle',
        'source': 'typhoon-center',
        //'minzoom': 4,
        //'maxzoom': 16,
        paint: {
            'circle-color': 'white',
            'circle-radius': 5,
        }
    })
    map.addLayer({
        id: 'circle-labels',
        type: 'symbol',
        source: 'typhoon-center',
        layout: {
            'text-field': ['get', 'jpDate'],
            'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
            'text-size': 14,
            'text-offset': [-5, 0],
            'text-anchor': 'top'
        },
        paint: {
            'text-color': '#ffffff',
        }
    });

    //let groups = groupCirclesByAngle(bofu_circles);
    const bofuAlertConvexHull = createConvexHulls([bofu_alert_circles]);
    const convexHullCollection = {
        type: "FeatureCollection",
        features: bofuAlertConvexHull
    }
    map.addSource('convexHull', {
        type: 'geojson',
        data: convexHullCollection
    })
    map.addLayer({
        id: 'convexHull',
        type: 'line',
        source: 'convexHull',
        paint: {
            'line-color': 'red',
            'line-opacity': 1.0
        }
    })

    let groups = groupCirclesBy2(predict_circles)
    console.log("groups", groups)
    const tangentCollection = getExternalTangents(groups)
    // const tangentCollection = {
    //     type: 'FeatureCollection',
    //     features: tangentFeatures
    // }
    console.log("tangentFeatureCollection", tangentCollection)
    map.addSource('tangent', {
        type: 'geojson',
        data: tangentCollection
    })
    map.addLayer({
        id: 'tangent',
        type: 'line',
        source: 'tangent',
        paint: {
            'line-color': 'white',
            'line-opacity': 1.0
        }
    })
}
function parseCoord(coordStr) {
    coordStr = coordStr.replace('/', '');
    if (coordStr.includes('.')) {
        return parseFloat(coordStr);
    } else {
        return parseFloat(coordStr.slice(0, -2) + '.' + coordStr.slice(-2));
    }
}
function parseFeatureCoordinates(coords) {
    if (coords == null) return null
    coords = coords.split("+")
    return [parseCoord(coords[2]), parseCoord(coords[1])]
}
function formatJapaneseDate(dateString) {
    const date = new Date(dateString);

    const day = date.getDate();

    const hour = date.getHours();

    const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
    const weekday = weekdays[date.getDay()];

    const formattedDate = `${day}日（${weekday}）${hour}時`;

    return formattedDate;
}
function compareDateTime(a, b) {
    const dateA = new Date(a.properties.DateTime);
    const dateB = new Date(b.properties.DateTime);
    return dateA - dateB;
}

function removeDuplicates(features) {
    const seenDateTimes = new Set();

    const filteredFeatures = features.filter(feature => {
        const dateTime = feature.properties.DateTime;
        if (seenDateTimes.has(dateTime)) {
            return false;
        } else {
            seenDateTimes.add(dateTime);
            return true;
        }
    });

    return filteredFeatures
}

/*function createCircle(center, radiusInKm, points, feature) {
    const coords = {
        latitude: center[1],
        longitude: center[0]
    };

    // Convert radius from kilometers to degrees
    const kmInDegrees = radiusInKm / 111.32;
    const circle = [];

    for (let i = 0; i < points; i++) {
        // Calculate the angle in radians
        const angle = (i * 360) / points;
        const angleRad = (angle * Math.PI) / 180;

        // Calculate the latitude and longitude for each point
        const latitude = coords.latitude + kmInDegrees * Math.sin(angleRad);
        const longitude = coords.longitude + kmInDegrees * Math.cos(angleRad);

        // Add the point to the circle
        circle.push([longitude, latitude]);
    }

    // Close the circle by adding the first point at the end
    circle.push(circle[0]);

    return {
        type: 'Feature',
        geometry: {
            type: 'Polygon',
            coordinates: [circle]
        },
        properties: feature.properties
    };
}*/

function createCircle(center, radiusInKm, points, feature) {
    radiusInKm = radiusInKm || 0.001;
    const options = { steps: points, units: "kilometers", properties: feature.properties };
    return turf.circle(center, Number(radiusInKm), options);
}

// Function to calculate the distance between two points on the Earth using the Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const point1 = [lon1, lat1];
    const point2 = [lon2, lat2];

    // Calculate the distance
    const distance = turf.distance(point1, point2, { units: 'kilometers' });
    return distance
}

// Function to check if two circles overlap
function circlesOverlap(circle1, circle2) {
    const [lon1, lat1] = circle1.geometry.coordinates;
    const [lon2, lat2] = circle2.geometry.coordinates;
    const distance = calculateDistance(lat1, lon1, lat2, lon2);
    return distance < (parseFloat(circle2.properties.bofu_radius) + parseFloat(circle2.properties.bofu_radius) - 50);
}

// Function to remove overlapping circles
function removeOverlappingCircles(circles) {
    let result = [];

    for (let i = 0; i < circles.length; i++) {
        let isOverlapping = false;

        for (let j = 0; j < result.length; j++) {
            //console.log(`${i}:${j}`,circlesOverlap(circles[i], result[j]))
            if (circlesOverlap(circles[i], result[j])) {
                isOverlapping = true;
                break;
            }
        }

        if (!isOverlapping) {
            result.push(circles[i]);
        }
    }

    return result;
}


// Function to calculate the angle between three points
function calculateAngle(p1, p2, p3) {
    if (p1.length < 2 || p2.length < 2 || p3.length < 2) {
        throw new Error("Each coordinate must contain at least latitude and longitude.");
    }

    const bearing1 = turf.bearing(turf.point(p1), turf.point(p2));
    const bearing2 = turf.bearing(turf.point(p2), turf.point(p3));
    let angle = Math.abs(bearing1 - bearing2);
    if (angle > 180) {
        angle = 360 - angle;
    }
    return angle;
}

function groupCirclesBy2(circles) {
    let groups = []
    for (let i = 1; i < circles.length; i++) {
        let currentGroup = []
        currentGroup.push(circles[i - 1])
        currentGroup.push(circles[i])
        groups.push(currentGroup)
    }
    return groups
}

// Function to expand a circle to a polygon
function expandCircleToPolygon(circle) {
    return turf.buffer(circle, 0, { units: 'kilometers' });
}

function getExternalTangents(group) {
    let tangents = []
    group.forEach(g => {
        let fc = calculateExternalTangents(g[0], g[1])
        if (fc != null) {
            tangents.push(...fc.features)
        }
    })
    return turf.featureCollection(tangents)
}

/*function calculateExternalTangents(geojsonCircle1, geojsonCircle2) {
    const [x1, y1] = geojsonCircle1.properties.predict_center;
    const r1 = geojsonCircle1.properties.predict_radius / 111.32;
    const [x2, y2] = geojsonCircle2.properties.predict_center;
    const r2 = geojsonCircle2.properties.predict_radius / 111.32;

    const d = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

    if (d <= Math.abs(r1 - r2)) {
        return null;
    }

    // Calculate the angles of the tangent lines
    const angleBetweenCenters = Math.atan2(y2 - y1, x2 - x1);
    const theta = Math.acos((r1 - r2) / d); // angle offset for external tangents

    const tangentPoints = [];

    // First external tangent
    const angle1 = angleBetweenCenters + theta;
    const tangentPoint1Circle1 = [x1 + r1 * Math.cos(angle1), y1 + r1 * Math.sin(angle1)];
    const tangentPoint1Circle2 = [x2 + r2 * Math.cos(angle1), y2 + r2 * Math.sin(angle1)];
    tangentPoints.push(turf.lineString([tangentPoint1Circle1, tangentPoint1Circle2]));

    // Second external tangent
    const angle2 = angleBetweenCenters - theta;
    const tangentPoint2Circle1 = [x1 + r1 * Math.cos(angle2), y1 + r1 * Math.sin(angle2)];
    const tangentPoint2Circle2 = [x2 + r2 * Math.cos(angle2), y2 + r2 * Math.sin(angle2)];
    tangentPoints.push(turf.lineString([tangentPoint2Circle1, tangentPoint2Circle2]));

    return turf.featureCollection(tangentPoints);
}*/

function calculateExternalTangents(circle1, circle2) {
    // Extract centers and radii from the circle features
    const center1 = circle1.properties.predict_center;
    const center2 = circle2.properties.predict_center;
    const r1 = circle1.properties.predict_radius; // Radius in kilometers
    const r2 = circle2.properties.predict_radius; // Radius in kilometers

    // Calculate the distance between the two centers
    const distanceBetweenCenters = turf.distance(
        turf.point(center1),
        turf.point(center2),
        { units: 'kilometers' }
    );

    // Check if external tangents exist
    if (distanceBetweenCenters <= Math.abs(r1 - r2)) {
        console.log('No external tangents exist (circles overlap or one is inside the other).');
        return null;
    }

    // Calculate the initial bearing from center1 to center2
    const initialBearing = turf.bearing(
        turf.point(center1),
        turf.point(center2)
    );

    // Calculate the angle offset
    const angleOffset = Math.acos((r1 - r2) / distanceBetweenCenters) * (180 / Math.PI);

    // Angles for the tangent points
    const angle1 = initialBearing + angleOffset;
    const angle2 = initialBearing - angleOffset;

    // Normalize angles to be within -180 to 180 degrees
    const normalizeAngle = angle => ((angle + 180) % 360) - 180;

    const angle1Normalized = normalizeAngle(angle1);
    const angle2Normalized = normalizeAngle(angle2);

    // Calculate the tangent points on circle1
    const tangentPoint1Circle1 = turf.destination(
        turf.point(center1),
        r1,
        angle1Normalized,
        { units: 'kilometers' }
    );

    const tangentPoint2Circle1 = turf.destination(
        turf.point(center1),
        r1,
        angle2Normalized,
        { units: 'kilometers' }
    );

    // Calculate the corresponding tangent points on circle2
    const tangentPoint1Circle2 = turf.destination(
        turf.point(center2),
        r2,
        angle1Normalized,
        { units: 'kilometers' }
    );

    const tangentPoint2Circle2 = turf.destination(
        turf.point(center2),
        r2,
        angle2Normalized,
        { units: 'kilometers' }
    );

    // Create tangent lines
    const tangentLines = [
        turf.lineString([
            tangentPoint1Circle1.geometry.coordinates,
            tangentPoint1Circle2.geometry.coordinates
        ]),
        turf.lineString([
            tangentPoint2Circle1.geometry.coordinates,
            tangentPoint2Circle2.geometry.coordinates
        ]),
    ];

    // Return the tangent lines as a FeatureCollection
    return turf.featureCollection(tangentLines);
}

// Function to create convex hulls for each group of circles
function createConvexHulls(groups) {
    let hulls = [];

    groups.forEach(group => {
        // if (group.length > 1) { // Only create a hull if there's more than one circle
        let polygons = group.map(expandCircleToPolygon);
        let combinedPolygons = turf.featureCollection(polygons);
        let hull = turf.convex(combinedPolygons);
        // let mergedPolygons = {
        //     type: "MultiPolygon",
        //     coordinates: []
        // }
        // combinedPolygons.features.forEach(feature => {
        //     if (feature.geometry.type === 'Polygon') {
        //         mergedPolygons.coordinates.push(feature.geometry.coordinates);
        //     }
        // })
        // let diffHull = turf.difference(hull.geometry, mergedPolygons)
        // let newHull = turf.intersect(hull.geometry, diffHull.geometry)
        if (hull) {
            hulls.push(hull);
        }
        // }
    });

    return hulls;
}