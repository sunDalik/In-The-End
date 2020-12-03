import * as THREE from "three";
import {Vector3} from "three";
import {MODELS, objLoader} from "./obj_loader";
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
        callTimes(() => this.placeTwig(), randomInt(2, 6));
        callTimes(() => this.placeTwig2(), randomInt(0, 2));
        callTimes(() => this.placeGrave(), randomInt(2, 4));
        callTimes(() => this.placeRocks(), randomInt(2, 4));
        callTimes(() => this.placeBones(), randomInt(2, 4));
    }

    placeTwig() {
        const object = MODELS.twig.clone();
        this.add(object);
        object.children[0].material = new THREE.MeshPhongMaterial({color: 0x57503f});
        object.children[0].castShadow = true;
        object.children[0].receiveShadow = true;
        this.randomizeObject(object);
        this.randomizeScale(object, 0.6, 1.4);
    }

    placeTwig2() {
        const object = MODELS.twig_2.clone();
        this.add(object);
        object.children[0].material = new THREE.MeshPhongMaterial({color: 0x57503f});
        object.children[0].castShadow = true;
        object.children[0].receiveShadow = true;
        this.randomizeObject(object);
        this.randomizeScale(object, 0.6, 1.4);
    }

    placeGrave() {
        const object = Math.random() < 0.5 ? MODELS.grave_cross.clone() : MODELS.grave_broken.clone();
        this.add(object);
        object.children[0].material = new THREE.MeshPhongMaterial({color: 0x3f404a});
        object.children[0].castShadow = true;
        object.children[0].receiveShadow = true;
        this.randomizeObject(object);
        this.randomizeScale(object, 1.1, 1.3);
    }

    placeRocks() {
        const object = MODELS.rock_small.clone();
        this.add(object);
        object.children[0].material = new THREE.MeshPhongMaterial({color: 0x605f63});
        object.children[0].castShadow = true;
        object.children[0].receiveShadow = true;
        this.randomizeObject(object);
        this.randomizeScale(object, 0.5, 1.2);
    }

    placeBones() {
        const object = Math.random() < 0.5 ? MODELS.bone_skull.clone() : MODELS.bone_spine.clone();
        this.add(object);
        object.children[0].material = new THREE.MeshPhongMaterial({color: 0xe6e4d5});
        object.children[0].castShadow = true;
        object.children[0].receiveShadow = true;
        this.randomizeObject(object);
        this.randomizeScale(object, 0.35, 1.2);
    }

    randomizeObject(object) {
        object.rotateX(Math.PI / 2);

        object.position.x = randomFloat(-(chunkSize - 2) / 2, (chunkSize - 2) / 2);
        object.position.y = randomFloat(-(chunkSize - 2) / 2, (chunkSize - 2) / 2);
        object.rotation.y = randomFloat(0, Math.PI * 2);
    }

    randomizeScale(object, min, max) {
        object.scale.x = randomFloat(min, max);
        object.scale.y = object.scale.x + randomFloat(-0.15, 0.15);
        object.scale.z = object.scale.x + randomFloat(-0.15, 0.15);

        object.position.z = 0;
    }
}