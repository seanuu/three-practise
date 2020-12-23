import * as Stats from 'stats.js';
import * as THREE from 'three';
// import 'three/examples/js/controls/OrbitControls';
// import 'three/examples/js/renderers/Projector';

let stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

let canvas = document.getElementById('canvas');
let camera, renderer, scene;

let isUserInteracting = false,
    onMouseDownMouseX = 0, onMouseDownMouseY = 0,
    lon = 0, onMouseDownLon = 0,
    lat = 0, onMouseDownLat = 0,
    phi = 0, theta = 0;

let height = window.innerHeight;
let width = window.innerWidth;

init();
animate();

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, width / height, 1, 2000);
    renderer = new THREE.WebGLRenderer({canvas});

    // 设置视图大小
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    // 指定相机视线
    camera.target = new THREE.Vector3(0, 0, 0);

    let geometry = new THREE.SphereBufferGeometry(1000, 200, 200);
    // invert the geometry on the x-axis so that all of the faces point inward
    geometry.scale(-1, 1, 1);

    // 映射材质
    let material = new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('assets/texture/webgl_panorama_equirectangular.jpg')
    });

    let mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    document.addEventListener('ontouchstart' in document ? 'touchstart' : 'mousedown', onPointerStart, false);
    document.addEventListener('ontouchstart' in document ? 'touchmove' : 'mousemove', onPointerMove, false);
    document.addEventListener('ontouchstart' in document ? 'touchend' : 'mouseup', onPointerUp, false);

    document.addEventListener('wheel', onDocumentMouseWheel, false);
}

function animate() {
    stats.begin();
    requestAnimationFrame(animate);
    update();
    stats.update();
    stats.begin();
}

function update() {
    // if (isUserInteracting === false) {
    //     lon += 0.1;
    // }

    // y轴不变，x、z绕y轴选择,指向的经纬度
    lat = Math.max(-85, Math.min(85, lat));
    phi = THREE.Math.degToRad(90 - lat);
    theta = THREE.Math.degToRad(lon);

    camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
    camera.target.y = 500 * Math.cos(phi);
    camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);

    camera.lookAt(camera.target);

    /*
    // distortion
    camera.position.copy( camera.target ).negate();
    */

    renderer.render(scene, camera);

}

function onPointerStart(event) {
    isUserInteracting = true;

    let clientX = event.clientX || event.touches[0].clientX;
    let clientY = event.clientY || event.touches[0].clientY;

    onMouseDownMouseX = clientX;
    onMouseDownMouseY = clientY;

    onMouseDownLon = lon;
    onMouseDownLat = lat;
}

function onPointerMove(event) {
    if (isUserInteracting === true) {
        let clientX = event.clientX || event.touches[0].clientX;
        let clientY = event.clientY || event.touches[0].clientY;

        lon = (onMouseDownMouseX - clientX) * 0.1 + onMouseDownLon;
        lat = (clientY - onMouseDownMouseY) * 0.1 + onMouseDownLat;
    }
}

function onPointerUp(event) {
    isUserInteracting = false;
}

function onDocumentMouseWheel(event) {
    // 通过视角大小控制感觉距离
    let fov = camera.fov + event.deltaY * 0.05;
    camera.fov = THREE.Math.clamp(fov, 10, 75);
    camera.updateProjectionMatrix();
}
