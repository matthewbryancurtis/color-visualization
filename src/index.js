const THREE = require('three');
const OrbitControls = require('three-orbit-controls')(THREE);

import ColorSort from 'colorsort';
import { COLOR } from './color';

const defaultColors = COLOR.join(', ');
const colorInput = document.getElementById('color-input');
const submitColorsButton = document.getElementById('submit-colors-button');
const populateColorsButton = document.getElementById('populate-colors-button');
const clearColorsButton = document.getElementById('clear-colors-button');
const toggleGuideButton = document.getElementById('toggle-guide-button');
const backgroundRange = document.getElementById('background-range');
const pixelSizeRange = document.getElementById('pixel-size-range');

submitColorsButton.addEventListener('click', submitColors);
populateColorsButton.addEventListener('click', () => { colorInput.value = defaultColors; });
clearColorsButton.addEventListener('click', () => { colorInput.value = ''; });
toggleGuideButton.addEventListener('click', toggleGuide);
backgroundRange.addEventListener('input', () => { backgroundColor = backgroundRange.value; });
pixelSizeRange.addEventListener('input', () => { pixelSize = pixelSizeRange.value; });

let backgroundColor = backgroundRange.value,
    pixelSize = pixelSizeRange.value,
    scene,
    camera,
    controls,
    renderer,
    showGuide,
    guide,
    box;

function toggleGuide() {
  if (!showGuide) {
    showGuide = true;
    guide = new THREE.AxisHelper( 2 );
    scene.add( guide );
    guide.position.set(-1, -1, -1);
  } else {
    showGuide = false;
    scene.remove( guide );
  }
}

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(`rgb(${backgroundColor}, ${backgroundColor}, ${backgroundColor})`);

  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  camera.position.z = 2.5;

  renderer = new THREE.WebGLRenderer({ antialiasing: true });
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  controls = new OrbitControls(camera, renderer.domElement);

  animate();

  colorInput.value = colorInput.value || defaultColors;
  submitColors();
}

function submitColors() {
  let cs = new ColorSort(colorInput.value);
  updateBox(cs);
  colorInput.value = cs.entries.map(elem => elem.getOriginalInput()).join(', ');
}

function updateBox(colors) {
  scene.remove(box);
  let geometry = new THREE.Geometry();

  colors.entries.forEach(elem => {
    geometry.vertices.push(
      new THREE.Vector3(elem.red() / 150, elem.green() / 150, elem.blue() / 150)
    );

    geometry.colors.push(
      new THREE.Color(elem.toRgbString())
    );
  });

  let material = new THREE.PointsMaterial({
    size: pixelSize / 100,
    vertexColors: THREE.VertexColors
  });

  box = new THREE.Points(geometry, material);
  box.position.x = -(255 / 150 / 2);
  box.position.y = -(255 / 150 / 2);
  box.position.z = -(255 / 150 / 2);
  scene.add(box);
}

function animate() {
  scene.background = new THREE.Color(`rgb(${backgroundColor}, ${backgroundColor}, ${backgroundColor})`);
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}

init();
