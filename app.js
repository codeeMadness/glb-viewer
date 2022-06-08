import * as THREE from 'https://cdn.skypack.dev/pin/three@v0.137.0-X5O2PK3x44y1WRry67Kr/mode=imports/optimized/three.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js';
import { loadingPage, loadingBar } from './loadingPage.js';

const renderer = new THREE.WebGLRenderer();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight);
// ===== loading manager =====
const loadingManager = new THREE.LoadingManager();

let mesh;
const controls = new OrbitControls(camera, renderer.domElement);
const loadBtn = document.getElementById('load-btn');

loadingPage();

loadBtn.addEventListener('click', event => {
    const urlValue = document.getElementById('url-input').value;
    const x = document.getElementById('x-input').value;
    const y = document.getElementById('y-input').value;
    const z = document.getElementById('z-input').value;
    const scale = document.getElementById('scale-input').value;
    if(urlValue) {
        if(mesh) scene.remove(mesh);
        changeModel(urlValue, x, y, z, scale);

    }
});

renderer.setSize(window.innerWidth, window.innerHeight);
scene.background = new THREE.Color( 0xbfe3dd );

scene.add(new THREE.HemisphereLight(0xffffcc, 0x333399, 1.0));
camera.position.set(-2, 2, 10);

const changeModel = (url, x, y, z, scale) => {
    loadingBar(loadingManager);
    //===== url: //bdsg-models.pages.dev/TaiChinh.glb
    const loader = new GLTFLoader(loadingManager);
    loader.load(url, ({ scene: model }, animations) => {

        x = x ? x : 0;
        y = y ? y : 0;
        z = z ? z : 0;
        scale = scale ? scale : 1.0;

        model.position.set(x, y, z);
        
        model.scale.set(scale, scale, scale);
        
        camera.lookAt(model.position);
        
        controls.target.copy(model.position);
      
        mesh = model;

        scene.add(model);
        
        
    });
}

const animate = () => {
  // if (mesh) {
  //   mesh.rotateY(Math.PI / 360);
  // }

  renderer.render(scene, camera);
  
  controls.update();

  requestAnimationFrame(animate);
};

animate();

document.body.appendChild(renderer.domElement);