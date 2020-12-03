import * as THREE from "three";
import {Vector3} from "three";
import {objLoader} from "./obj_loader";
import {randomFloat, randomInt} from "./random_utils";
import {callTimes, getSize} from "./utils";

export const chunkSize = 20;

export class Chunk extends THREE.Mesh {
    constructor(x, z) {
        const geometry = new THREE.PlaneBufferGeometry(chunkSize, chunkSize);
        const material = new THREE.MeshPhongMaterial({color: 0xa37c5f, side: THREE.FrontSide});
        super(geometry, material);
        this.receiveShadow = true;
        this.rotateX(-Math.PI / 2);
        this.chunkTile = new Vector3(x, 0, z);
        this.placeChunk();
    }

    placeChunk() {
        if (this.chunkTile.x > 0) this.position.x = (this.chunkTile.x - 1) * chunkSize + chunkSize / 2;
        else this.position.x = (this.chunkTile.x + 1) * chunkSize - chunkSize / 2;

        if (this.chunkTile.z > 0) this.position.z = (this.chunkTile.z - 1) * chunkSize + chunkSize / 2;
        else this.position.z = (this.chunkTile.z + 1) * chunkSize - chunkSize / 2;
    }

    init(scene, player) {
        scene.add(this);
        this.position.y = player.position.y - getSize(player).y / 2;
        this.putDecorations();
    }

    putDecorations() {
        callTimes(() => this.placeTwig(), randomInt(1, 4));
    }

    placeTwig() {
        objLoader.load('models/twig.obj', object => {
            this.add(object);
            object.children[0].material = new THREE.MeshPhongMaterial({color: 0x57503f});
            object.castShadow = true;
            object.receiveShadow = true;
            object.rotateX(Math.PI / 2);
            this.randomizeObject(object);
        });
    }

    randomizeObject(object) {
        // rotated
        object.position.x = randomFloat(-(chunkSize - 2) / 2, (chunkSize - 2) / 2);
        object.position.y = randomFloat(-(chunkSize - 2) / 2, (chunkSize - 2) / 2);
        object.rotation.y = randomFloat(0, Math.PI * 2);

        object.scale.x = randomFloat(0.6, 1.4);
        object.scale.y = object.scale.x + randomFloat(-0.15, 0.15);
        object.scale.z = object.scale.x + randomFloat(-0.15, 0.15);

        object.position.z = 0;
    }
}