let localData = [
    { STATE_ID: '01', unemployment: 13.17 },
    { STATE_ID: '02', unemployment: 9.5 },
    { STATE_ID: '04', unemployment: 12.15 },
    { STATE_ID: '05', unemployment: 8.99 },
    { STATE_ID: '06', unemployment: 11.83 },
    { STATE_ID: '08', unemployment: 7.52 },
    { STATE_ID: '09', unemployment: 6.44 },
    { STATE_ID: '10', unemployment: 5.17 },
    { STATE_ID: '12', unemployment: 9.67 },
    { STATE_ID: '13', unemployment: 10.64 },
    { STATE_ID: '15', unemployment: 12.38 },
    { STATE_ID: '16', unemployment: 10.13 },
    { STATE_ID: '17', unemployment: 9.58 },
    { STATE_ID: '18', unemployment: 10.63 },
    { STATE_ID: '19', unemployment: 8.09 },
    { STATE_ID: '20', unemployment: 5.93 },
    { STATE_ID: '21', unemployment: 9.86 },
    { STATE_ID: '22', unemployment: 9.81 },
    { STATE_ID: '23', unemployment: 7.82 },
    { STATE_ID: '24', unemployment: 8.35 },
    { STATE_ID: '25', unemployment: 9.1 },
    { STATE_ID: '26', unemployment: 10.69 },
    { STATE_ID: '27', unemployment: 11.53 },
    { STATE_ID: '28', unemployment: 9.29 },
    { STATE_ID: '29', unemployment: 9.94 },
    { STATE_ID: '30', unemployment: 9.29 },
    { STATE_ID: '31', unemployment: 5.45 },
    { STATE_ID: '32', unemployment: 4.21 },
    { STATE_ID: '33', unemployment: 4.27 },
    { STATE_ID: '34', unemployment: 4.09 },
    { STATE_ID: '35', unemployment: 7.83 },
    { STATE_ID: '36', unemployment: 8.01 },
    { STATE_ID: '37', unemployment: 9.34 },
    { STATE_ID: '38', unemployment: 11.23 },
    { STATE_ID: '39', unemployment: 7.08 },
    { STATE_ID: '40', unemployment: 11.22 },
    { STATE_ID: '41', unemployment: 6.2 },
    { STATE_ID: '42', unemployment: 9.11 },
    { STATE_ID: '44', unemployment: 10.42 },
    { STATE_ID: '45', unemployment: 8.89 },
    { STATE_ID: '46', unemployment: 11.03 },
    { STATE_ID: '47', unemployment: 7.35 },
    { STATE_ID: '48', unemployment: 8.92 },
    { STATE_ID: '49', unemployment: 7.65 },
    { STATE_ID: '50', unemployment: 8.01 },
    { STATE_ID: '51', unemployment: 7.62 },
    { STATE_ID: '53', unemployment: 7.77 },
    { STATE_ID: '54', unemployment: 8.49 },
    { STATE_ID: '55', unemployment: 9.42 },
    { STATE_ID: '56', unemployment: 7.59 }
];

let lookupData = {};

const hospitals = {
    "type": "FeatureCollection",
    "features": [
        { "type": "Feature", "properties": { "Name": "VA Medical Center -- Leestown Division", "Address": "2250 Leestown Rd" }, "geometry": { "type": "Point", "coordinates": [-84.539487, 38.072916] } },
        { "type": "Feature", "properties": { "Name": "St. Joseph East", "Address": "150 N Eagle Creek Dr" }, "geometry": { "type": "Point", "coordinates": [-84.440434, 37.998757] } },
        { "type": "Feature", "properties": { "Name": "Central Baptist Hospital", "Address": "1740 Nicholasville Rd" }, "geometry": { "type": "Point", "coordinates": [-84.512283, 38.018918] } },
        { "type": "Feature", "properties": { "Name": "VA Medical Center -- Cooper Dr Division", "Address": "1101 Veterans Dr" }, "geometry": { "type": "Point", "coordinates": [-84.506483, 38.02972] } },
        { "type": "Feature", "properties": { "Name": "Shriners Hospital for Children", "Address": "1900 Richmond Rd" }, "geometry": { "type": "Point", "coordinates": [-84.472941, 38.022564] } },
        { "type": "Feature", "properties": { "Name": "Eastern State Hospital", "Address": "627 W Fourth St" }, "geometry": { "type": "Point", "coordinates": [-84.498816, 38.060791] } },
        { "type": "Feature", "properties": { "Name": "Cardinal Hill Rehabilitation Hospital", "Address": "2050 Versailles Rd" }, "geometry": { "type": "Point", "coordinates": [-84.54212, 38.046568] } },
        { "type": "Feature", "properties": { "Name": "St. Joseph Hospital", "ADDRESS": "1 St Joseph Dr" }, "geometry": { "type": "Point", "coordinates": [-84.523636, 38.032475] } },
        { "type": "Feature", "properties": { "Name": "UK Healthcare Good Samaritan Hospital", "Address": "310 S Limestone" }, "geometry": { "type": "Point", "coordinates": [-84.501222, 38.042123] } },
        {
            "type": "Feature", "properties": { "Name": "UK Medical Center", "Address": "800 Rose St" }, "geometry": { "type": "Point", "coordinates": [-84.508205, 38.031254] }
        }
    ]
}
    ;
const libraries = {
    "type": "FeatureCollection",
    "features": [
        { "type": "Feature", "properties": { "Name": "Village Branch", "Address": "2185 Versailles Rd" }, "geometry": { "type": "Point", "coordinates": [-84.548369, 38.047876] } },
        { "type": "Feature", "properties": { "Name": "Northside Branch", "ADDRESS": "1733 Russell Cave Rd" }, "geometry": { "type": "Point", "coordinates": [-84.47135, 38.079734] } },
        { "type": "Feature", "properties": { "Name": "Central Library", "ADDRESS": "140 E Main St" }, "geometry": { "type": "Point", "coordinates": [-84.496894, 38.045459] } },
        { "type": "Feature", "properties": { "Name": "Beaumont Branch", "Address": "3080 Fieldstone Way" }, "geometry": { "type": "Point", "coordinates": [-84.557948, 38.012502] } },
        { "type": "Feature", "properties": { "Name": "Tates Creek Branch", "Address": "3628 Walden Dr" }, "geometry": { "type": "Point", "coordinates": [-84.498679, 37.979598] } },
        { "type": "Feature", "properties": { "Name": "Eagle Creek Branch", "Address": "101 N Eagle Creek Dr" }, "geometry": { "type": "Point", "coordinates": [-84.442219, 37.999437] } }
    ]
};