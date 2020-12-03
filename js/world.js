import * as THREE from "three";
import {Vector3} from "three";
import {world} from "./setup";

export class World extends THREE.Scene {
    constructor() {
        super();

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

        this.playerLight = new THREE.PointLight(0xFFFFFF, 1.1, 7);
        this.playerLight.castShadow = true;
        this.add(this.playerLight);

        const color = new THREE.Color(0x8e834d);
        this.fog = new THREE.Fog(color, 10, 20);
        this.background = color;
    }

    update() {
        this.playerLight.position.lerp(new Vector3(this.player.position.x, this.player.position.y + 3, this.player.position.z), 0.02);
        requestAnimationFrame(() => this.update());
    }
}