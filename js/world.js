import * as THREE from "three";
import {Vector3} from "three";
import {world} from "./setup";
import {CameraHelper} from "three";
import {randomFloat, randomInt} from "./random_utils";

export class World extends THREE.Scene {
    constructor() {
        super();

        this.currentPlayerLightFrame = 0;
        this.framesUntilPlayerLightUpdate = 0;
    }

    init(player) {
        this.distance = 0;
        this.player = player;
        world.add(player);
        this.initLighting();
        this.update();
    }

    initLighting() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
        world.add(ambientLight);

        this.playerLight = new THREE.SpotLight(0xFFFFFF, 1, 6);
        this.playerLight.castShadow = true;
        world.add(this.playerLight.target);
        this.playerLight.angle = Math.PI / 4;
        this.add(this.playerLight);
        this.playerLight.offset = new Vector3(0, 0, 0);

        const color = new THREE.Color(0x8e834d);
        this.fog = new THREE.Fog(color, 10, 20);
        this.background = color;
    }

    update() {
        this.currentPlayerLightFrame++;
        if (this.currentPlayerLightFrame >= this.framesUntilPlayerLightUpdate) {
            this.currentPlayerLightFrame = 0;
            this.framesUntilPlayerLightUpdate = randomInt(4, 8);
            const offsetEdge = 0.2;
            this.playerLight.offset.x = randomFloat(-offsetEdge, offsetEdge);
            this.playerLight.offset.z = randomFloat(-offsetEdge, offsetEdge);
        }

        this.playerLight.position.lerp(new Vector3(this.player.position.x - this.player.getWorldDirection().x * 1.2 + this.playerLight.offset.x, this.player.position.y + 3, this.player.position.z - this.player.getWorldDirection().z * 1.2 + this.playerLight.offset.z), 0.04);
        this.playerLight.target.position.x = this.playerLight.position.x;
        this.playerLight.target.position.z = this.playerLight.position.z;
        requestAnimationFrame(() => this.update());
    }
}