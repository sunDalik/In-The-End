import * as THREE from "three";
import {Vector3} from "three";
import {DIRT_TEXTURE, MODELS} from "./obj_loader";
import {randomFloat, randomInt} from "./random_utils";
import {callTimes, getSize} from "./utils";
import {Falling} from "./falling";
import {FallingCube} from "./falling_cube";

export const chunkSize = 20;

export class Chunk extends THREE.Mesh {
    constructor(x, z, layer) {
        const geometry = new THREE.PlaneBufferGeometry(chunkSize + 0.1, chunkSize + 0.1);
        const material = new THREE.MeshPhongMaterial({color: 0xa37c5f, side: THREE.FrontSide, map: DIRT_TEXTURE});
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
        if (this.layer === -1) return;
        if (this.layer === 0) {
            callTimes(() => this.placeTwig(), randomInt(2, 7));
            callTimes(() => this.placeTwig2(), randomInt(0, 3));
            callTimes(() => this.placeRocks(), randomInt(0, 1));
        } else if (this.layer === 1) {
            callTimes(() => this.placeGrave(), randomInt(2, 4));
            callTimes(() => this.placeBones(), randomInt(2, 4));
        } else if (this.layer === 2) {
            callTimes(() => this.placeRocks(), randomInt(3, 5));
            callTimes(() => this.placeArch(), randomInt(2, 4));
            callTimes(() => this.placeCubes(true), randomInt(0, 2));
        } else {
            callTimes(() => this.placeCubes(), randomInt(2, 4));
            callTimes(() => this.placeFloatingCubes(), randomInt(3, 5));
        }
    }

    placeTwig() {
        let object;
        const material = new THREE.MeshLambertMaterial({color: 0x948666});
        if (Math.random() < 0.16) {
            const geometry = MODELS.twig.clone().geometry;
            object = new Falling(geometry, material);
        } else {
            object = MODELS.twig.clone();
            object.material = material;
        }
        this.add(object);
        object.castShadow = true;
        object.receiveShadow = true;
        this.randomizeObject(object);
        this.randomizeScale(object, 0.6, 1.4);
        if (object.startAnimation) object.startAnimation();
    }

    placeTwig2() {
        let object;
        const material = new THREE.MeshLambertMaterial({color: 0x948666});
        if (Math.random() < 0.2) {
            const geometry = MODELS.twig_2.clone().geometry;
            object = new Falling(geometry, material);
        } else {
            object = MODELS.twig_2.clone();
            object.material = material;
        }
        this.add(object);
        object.castShadow = true;
        object.receiveShadow = true;
        this.randomizeObject(object);
        this.randomizeScale(object, 0.6, 1.4);
        if (object.startAnimation) object.startAnimation();
    }

    placeGrave() {
        let object;
        const material = new THREE.MeshPhongMaterial({color: 0x3f404a});
        if (Math.random() < 0.2) {
            const geometry = Math.random() < 0.5 ? MODELS.grave_cross.clone().geometry : MODELS.grave_broken.clone().geometry;
            object = new Falling(geometry, material, randomInt(35, 45));
        } else {
            object = Math.random() < 0.5 ? MODELS.grave_cross.clone() : MODELS.grave_broken.clone();
            object.material = material;
        }
        this.add(object);
        object.material = new THREE.MeshPhongMaterial({color: 0x3f404a});
        object.castShadow = true;
        object.receiveShadow = true;
        this.randomizeObject(object);
        this.randomizeScale(object, 1.1, 1.3);
        if (object.startAnimation) object.startAnimation();
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

    placeArch() {
        let object;
        const material = new THREE.MeshPhongMaterial({color: 0x8c8673});
        if (Math.random() < 0.2) {
            const geometry = Math.random() < 0.5 ? MODELS.ruins_archway_0.clone().geometry : MODELS.ruins_archway_1.clone().geometry;
            object = new Falling(geometry, material, randomInt(60, 75), randomFloat(5, 20));
        } else {
            object = Math.random() < 0.5 ? MODELS.ruins_archway_0.clone() : MODELS.ruins_archway_1.clone();
            object.material = material;
        }
        this.add(object);
        object.castShadow = true;
        object.receiveShadow = true;
        this.randomizeObject(object);
        this.randomizeScale(object, 1, 1.6);
        if (object.startAnimation) object.startAnimation();
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

    placeCubes(tiny = false) {
        const geometry = new THREE.BoxGeometry();
        const color = 0x939499;
        const material = new THREE.MeshLambertMaterial({color: color});
        const object = new THREE.Mesh(geometry, material);
        this.add(object);
        object.castShadow = true;
        object.receiveShadow = true;
        this.randomizeObject(object);
        if (tiny) this.randomizeScale(object, 0.8, 1.2);
        else this.randomizeScale(object, 1.4, 3);
        object.rotation.x = randomFloat(0, 360);
        object.rotation.z = randomFloat(0, 360);
        if (tiny) object.position.z = randomFloat(0.3, 0.5);
        else object.position.z = randomFloat(0.7, 1);
    }

    placeFloatingCubes() {
        const geometry = new THREE.BoxGeometry();
        const color = 0x60616b;
        const material = new THREE.MeshPhongMaterial({color: color});
        let object;
        if (Math.random() < 0.25) {
            object = new FallingCube(geometry, material);
            object.receiveShadow = true;
        } else {
            object = new THREE.Mesh(geometry, material);
        }
        this.add(object);
        object.castShadow = true;
        this.randomizeObject(object);
        this.randomizeScale(object, 0.8, 1.8);
        object.rotation.x = randomFloat(0, 360);
        object.rotation.z = randomFloat(0, 360);
        object.position.z = randomFloat(6, 11);
        if (object.startAnimation) object.startAnimation();
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