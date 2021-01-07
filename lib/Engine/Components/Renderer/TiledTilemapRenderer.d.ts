import { Tileset } from "../../Tileset";
import { TiledTilemap } from "../../Core/Tilemap/TiledTilemap";
import { TilemapRenderer } from "./TilemapRenderer";
interface Config {
    tileset: Tileset;
    tilemapData: TiledTilemap;
    tileScale?: number;
    smooth?: boolean;
}
export declare const TYPE_TILED_RENDERER: string;
export declare class TiledTilemapRenderer extends TilemapRenderer {
    constructor(config: Config);
    protected processTilemap(): void;
    private processChunk;
}
export {};