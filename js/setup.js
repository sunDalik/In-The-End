import * as THREE from "three";
import {drawCube} from "./cube";
import {animateScene} from "./animation";
import {Player} from "./player";

export const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
scene.add(ambientLight);

export const playerLight = new THREE.PointLight(0xFFFFFF, 1.1, 7);
playerLight.castShadow = true;
scene.add(playerLight);

const color = new THREE.Color(0x8e834d);
scene.fog = new THREE.Fog(color, 10, 20);
scene.background = color;


export const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;
document.body.appendChild(renderer.domElement);

//const cube = drawCube();
//animateScene(cube);

const player = new Player();
player.add(camera);
scene.add(player);

const geometry = new THREE.PlaneGeometry(60, 60);
const material = new THREE.MeshPhongMaterial({color: 0x96784b, side: THREE.FrontSide});
const plane = new THREE.Mesh(geometry, material);
plane.receiveShadow = true;
plane.rotateX(-Math.PI / 2);
scene.add(plane);
const playerSize = (new THREE.Box3().setFromObject(player)).getSize();
plane.position.y = player.position.y - playerSize.y / 2;

playerLight.position.set(player.position.x, player.position.y + 3, player.position.z);

if (true) {
    camera.position.y = player.position.y + 2.5;
    camera.position.z = player.position.z + 3.5;
    camera.rotation.x = -Math.PI / 8;
} else {
    camera.position.y = player.position.y + 2;
    camera.position.z = player.position.z + 5;
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});