const Mapbox = {
    type: 'category',
    color: '#007afc',
    items: ['SKU', 'Industry', 'Use_Case']
};
window.Mapbox = Mapbox;

const Industry = {
    type: 'category',
    color: '#33B976',
    items: ['Logistics', 'Gaming', 'Media', 'Weather', 'Real Estate']
};
window.Industry = Industry;

const SKU = {
    type: 'category',
    color: '#E77F06',
    items: ['Map_Loads_for_Web', 'Maps SDK', 'Geocoding', 'Isochrone', 'Optimizer', 'Navigation', 'Boundaries', 'MTS']
};
window.SKU = SKU;

const Use_Case = {
    type: 'category',
    color: '#7539D7',
    items: ['Store Locator', 'BI/Analytics', 'Turn by Turn', 'Disaster', 'Story Telling', 'Indoor Map']
};
window.Use_Case = Use_Case;

const Map_Loads_for_Web = {
    type: 'category',
    items: ['Climate_Prediction']
};
window.Map_Loads_for_Web = Map_Loads_for_Web;

const Climate_Prediction = {
    type: 'demo',
    image: 'climate_predictions.png',
    url: 'https://demos.mapbox.com/climate_predictions/'
};
window.Climate_Prediction = Climate_Prediction;

let selectedCardList = [];

let previousColor;

const convertForUI = (val) => {
    return val.replaceAll('_', ' ');
}

const BACK = '<< Back';

const goBack = () => {
    selectedCardList.pop();
    selectCard(selectedCardList[selectedCardList.length - 1], false);
}

const selectCard = (category, IsForward) => {
    const selected = window[category];
    if (!selected) return;
    const cols = document.getElementById('cols');
    cols.innerHTML = '';

    let color = '';
    if (selected.color) {
        color = selected.color;
    } else {
        color = previousColor;
    }

    let frontImage = 'mapbox.png';
    if (selected.frontImage) {
        frontImage = selected.frontImage;
    }
    const frontAtt = `style="background-color:${color}; background-image: url(./images/${frontImage});"`;

    for (const elem of selected.items) {
        let backAtt = '';
        const demo = window[elem];
        if (demo && demo.type === 'demo') {
            backAtt = `style="background-image: url(./images/${demo.image}); " onclick="window.open('${demo.url}')"`;
        } else {
            backAtt = `style="background-color:${color}; " onclick="selectCard('${elem}', true)"`;
        }

        createCard(cols, category, elem, frontAtt, backAtt);
    }

    if (category !== 'Mapbox') {
        createCard(cols, category, BACK, frontAtt, `onclick="goBack()"`);
    }
    if (IsForward) {
        selectedCardList.push(category);
        previousColor = color;
    }
}

const createCard = (cols, front, back, frontAtt, backAtt) => {
    const col = cols.appendChild(document.createElement('div'));
    col.className = 'col';
    const container = `<div class="container">
    <div class="front" ${frontAtt}>
        <div class="inner">
            <p>${convertForUI(front)}</p>
        </div>
    </div>
    <div class="back" ${backAtt}">
        <div class="inner">
            <p>${convertForUI(back)}</p>
        </div>
    </div>
    </div>`;
    col.innerHTML = container;
}

selectCard('Mapbox', true);