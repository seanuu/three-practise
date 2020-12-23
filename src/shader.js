import * as THREE from "three";

if (WEBGL.isWebGLAvailable() === false) {
    document.body.appendChild(WEBGL.getWebGLErrorMessage());
}
var renderer, scene, camera, stats;
var sphere, length1;
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
init();
animate();

function init() {
    camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 1, 10000);
    camera.position.z = 300;
    scene = new THREE.Scene();
    var radius = 100, segments = 68, rings = 38;
    var vertices1 = new THREE.SphereGeometry(radius, segments, rings).vertices;
    var vertices2 = new THREE.BoxGeometry(0.8 * radius, 0.8 * radius, 0.8 * radius, 10, 10, 10).vertices;
    length1 = vertices1.length;
    var vertices = vertices1.concat(vertices2);

    var positions = new Float32Array(vertices.length * 3);
    var colors = new Float32Array(vertices.length * 3);
    var sizes = new Float32Array(vertices.length);
    var vertex;

    var color = new THREE.Color();
    for (var i = 0, l = vertices.length; i < l; i++) {
        vertex = vertices[i];
        vertex.toArray(positions, i * 3);
        if (i < length1) {
            color.setHSL(0.01 + 0.1 * (i / length1), 0.99, (vertex.y + radius) / (4 * radius));
        } else {
            color.setHSL(0.6, 0.75, 0.25 + vertex.y / (2 * radius));
        }
        color.toArray(colors, i * 3);
        sizes[i] = i < length1 ? 10 : 40;
    }

    var geometry = new THREE.BufferGeometry();
    geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.addAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));
    //
    var texture = new THREE.TextureLoader().load("textures/sprites/disc.png");
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    var material = new THREE.ShaderMaterial({
        uniforms: {
            amplitude: {value: 1.0},
            color: {value: new THREE.Color(0xffffff)},
            texture: {value: texture}
        },
        vertexShader: document.getElementById('vertexshader').textContent,
        fragmentShader: document.getElementById('fragmentshader').textContent,
        transparent: true
    });
    //
    sphere = new THREE.Points(geometry, material);
    scene.add(sphere);
    //
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(WIDTH, HEIGHT);
    var container = document.getElementById('container');
    container.appendChild(renderer.domElement);
    stats = new Stats();
    container.appendChild(stats.dom);
    //
    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function sortPoints() {
    var vector = new THREE.Vector3();
    // Model View Projection matrix
    var matrix = new THREE.Matrix4();
    matrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    matrix.multiply(sphere.matrixWorld);
    //
    var geometry = sphere.geometry;
    var index = geometry.getIndex();
    var positions = geometry.getAttribute('position').array;

    var length = positions.length / 3;

    if (index === null) {
        var array = new Uint16Array(length);
        for (var i = 0; i < length; i++) {
            array[i] = i;
        }
        index = new THREE.BufferAttribute(array, 1);
        geometry.setIndex(index);
    }

    var sortArray = [];
    for (var i = 0; i < length; i++) {
        vector.fromArray(positions, i * 3);
        vector.applyMatrix4(matrix);
        sortArray.push([vector.z, i]);
    }

    function numericalSort(a, b) {
        return b[0] - a[0];
    }

    sortArray.sort(numericalSort);
    var indices = index.array;
    for (var i = 0; i < length; i++) {
        indices[i] = sortArray[i][1];
    }
    geometry.index.needsUpdate = true;
}

function animate() {
    requestAnimationFrame(animate);
    render();
    stats.update();
}

function render() {
    var time = Date.now() * 0.005;
    sphere.rotation.y = 0.02 * time;
    sphere.rotation.z = 0.02 * time;
    var geometry = sphere.geometry;
    var attributes = geometry.attributes;
    for (var i = 0; i < attributes.size.array.length; i++) {
        if (i < length1) {
            attributes.size.array[i] = 16 + 12 * Math.sin(0.1 * i + time);
        }
    }
    attributes.size.needsUpdate = true;
    sortPoints();
    renderer.render(scene, camera);
}
