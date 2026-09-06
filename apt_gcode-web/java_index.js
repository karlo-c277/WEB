import { NeatGradient } from "@firecms/neat";

const presetSelect = document.getElementById("preset");
const costumOptions = document.getElementById("costumOptions");
const costumOutput = document.getElementById("costumOutput");
const downloadCheckbox = document.getElementById("downloadOutputCheck");
const errorBox = document.getElementById("errorBox");
const textInputToggle = document.getElementById("textInputToggle");
const textInput = document.getElementById("textInput");

textInputToggle.addEventListener("change", () => {
    if (textInputToggle.checked){
        textInput.style.display = "block";
    }
    else{
        textInput.style.display = "none"
    }
});

const config = {
    colors: [
        {
            color: '#899D99',
            enabled: true,
        },
        {
            color: '#B10000',
            enabled: true,
        },
        {
            color: '#373c38',
            enabled: true,
        },
        {
            color: '#FFC800',
            enabled: true,
        },
        {
            color: '#303B42',
            enabled: true,
        },
        {
            color: '#2E7075',
            enabled: true,
        },
    ],
    speed: 0.5,
    horizontalPressure: 5,
    verticalPressure: 4,
    waveFrequencyX: 4,
    waveFrequencyY: 5,
    waveAmplitude: 4,
    secondaryWaveEnabled: true,
    secondaryWaveFrequencyX: 3,
    secondaryWaveFrequencyY: 3,
    secondaryWaveAmplitude: 5,
    secondaryWaveSpeed: 0.6,
    secondaryWaveAngle: 75,
    shadows: 4,
    highlights: 4,
    colorBrightness: 0.6,
    colorSaturation: 0,
    wireframe: true,
    antialias: false,
    colorBlending: 3,
    backgroundColor: '#000000',
    backgroundAlpha: 0.95,
    grainScale: 2,
    grainSparsity: 0,
    grainIntensity: 0.575,
    grainSpeed: 0.1,
    resolution: 0.7,
    yOffset: 0,
    yOffsetWaveMultiplier: 5.5,
    yOffsetColorMultiplier: 5.2,
    yOffsetFlowMultiplier: 6,
    flowDistortionA: 3.7,
    flowDistortionB: 1.4,
    flowScale: 2.9,
    flowEase: 0.32,
    flowEnabled: true,
    enableProceduralTexture: true,
    transparentTextureVoid: false,
    textureMode: 'bitmap',
    bakeEdgeSoftness: 1.4,
    textureVoidLikelihood: 0.17,
    textureVoidWidthMin: 200,
    textureVoidWidthMax: 100,
    textureBandDensity: 1.1,
    textureColorBlending: 0.51,
    textureSeed: 645,
    textureEase: 1,
    proceduralBackgroundColor: '#000000',
    textureShapeTriangles: 8,
    textureShapeCircles: 15,
    textureShapeBars: 15,
    textureShapeSquiggles: 10,
    domainWarpEnabled: false,
    domainWarpIntensity: 0,
    domainWarpScale: 3,
    vignetteIntensity: 0,
    vignetteRadius: 0.8,
    fresnelEnabled: true,
    fresnelPower: 2,
    fresnelIntensity: 0.5,
    fresnelColor: '#4E2626',
    iridescenceEnabled: false,
    iridescenceIntensity: 0.5,
    iridescenceSpeed: 1,
    prismEdgeEnabled: false,
    prismEdgeIntensity: 0.5,
    prismEdgeThinness: 3,
    prismEdgeSpread: 1,
    prismEdgeSpeed: 0.5,
    prismEdgeRipple: 1,
    bloomIntensity: 0,
    bloomThreshold: 0.7,
    chromaticAberration: 0,
    shapeType: 'plane',
    shapeRotationX: 0,
    shapeRotationY: 0,
    shapeRotationZ: 0,
    shapeAutoRotateSpeedX: 0,
    shapeAutoRotateSpeedY: 0,
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
    cameraZoom: 1.3,
};

const gradient = new NeatGradient({
    ref: document.getElementById("gradient"),
    ...config
});

window.addEventListener("scroll", () => {
    gradient.yOffset = window.scrollY;
});

function updateCostumPanels() {
    const isCostum = presetSelect.value === "costum";
    const isDownload = downloadCheckbox.checked;

    costumOptions.style.display = "none";
    costumOutput.style.display= "none";

    if (isCostum) {
        costumOptions.style.display = "block";
        if (isDownload) {
            costumOutput.style.display = "block"
        }
    }
};
presetSelect.addEventListener(
    "change", updateCostumPanels
);
downloadCheckbox.addEventListener("change", updateCostumPanels);
updateCostumPanels();