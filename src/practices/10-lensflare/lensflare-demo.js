import * as Stats from 'stats.js';
import * as THREE from 'three';
import 'three/examples/js/controls/FlyControls';
import 'three/examples/js/objects/Lensflare.js';

let container, stats;

let camera, scene, renderer;
let controls;

let clock = new THREE.Clock;

init();
animate();

function init() {
    container = document.body;
    let canvas = document.querySelector('#canvas');

    // camera
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 250;

    // controls
    controls = new THREE.FlyControls(camera);
    controls.movementSpeed = 2000;
    controls.domElement = canvas;
    controls.rollSpeed = Math.PI / 6;
    controls.autoForward = false;
    controls.dragToLook = false;

    // scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color().setHSL(0.51, 0.4, 0.01);
    scene.fog = new THREE.Fog(scene.background, 2000, 10000);

    // objects
    let size = 250;
    let geometry = new THREE.BoxBufferGeometry(size, size, size);
    let material = new THREE.MeshPhongMaterial({color: 0xffffff, specular: 0xffffff});

    for (let i = 0; i < 3000; i++) {
        let mesh = new THREE.Mesh(geometry, material);

        mesh.position.set(8000 * (2.0 * Math.random() - 1.0), 8000 * (2.0 * Math.random() - 1.0), 8000 * (2.0 * Math.random() - 1.0));
        mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);

        mesh.matrixAutoUpdate = false;
        mesh.updateMatrix();

        scene.add(mesh);
    }

    // lights
    let directionalLight = new THREE.DirectionalLight(0xffffff, 0.1);
    directionalLight.position.set(0, -1, 0);
    directionalLight.color.setHSL(0.1, 0.7, 0.5);
    scene.add(directionalLight);

    // lensflare
    let textureLoader = new THREE.TextureLoader();
    let textureFlare0 = textureLoader.load('/assets/examples/textures/lensflare/lensflare0.png');
    let textureFlare3 = textureLoader.load('/assets/examples/textures/lensflare/lensflare3.png');

    addPointLight(0.55, 0.9, 0.5, 5000, 0, -1000);
    addPointLight(0.08, 0.8, 0.5, 0, 0, -1000);
    addPointLight(0.995, 0.5, 0.9, 5000, 5000, -1000);

    function addPointLight(h, s, l, x, y, z) {
        let light = new THREE.PointLight(0xffffff, 1.5, 5000);
        light.color.setHSL(h, s, l);
        light.position.set(x, y, z);
        scene.add(light);

        let lensflare = new THREE.LensFlare();
        // 设置主光晕
        lensflare.addElement(new THREE.LensFlareElement(textureFlare0, 700, 0, light.color));
        // // 设置次要光晕
        lensflare.addElement(new THREE.LensFlareElement(textureFlare3, 60, 0.6, light.color));
        lensflare.addElement(new THREE.LensFlareElement(textureFlare3, 70, 0.7, light.color));
        lensflare.addElement(new THREE.LensFlareElement(textureFlare3, 120, 0.9, light.color));
        lensflare.addElement(new THREE.LensFlareElement(textureFlare3, 70, 1, light.color));

        light.add(lensflare);
    }

    // renderer
    renderer = new THREE.WebGLRenderer({canvas: canvas});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.gammaInput = true;
    renderer.gammaOutput = true;

    // stats
    stats = new Stats();
    container.appendChild(stats.domElement);
}

function animate() {
    requestAnimationFrame(animate);
    render();
    stats.update();
}

function render() {
    let delta = clock.getDelta();
    controls.update(delta);
    renderer.render(scene, camera);
}
