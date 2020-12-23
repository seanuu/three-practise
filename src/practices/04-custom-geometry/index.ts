import * as Stats from 'stats.js';
import * as THREE from 'three';
import 'three/examples/js/objects/Lensflare.js';
import 'three/examples/js/utils/SceneUtils.js';

declare var dat: any;

THREE.SceneUtils['createMultiMaterialObject'] = function (geometry, materials) {
    let group = new THREE.Group();
    for (let i = 0, l = materials.length; i < l; i++) {
        group.add(new THREE.Mesh(geometry, materials[i]));
    }
    return group;
};

let stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

let controls = {
    x: 0,
    y: 0,
    z: 0
};

let gui = new dat.GUI();
let f = gui.addFolder('ff');
f.add(controls, 'x', 0, 200);
f.add(controls, 'y', 0, 200);
f.add(controls, 'z', 0, 200);

let height = window.innerHeight;
let width = window.innerWidth;

// 定义场景、相机、渲染器
let canvas = document.getElementById('canvas');
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
// @ts-ignore
let renderer = new THREE.WebGLRenderer({canvas: canvas});

renderer.setClearColor(0xEEEEEE);
renderer.setSize(width, height);
renderer.shadowMap.enabled = true;

// 添加点光源
let light = new THREE.SpotLight(0xffffff);
light.distance = 2000;
light.position.set(-20, 30, 0);
light.castShadow = true;
light.angle = 25 * Math.PI / 180;
light.shadow.camera.near = 1;
light.shadow.camera.far = 40;
light.shadow.mapSize.width = 512;
light.shadow.mapSize.height = 512;
light.shadow.bias = 0.01;
light.penumbra = 0.5;
light.color.setHSL(0.08, 0.8, 0.5);
scene.add(light);

let spotLightHelper = new THREE.SpotLightHelper(light);
scene.add(spotLightHelper);

let textureLoader = new THREE.TextureLoader();

let textureFlare0 = textureLoader.load('assets/texture/lensflare0.png');
let textureFlare3 = textureLoader.load('assets/texture/lensflare3.png');
// @ts-ignore
let lensflare = new THREE.Lensflare();
// @ts-ignore
lensflare.addElement(new THREE.LensflareElement(textureFlare0, 240, 0, light.color));
// @ts-ignore
lensflare.addElement(new THREE.LensflareElement(textureFlare3, 60, 0.1, light.color));
// @ts-ignore
lensflare.addElement(new THREE.LensflareElement(textureFlare3, 70, 0.2, light.color));
// @ts-ignore
lensflare.addElement(new THREE.LensflareElement(textureFlare3, 120, 0.3, light.color));
// @ts-ignore
lensflare.addElement(new THREE.LensflareElement(textureFlare3, 70, 0.4, light.color));
light.add(lensflare);

let target = new THREE.Object3D();
target.position.set(0, 0, 0);
light.target = target;

// // 增加环境光
// let ambientLight = new THREE.AmbientLight('#ffffff', 0.5); // soft white light
// scene.add(ambientLight);

// 显示用于简单模拟3个坐标轴的对象
let axes = new THREE.AxesHelper(20);
scene.add(axes);

// 添加一个平面几何
let planeGeometry = new THREE.PlaneGeometry(80, 80);
let planeMaterial = new THREE.MeshPhysicalMaterial({color: '#cccccc'});
let plane = new THREE.Mesh(planeGeometry, planeMaterial);

plane.rotation.x = -0.5 * Math.PI;
plane.position.x = 5;
plane.position.y = 0;
plane.position.z = 0;
plane.receiveShadow = true;
scene.add(plane);


// 自定义几何
let vertices = [
    new THREE.Vector3(0, 3, 0),
    new THREE.Vector3(0, 0, -2),
    new THREE.Vector3(-2, 0, 0),
    new THREE.Vector3(0, 0, 2),
    new THREE.Vector3(2, 0, 0),
    new THREE.Vector3(0, -3, 0)
];

let faces = [
    new THREE.Face3(0, 1, 2),
    new THREE.Face3(0, 2, 3),
    new THREE.Face3(0, 3, 4),
    new THREE.Face3(0, 4, 1),

    new THREE.Face3(5, 2, 1),
    new THREE.Face3(5, 3, 2),
    new THREE.Face3(5, 4, 3),
    new THREE.Face3(5, 1, 4)
];

let geom = new THREE.Geometry();
geom.vertices = vertices;
geom.faces = faces;
geom.computeFaceNormals();
let geomMaterial = new THREE.MeshLambertMaterial({color: 0xcccccc});
let customGeom = new THREE.Mesh(geom, geomMaterial);
customGeom.position.set(-10, 4, 0);
customGeom.castShadow = true;
scene.add(customGeom);

let clonedCustomGeom = customGeom.geometry.clone();
let clonedCustomGeomMaterial = new THREE.MeshPhysicalMaterial({color: 0xcccccc});
let clonedCustomGeomObj = new THREE.Mesh(clonedCustomGeom, clonedCustomGeomMaterial);
clonedCustomGeomObj.position.set(-10, 4, 6);
clonedCustomGeomObj.castShadow = true;
scene.add(clonedCustomGeomObj);


// 添加一个球体
let sphereGeometry = new THREE.SphereGeometry(2, 40, 40);
let sphereMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});
let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.x = 5;
sphere.position.y = 5;
sphere.position.z = -5;
sphere.castShadow = true;
scene.add(sphere);

// 添加一个多材质球体
let sphereGeometry2 = new THREE.SphereGeometry(5, 24, 24);
let sphereMaterial2 = new THREE.MeshPhysicalMaterial({color: 0xff0000});
let sphereMaterial3 = new THREE.MeshDepthMaterial({wireframe: true});
// @ts-ignore

let sphere2 = new THREE.Group();
let materials = [sphereMaterial2, sphereMaterial3];
for (let i of materials) {
    let m = new THREE.Mesh(sphereGeometry2, i);
    m.castShadow = true;
    sphere2.add(m);
}
// let sphere2 = new THREE.Mesh(sphereGeometry2, sphereMaterial2)
sphere2.position.set(5, 5, 5);
sphere2.castShadow = true;
scene.add(sphere2);
// console.log(THREE.SceneUtils);


// 增加半球光
let hemisphereLight = new THREE.HemisphereLight('#93d7ff', '#ffdac2', 0.5);
hemisphereLight.position.set(0, 20, 0);
scene.add(hemisphereLight);
let hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 5);
scene.add(hemisphereLightHelper);

// 增加环境光
let ambientLight = new THREE.AmbientLight('#ff99aa', 0.5);
scene.add(ambientLight);


// 设定相机位置、渲染图像
camera.position.x = -40;
camera.position.y = 40;
camera.position.z = 40;
camera.lookAt(scene.position);
renderer.render(scene, camera);

rendererScene();

function rendererScene() {
    stats.begin();

    customGeom.rotation.y += 0.04;
    clonedCustomGeomObj.rotation.y += 0.04;
    setPosition();
    stats.end();
    requestAnimationFrame(rendererScene);
    renderer.render(scene, camera);
}


function setPosition() {
    hemisphereLight.position.set(controls.x, controls.y, controls.z);
}


