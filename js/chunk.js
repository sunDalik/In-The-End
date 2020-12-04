import * as THREE from "three";
import {Vector3} from "three";
import {MODELS} from "./obj_loader";
import {randomFloat, randomInt} from "./random_utils";
import {callTimes, getSize} from "./utils";

export const chunkSize = 20;

export class Chunk extends THREE.Mesh {
    constructor(x, z, layer) {
        const geometry = new THREE.PlaneBufferGeometry(chunkSize + 0.1, chunkSize + 0.1);
        const material = new THREE.MeshPhongMaterial({color: 0xa37c5f, side: THREE.FrontSide});
        super(geometry, material);
        this.receiveShadow = true;
        this.layer = layer;
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
        if (this.layer === 0) {
            callTimes(() => this.placeTwig(), randomInt(2, 7));
            callTimes(() => this.placeTwig2(), randomInt(0, 3));
            callTimes(() => this.placeRocks(), randomInt(0, 1));
        } else if (this.layer === 1) {
            callTimes(() => this.placeGrave(), randomInt(2, 4));
            callTimes(() => this.placeBones(), randomInt(2, 4));
        } else if (this.layer === 2) {
            callTimes(() => this.placeRocks(), randomInt(2, 4));
        } else {

        }
    }

    placeTwig() {
        const object = MODELS.twig.clone();
        this.add(object);
        object.material = new THREE.MeshLambertMaterial({color: 0x948666});
        object.castShadow = true;
        object.receiveShadow = true;
        this.randomizeObject(object);
        this.randomizeScale(object, 0.6, 1.4);
    }

    placeTwig2() {
        const object = MODELS.twig_2.clone();
        this.add(object);
        object.material = new THREE.MeshLambertMaterial({color: 0x948666});
        object.castShadow = true;
        object.receiveShadow = true;
        this.randomizeObject(object);
        this.randomizeScale(object, 0.6, 1.4);
    }

    placeGrave() {
        const object = Math.random() < 0.5 ? MODELS.grave_cross.clone() : MODELS.grave_broken.clone();
        this.add(object);
        object.material = new THREE.MeshPhongMaterial({color: 0x3f404a});
        object.castShadow = true;
        object.receiveShadow = true;
        this.randomizeObject(object);
        this.randomizeScale(object, 1.1, 1.3);
    }

    placeRocks() {
        const object = MODELS.rock_small.clone();
        this.add(object);
        object.material = new THREE.MeshPhongMaterial({color: 0x605f63});
        object.castShadow = true;
        object.receiveShadow = true;
        this.randomizeObject(object);
        this.randomizeScale(object, 0.5, 1.2);
    }

    placeBones() {
        const object = Math.random() < 0.5 ? MODELS.bone_skull.clone() : MODELS.bone_spine.clone();
        this.add(object);
        object.material = new THREE.MeshPhongMaterial({color: 0xe6e4d5});
        object.castShadow = true;
        object.receiveShadow = true;
        this.randomizeObject(object);
        this.randomizeScale(object, 0.35, 1.2);
    }

    placeOrb() {
        const geometry = new THREE.SphereGeometry();
        const color = 0xdb1f57;
        const material = new THREE.MeshPhongMaterial({color: color, flatShading: true});
        const object = new THREE.Mesh(geometry, material);
        this.add(object);
        object.castShadow = true;
        this.randomizeObject(object);
        this.randomizeScale(object, 0.8, 1.2);
        object.position.z = randomFloat(0.4, 0.9);
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