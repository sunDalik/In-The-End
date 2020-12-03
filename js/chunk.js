import * as THREE from "three";
import {loadResource, mtlLoader, objLoader} from "./obj_loader";
import {randomFloat, randomInt} from "./random_utils";

export const chunkSize = 20;

export class Chunk extends THREE.Mesh {
    constructor() {
        const geometry = new THREE.PlaneBufferGeometry(chunkSize, chunkSize);
        const material = new THREE.MeshPhongMaterial({color: 0x96784b, side: THREE.FrontSide});
        super(geometry, material);
        this.receiveShadow = true;
        this.rotateX(-Math.PI / 2);
    }

    init(scene, player) {
        scene.add(this);
        const playerBox = new THREE.Box3().setFromObject(player);
        const playerSize = playerBox.getSize();
        this.position.y = player.position.y - playerSize.y / 2;
        this.putDecorations();
    }

    putDecorations() {
        objLoader.load('models/twig.obj', object => {
            this.add(object);
            object.children[0].material = new THREE.MeshPhongMaterial({color: 0x57503f});
            object.castShadow = true;
            object.receiveShadow = true;
            object.rotateX(Math.PI / 2);
            object.position.x = randomFloat(-(chunkSize - 1) / 2, (chunkSize - 1) / 2);
            object.rotation.y = randomFloat(0, Math.PI * 2);
        });
    }
}