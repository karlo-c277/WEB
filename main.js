/*{}*/
import { NeatGradient } from "@firecms/neat";
function openTab(evt, tabName){
    let content = document.getElementsByClassName("tab-content");
    for (let i = 0; i < content.length; i++){
        content[i].classList.remove("active-content");
    }
    let activeElement=document.querySelector(".nav-links .active");
    if (activeElement){
        activeElement.classList.remove("active");
    }
    let target= document.getElementById(tabName);
    if (!target){
        console.error("NON EXISTENT TAB ", tabName);
    }
    document.getElementById(tabName).classList.add("active-content");
    evt.currentTarget.classList.add("active");
}

function openTabFromHome (tabName){
    let targetNavbarButton = document.querySelector(".nav-links ."+tabName);
    if(targetNavbarButton){
        targetNavbarButton.click();
    }
}

function showAbout(sectionId) {
    let sections = document.getElementsByClassName("about-content");
    for (let i = 0; i < sections.length; i++) {
        sections[i].style.display = "none";
    }
    document.getElementById(sectionId).style.display = "block";
}

window.openTab = openTab;
window.openTabFromHome = openTabFromHome;
window.showAbout = showAbout;

const config = {
    colors:[
        {
            color: '#fb5066',
            enabled: true,
        },
        {
            color: '#00efff',
            enabled: true,
        },
        {
            color: '#0f0635',
            enabled: true,
        },
        {
            color: '#8b6ae6',
            enabled: true,
        },
        {
            color: '#0f0635',
            enabled: true,
        },
        {
            color: '#fbff00',
            enabled: true,
        },
    ],
    speed: 0.7,
    horizontalPressure: 3,
    verticalPressure: 3,
    waveFrequencyX: 1,
    waveFrequencyY: 0,
    waveAmplitude: 2,
    secondaryWaveEnabled: false,
    secondaryWaveFrequencyX: 3,
    secondaryWaveFrequencyY: 3,
    secondaryWaveAmplitude: 5,
    secondaryWaveSpeed: 0.6,
    secondaryWaveAngle: 1,
    shadows: 2,
    highlits: 6,
    colorBrightness: 1.05,
    colorSaturation: 3,
    wireframe: false,
    antialias: false,
    colorBlending: 3,
    backgroundColor: '#003fff',
    backgroundAlpha: 1,
    grainScale: 5,
    grainSparsity: 0.1,
    grainIntensity: 0.25,
    grainSpeed: 2.4,
    resolution: 0.35,
    yOffset: 0,
    yOffsetWaveMultiplier: 9.5,
    yOffsetColorMultiplier: 13.7,
    yOffsetFlowMultiplier: 9.9,
    flowDistortionA: 1.7,
    flowDistortionb: 2.2,
    flowScale: 2.6,
    flowEase: 0.15,
    flowEnabled: true,
    enableProceduralTexture: true,
    transparentTextureVoid: false,
    textureMode: 'bitmap',
    bakeEdgeSoftness: 1,
    textureVoidLikelihood: 0.44,
    textureVoidWidthMin: 140,
    textureVoidWidthMax: 150,
    textureBandDensity: 1.9,
    textureColorBlending: 0.12,
    textureSeed: 333,
    textureEase: 0.3,
    proceduralBackgroundColor: '#<n>000000</n>',
    textureShapeTriangles: 46,
    textureShapeCircles: 15,
    textureShapeBars: 15,
    textureShapeSquiggles: 10,
    domainWarpEnabled: false,
    domainWarpIntensity: 0,
    domainWarpScale: 3,
    vignetteIntensity: 0,
    vignetteRadius: 0.8,
    fresnelEnabled: false,
    fresnelPower: 2,
    fresnelIntensity: 0.5,
    fresnelColor: '#fff',
    iridescenceEnabled: false,
    iridescenceIntensity: 0.5,
    iridescenceSpeed: 1,
    prismEdgeEnabled: false,
    prismEdgeIntensity: 0.5,
    prismEdgeThinness: 0.5,
    prismEdgeSpread: 1,
    prismEdgeSpeed: 0.5,
    prismEdgeRipple: 1,
    bloomIntensity: 0,
    bloomTreshold: 0.7,
    chromaticAberration: 0,
    shapeType: 'plane',
    shapeRotationX: 0,
    shapeRotationY: 0,
    shapeRotationZ: 0,
    shapeAutorotateSpeedX: 0,
    shapeAutorotateSpeedY: 0,
    sphereRadius: 15,
    torusRadius: 15,
    torusTube: 5,
    cylinderRadius: 10,
    cylinderHeight: 40,
    planeBend: 0,
    planeTwist: 0,
    silhouetteFade: 0.25,
    cylinderFade: 0.08,
    ribbonFade: 0.05,
    flatShading: true,
    cameraLock: true,
    cameraX: 0,
    cameraY: 0,
    cameraZ: 0,
    cameraRotationX: 0,
    cameraRotationY: 0,
    cameraRotationZ: 0,
    cameraZoom: 1,
};
const gradient = new NeatGradient({
    ref: document.getElementById("gradient"),
    ...config
});