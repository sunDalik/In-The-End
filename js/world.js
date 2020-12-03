import * as THREE from "three";
import {Vector3} from "three";
import {world} from "./setup";
import {randomFloat, randomInt} from "./random_utils";
import {Chunk} from "./chunk";

export class World extends THREE.Scene {
    constructor() {
        super();

        this.currentPlayerLightFrame = 0;
        this.framesUntilPlayerLightUpdate = 0;
        this.chunks = [];
        this.renderDistance = 1;
        this.destructionDistance = 3;
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

        const playerWorldDir = new Vector3();
        this.player.getWorldDirection(playerWorldDir);
        this.playerLight.position.lerp(new Vector3(this.player.position.x - playerWorldDir.x * 1.2 + this.playerLight.offset.x, this.player.position.y + 3, this.player.position.z - playerWorldDir.z * 1.2 + this.playerLight.offset.z), 0.04);
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
        this.cleanUpChunks();
    }

    initChunkCheckList(distance, origin) {
        const chunkCheckList = [];
        for (let x = -distance; x <= distance; x++) {
            for (let z = -distance; z <= distance; z++) {
                const tile = {x: x + origin.x, z: z + origin.z};
                if (tile.x === 0 || tile.z === 0) continue;
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

    cleanUpChunks() {

    }
}