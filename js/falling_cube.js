import * as THREE from "three";
import {Vector2, Vector3} from "three";
import {world} from "./setup";
import {randomFloat} from "./random_utils";
import {easeInQuart, getSize} from "./utils";

export class FallingCube extends THREE.Mesh {
    constructor(geometry, material) {
        super(geometry, material);
        this.detectionRadius = randomFloat(8, 30);
        this.fallenDown = false;
        this.currentAnimationFrame = 0;
        this.totalAnimationFrames = 0;
    }

    startAnimation() {
        this.initPosition = new Vector3().copy(this.position);
        this.totalAnimationFrames = this.position.z * 3.5;
        this.update();
    }

    update() {
        if (!this.parent) return;
        if (!this.fallenDown) {
            let thisPos = new Vector3();
            let playerPos = new Vector3();
            this.getWorldPosition(thisPos);
            world.player.getWorldPosition(playerPos);
            thisPos = new Vector2(thisPos.x, thisPos.z);
            playerPos = new Vector2(playerPos.x, playerPos.z);
            if (thisPos.distanceTo(playerPos) < this.detectionRadius) {
                this.fallenDown = true;
            }
        }

        if (this.fallenDown && this.currentAnimationFrame < this.totalAnimationFrames) {
            this.position.z = this.initPosition.z - easeInQuart(this.currentAnimationFrame / this.totalAnimationFrames) * (this.initPosition.z + getSize(this).z * 0.25);
            this.currentAnimationFrame++;
        }

        window.requestAnimationFrame(() => this.update());
    }
}