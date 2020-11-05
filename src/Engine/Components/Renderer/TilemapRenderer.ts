import { Rectangle } from "../../Libs/Geometric/Shapes/Rectangle";
import { Tileset } from "../../Tileset";
import { AbstractTilemapRenderer } from "./Tilemap/AbstractTilemapRenderer";

interface Config {
    tileset: Tileset;
    tilemapData: string;
    tileScale: number;
    smooth: boolean;
    alpha: number;
}

const MAX_TILES: number = 999;
const FLIP_H: number = 1; // flip horizontal
const FLIP_V: number = 2; // flip vertical
const FLIP_B: number = 3; // flip both horizontal and vertical

export const TYPE_TILEMAP_RENDERER: string = "TilemapRenderer";

export class TilemapRenderer extends AbstractTilemapRenderer {
    private alpha: number = 1;

    constructor({ tileset, tilemapData, tileScale = 1, smooth = true, alpha = 1 }: Config) {
        super();

        this.type = TYPE_TILEMAP_RENDERER;

        this.tileset = tileset;
        this.tilemapData = tilemapData;
        this.tileScale = tileScale;
        this.smooth = smooth;
        this.alpha = alpha;
    }

    protected processTilemap(): void {
        const rows = this.tilemapData.trim().split("\n");

        rows.forEach((rowData: string, row: number) => {
            const parsedRow: string[] = rowData.split(",");

            parsedRow.forEach((data: string, col: number) => {
                const parsed: number = parseInt(data.trim());

                if (isNaN(parsed) === false) {
                    const id: number = parsed > MAX_TILES ? parsed % 1000 : parsed;
                    const flipDigit: number = Math.round(parsed / 1000);

                    const tile: Rectangle = this.tileset.getTile(id);
                    const flip = { h: [FLIP_H, FLIP_B].includes(flipDigit), v: [FLIP_V, FLIP_B].includes(flipDigit) };

                    if (flipDigit > 0) {
                        console.log(flip);
                    }

                    if (tile !== null) {
                        this.processTile(tile, col, row, this.alpha, flip);
                    }
                }
            });
        });
        this.tilemapProcessed = true;
    }
}
