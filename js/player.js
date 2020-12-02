import * as THREE from "three";
import {camera} from "./setup";
import {Vector3} from "three";

export class Player extends THREE.Mesh {
    constructor() {
        const geometry = new THREE.ConeGeometry();
        const material = new THREE.MeshBasicMaterial({color: 0xffffff});
        super(geometry, material);
        this.speed = 0.1;
        this.movingForward = false;
        this.movingBackwards = false;
        this.movingLeft = false;
        this.movingRight = false;
        window.addEventListener("keydown", e => this.onKeyDown(e));
        window.addEventListener("keyup", e => this.onKeyUp(e));
        this.update();
    }

    update() {
        const direction = new Vector3();
        direction.z = this.movingBackwards - this.movingForward;
        direction.x = this.movingRight - this.movingLeft;
        direction.normalize();
        this.position.x += direction.x * this.speed;
        this.position.z += direction.z * this.speed;
        camera.position.x += direction.x * this.speed;
        camera.position.z += direction.z * this.speed;
        window.requestAnimationFrame(() => this.update());
    }

    onKeyDown(e) {
        switch (e.code) {
            case "KeyW":
                this.movingForward = true;
                break;
            case "KeyS":
                this.movingBackwards = true;
                break;
            case "KeyA":
                this.movingLeft = true;
                break;
            case "KeyD":
                this.movingRight = true;
                break;
        }
    }

    onKeyUp(e) {
        switch (e.code) {
            case "KeyW":
                this.movingForward = false;
                break;
            case "KeyS":
                this.movingBackwards = false;
                break;
            case "KeyA":
                this.movingLeft = false;
                break;
            case "KeyD":
                this.movingRight = false;
                break;
        }
    }
}