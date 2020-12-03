import * as THREE from "three";
import {Player} from "./player";
import {Chunk, chunkSize} from "./chunk";
import {World} from "./world";
import {loadAll} from "./obj_loader";


export const world = new World();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);

export const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;
document.body.appendChild(renderer.domElement);

//const cube = drawCube();
//animateScene(cube);


window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

const player = new Player(camera);
player.position.x = chunkSize / 2;
player.position.z = chunkSize / 2;

loadAll(() => world.init(player));


export function destroyObject(object) {
    for (let i = object.children.length - 1; i >= 0; i--) {
        const child = object.children[i];
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
        object.remove(child);
    }

    if (object.parent) object.parent.remove(object);
    if (object.geometry) object.geometry.dispose();
    if (object.material) object.material.dispose();
}