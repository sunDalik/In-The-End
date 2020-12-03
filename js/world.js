import * as THREE from "three";
import {Vector3} from "three";
import {destroyObject, world} from "./setup";
import {randomFloat, randomInt} from "./random_utils";
import {Chunk} from "./chunk";
import {removeObjectFromArray} from "./utils";

export class World extends THREE.Scene {
    constructor() {
        super();

        this.currentPlayerLightFrame = 0;
        this.framesUntilPlayerLightUpdate = 0;
        this.chunks = [];
        this.renderDistance = 3;
        this.destructionDistance = this.renderDistance * 2;
    }

    init(player) {
        this.distance = 0;
        this.player = player;
        world.add(player);
        this.player.update();

        this.initLighting();
        this.update();
    }

    initLighting() {
        this.playerLight = new THREE.SpotLight(0xFFFFFF, 1.4, 11);
        this.playerLight.position.x = this.player.position.x;
        this.playerLight.position.z = this.player.position.z;
        this.playerLight.position.y = this.player.position.y + 14;
        this.playerLight.castShadow = true;
        this.playerLight.shadow.mapSize.width = 1024;
        this.playerLight.shadow.mapSize.height = 1024;
        world.add(this.playerLight.target);
        this.playerLight.angle = Math.PI / 5.5;
        this.playerLight.penumbra = 0.1;
        this.add(this.playerLight);
        this.playerLight.offset = new Vector3(0, 0, 0);

        const color = new THREE.Color(0xab9d59);
        this.fog = new THREE.Fog(color, 4, 35);
        this.background = color;

        const ambientLight = new THREE.AmbientLight(color, 0.07);
        world.add(ambientLight);
    }

    update() {
        this.currentPlayerLightFrame++;
        if (this.currentPlayerLightFrame >= this.framesUntilPlayerLightUpdate) {
            this.currentPlayerLightFrame = 0;
            this.framesUntilPlayerLightUpdate = randomInt(4, 8);
            const offsetEdge = 0.2;
            this.playerLight.offset.x = randomFloat(-offsetEdge, offsetEdge);
            this.playerLight.offset.z = randomFloat(-offsetEdge, offsetEdge);
            this.playerLight.offset.y = randomFloat(-offsetEdge, offsetEdge);
        }

        const playerWorldDir = new Vector3();
        this.player.getWorldDirection(playerWorldDir);
        const forwardTiltMul = 2.2;
        this.playerLight.position.lerp(new Vector3(this.player.position.x - playerWorldDir.x * forwardTiltMul + this.playerLight.offset.x, this.player.position.y + 7 + this.playerLight.offset.y, this.player.position.z - playerWorldDir.z * forwardTiltMul + this.playerLight.offset.z), 0.05);
        this.playerLight.target.position.x = this.playerLight.position.x;
        this.playerLight.target.position.z = this.playerLight.position.z;
        requestAnimationFrame(() => this.update());
    }

    loadChunks(from) {
        const chunkCheckList = this.initChunkCheckList(this.renderDistance, from);
        for (const chunkCheck of chunkCheckList) {
            const createdChunk = this.chunks.find(chunk => chunk.chunkTile.x === chunkCheck.x && chunk.chunkTile.z === chunkCheck.z);
            if (!createdChunk) {
                this.createChunk(chunkCheck.x, chunkCheck.z);
            }
        }
        this.cleanUpChunks(from);
    }

    initChunkCheckList(distance, origin) {
        const chunkCheckList = [];
        for (let x = -distance; x <= distance; x++) {
            for (let z = -distance; z <= distance; z++) {
                const tile = {x: x + origin.x, z: z + origin.z};
                if (tile.x === 0) tile.x += Math.sign(x);
                if (tile.z === 0) tile.z += Math.sign(z);
                chunkCheckList.push(new Vector3(tile.x, 0, tile.z));
            }
        }
        return chunkCheckList;
    }

    createChunk(x, z) {
        const chunk = new Chunk(x, z);
        chunk.init(this, this.player);
        this.chunks.push(chunk);
    }

    cleanUpChunks(from) {
        for (let i = this.chunks.length - 1; i >= 0; i--) {
            const chunk = this.chunks[i];
            //???? not sure...
            let xdist = Math.abs(chunk.chunkTile.x - from.x);
            if (Math.sign(chunk.chunkTile.x) !== Math.sign(from).x) xdist -= 1;

            let zdist = Math.abs(chunk.chunkTile.z - from.z);
            if (Math.sign(chunk.chunkTile.z) !== Math.sign(from).z) zdist -= 1;

            if (xdist >= this.destructionDistance || zdist >= this.destructionDistance) {
                removeObjectFromArray(chunk, this.chunks);
                destroyObject(chunk);
            }
        }
    }
}