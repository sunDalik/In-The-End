import * as THREE from "three";
import {Euler, Vector3} from "three";
import {world} from "./setup";
import {randomChoice, randomFloat, randomInt} from "./random_utils";
import {easeInQuart} from "./utils";

export class Falling extends THREE.Mesh {
    constructor(geometry, material, animationTime = randomInt(45, 60), detectionRadius = randomFloat(3, 8)) {
        super(geometry, material);
        this.detectionRadius = detectionRadius;
        this.fallenDown = false;
        this.currentAnimationFrame = 0;
        this.totalAnimationFrames = animationTime;
    }

    startAnimation() {
        this.initRotation = new Euler().copy(this.rotation);
        this.rotationChange = new Euler(Math.PI / 2 * randomChoice([-1, 1]), 0, 0);
        this.update();
    }

    update() {
        if (!this.parent) return;
        if (!this.fallenDown) {
            const thisPos = new Vector3();
            const playerPos = new Vector3();
            this.getWorldPosition(thisPos);
            world.player.getWorldPosition(playerPos);
            if (thisPos.distanceTo(playerPos) < this.detectionRadius) {
                this.fallenDown = true;
            }
        }

        if (this.fallenDown && this.currentAnimationFrame < this.totalAnimationFrames) {
            this.rotation.x = this.initRotation.x + easeInQuart(this.currentAnimationFrame / this.totalAnimationFrames) * this.rotationChange.x;
            this.currentAnimationFrame++;
        }

        window.requestAnimationFrame(() => this.update());
    }
}