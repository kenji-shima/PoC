lng = 139.62722;
lat = 35.45305;
map = new mapboxgl.Map({
  container: 'map',
  //style: 'mapbox://styles/mapbox/dark-v9',
  //style: 'mapbox://styles/kenji-shima/claqgq317000k14noi8pi9bjk',
  center: [lng, lat],
  zoom: 16,
  //pitch: 40,
});

const dayOfWeekConverter = {
  0: '日曜日',
  1: '月曜日',
  2: '火曜日',
  3: '水曜日',
  4: '木曜日',
  5: '金曜日',
  6: '土曜日',
}

map.on('load', function () {

  map.setConfigProperty('basemap', 'lightPreset', 'night');
  map.setConfigProperty('basemap', 'showPlaceLabels', false);
  map.setConfigProperty('basemap', 'showRoadLabels', false);
  map.setConfigProperty('basemap', 'showPointOfInterestLabels', false);
  map.setConfigProperty('basemap', 'showTransitLabels', false);

  document.getElementById('features').style = 'visibility:visible;';
  document.getElementById('pd').innerHTML = '<div id="dayOfWeek"></div><div id="hourOfDay"></div>'

  map.addSource('movement-data', {
    //type: 'vector',
    type: 'geojson',
    data: './data/2022-shinagawa-movement.geojson' // Replace with the URL to your GeoJSON data or provide the GeoJSON object directly
    //url:'mapbox://kenji-shima.2022-movement-tiles'
  });

  map.addSource('shinagawa-source', {
    type: 'geojson',
    data: './data/shinagawa.geojson'
  })

  /*map.addLayer({
    id: 'shinagawa',
    type: 'line',
    source: 'shinagawa-source',
    paint: {
      'line-color': '#FFFFFF',   // Line color
      'line-width': 5 ,
      'line-emissive-strength': 2       // Line width
    }
  })*/

  map.addLayer({
    id: 'movement-layer',
    slot: 'middle',
    type: 'fill',
    source: 'movement-data',
    //'source-layer': '2022-movement-0',
    paint: {
      'fill-color': '#FFD700',
      'fill-emissive-strength': 3

      /*[
        'interpolate', ['linear'],
      ['number', ['get', '4_2']],
      0, '#00ffff ',
      0.1, '#00e6e6', 
      0.2,'#00cccc', 
      0.3, '#00b3b3', 
      0.4, '#009999',
      0.5, '#007f7f',
      0.6, '#006666',
      0.7, '#004c4c',
      0.8, '#003333',
      0.9, '#001919',
      1, '#ffcc00',
      2, '#ff9900',
      3, '#ff6600',
      4, '#ff3300',
      5, '#ff0000',
      6, '#cc0000',
    ]*/
      ,
      'fill-opacity': [
        'interpolate', ['linear'],
        ['number', ['get', '4_17']],
        0, 0,
        0.2, 0.1,
        0.4, 0.2,
        0.6, 0.3,
        0.8, 0.4,
        1, 0.5,
        2, 0.6,
        3, 0.7,
        4, 0.8,
        5, 0.9,
        6, 1.0,
      ]
    },
    minzoom: 0
  },
    //'waterway-label'
  );

  play()
})

let day_of_week = 0
let hour_of_day = 0

const play = () => {
  const key = day_of_week + '_' + hour_of_day
  const fill_opacity = [
    'interpolate', ['linear'],
    ['number', ['coalesce', ['get', key], 0]],
    0, 0,
    0.2, 0.1,
    0.4, 0.2,
    0.6, 0.3,
    0.8, 0.4,
    1, 0.5,
    2, 0.6,
    3, 0.7,
    4, 0.8,
    5, 0.9,
    6, 1.0,
  ]

  const fill_color = [
    'interpolate', ['linear'],
    ['number', ['coalesce', ['get', key], 0]],
    0, '#FFFF00',
    0.2, '#FFFF66',
    0.4, '#FFFF99',
    0.6, '#FFFFCC',
    0.8, '#FFFFEE',
    1, '#FFFFFF',
    2, '#FFFFFF',
    3, '#FFFFFF',
    4, '#FFFFFF',
    5, '#FFFFFF',
    6, '#FFFFFF',
  ]

  map.setPaintProperty('movement-layer', 'fill-opacity', fill_opacity)
  //map.setPaintProperty('movement-layer', 'fill-color', fill_color)

  const text_day = dayOfWeekConverter[day_of_week]
  document.getElementById('dayOfWeek').innerHTML = text_day

  document.getElementById('hourOfDay').innerHTML = hour_of_day + '時'

  /*if(hour_of_day >= 18 && hour_of_day <=20){
    map.setConfigProperty('basemap', 'lightPreset', 'dusk');
  }else if(hour_of_day >= 4 && hour_of_day <=6){
    map.setConfigProperty('basemap', 'lightPreset', 'dawn');
  }else if(hour_of_day >= 7 && hour_of_day <=17){
    map.setConfigProperty('basemap', 'lightPreset', 'day');
  }else{
    map.setConfigProperty('basemap', 'lightPreset', 'night');
  }*/

  hour_of_day++
  if (hour_of_day > 23) {
    day_of_week++
  }

  if (day_of_week > 6) {
    day_of_week = 0
  }
  if (hour_of_day > 23) {
    hour_of_day = 0
  }

  map.repaint = true
  //console.log(key)

  setTimeout(play, 500)
}