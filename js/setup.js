import * as THREE from "three";
import {drawCube} from "./cube";
import {animateScene} from "./animation";
import {Player} from "./player";

export const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);

export const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const cube = drawCube();
animateScene(cube);

const player = new Player();
player.add(camera);
scene.add(player);

const geometry = new THREE.PlaneGeometry(30, 30);
const material = new THREE.MeshBasicMaterial({color: 0xffff00, side: THREE.FrontSide});
const plane = new THREE.Mesh(geometry, material);
plane.rotateX(-Math.PI / 2);
scene.add(plane);
const playerSize = (new THREE.Box3().setFromObject(player)).getSize();
plane.position.y = player.position.y - playerSize.y/2;

camera.position.y = player.position.y + 3;
camera.position.z = player.position.z + 6;

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});