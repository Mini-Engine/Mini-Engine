import { ITilemapRenderData, RenderDataType, RenderLocation } from "@angry-pixel/2d-renderer";
import { Vector2 } from "@angry-pixel/math";
import { RenderComponent } from "../../core/Component";
import { ITilemapRenderer, Tileset, TilemapOrientation } from "./TilemapRenderer";
import { Exception } from "../../utils/Exception";

/**
 * TiledTilemapRenderer configuration options
 * @public
 * @category Components
 * @example
 * ```js
 * import TilemapData from "export.json";
 *
 * this.addComponent(TilemapRenderer, {
 *   tileset: {
 *     image: this.assetManager.getImage("image.png"),
 *     width: 3,
 *     tileWidth: 16,
 *     tileHeight: 16,
 *     margin: new Vector2(0, 0),
 *     spacing: new Vector2(0, 0),
 *   }
 *   tiledData: TilemapData,
 *   tilemapLayer: "Layer1",
 *   tileWidth: 16,
 *   tileHeight: 16,
 *   layer: "Tilemap",
 *   orientation: TilemapOrientation.Center,
 *   smooth: false,
 * });
 * ```
 */
export interface TiledTilemapRendererOptions {
    /** Export of the Tiles application in JSON */
    tiledData: TiledTilemap;
    /** The Tiled tilemap layer to render */
    tilemapLayer: string;
    /** The Tileset instance */
    tileset: Tileset;
    /* The width of the tile to render in pixels */
    tileWidth?: number;
    /* The height of the tile to render in pixels */
    tileHeight?: number;
    /** The render layer */
    layer?: string;
    /** Direction in which the tilemap will be rendered. */
    orientation?: TilemapOrientation;
    /** Smoothing pixels (not recommended for pixel art) */
    smooth?: boolean;
}

/**
 * The TiledTilemapRenderer component allows you to render a tile map exported from the Tiled application,
 * using an instance of the TileSet object.
 * @public
 * @category Components
 * @example
 * ```js
 * import TilemapData from "export.json";
 *
 * this.addComponent(TiledTilemapRenderer, {
 *   tileset: {
 *     image: this.assetManager.getImage("image.png"),
 *     width: 3,
 *     tileWidth: 16,
 *     tileHeight: 16,
 *   }
 *   tiledData: TilemapData,
 *   tilemapLayer: "Layer1",
 *   tileWidth: 16,
 *   tileHeight: 16,
 * });
 * ```
 * @example
 * ```js
 * import TilemapData from "export.json";
 *
 * this.addComponent(TilemapRenderer, {
 *   tileset: {
 *     image: this.assetManager.getImage("image.png"),
 *     width: 3,
 *     tileWidth: 16,
 *     tileHeight: 16,
 *     margin: new Vector2(0, 0),
 *     spacing: new Vector2(0, 0),
 *   }
 *   tiledData: TilemapData,
 *   tilemapLayer: "Layer1",
 *   tileWidth: 16,
 *   tileHeight: 16,
 *   layer: "Tilemap",
 *   orientation: TilemapOrientation.Center,
 *   smooth: false,
 * });
 * ```
 */
export class TiledTilemapRenderer extends RenderComponent implements ITilemapRenderer {
    /**
     * Id of tiles separated by commas. The ids start at 1, and increment from left to right,
     * from top to bottom. ID 0 (zero) represents a space with no tile.
     * @readonly
     */
    public tiles: number[] = [];
    /** The width of the tile to render in pixels */
    public tileWidth: number;
    /** The height of the tile to render in pixels */
    public tileHeight: number;
    /**
     * The width of the tilemap in tiles (this is calculated by the component)
     * @readonly
     */
    public width: number;
    /**
     * The height of the tilemap in tiles (this is calculated by the component)
     * @readonly
     */
    public height: number;
    /** Direction in which the tilemap will be rendered (default value TilemapOrientation.Center) */
    public orientation: TilemapOrientation;
    /** Define a color for tinting the tiles */
    public tintColor: string;
    /** Change the opacity between 1 and 0 */
    public opacity: number;
    /**
     * Tilemap width in pixels (this is calculated by the component)
     * @readonly
     */
    public realWidth: number;
    /**
     * Tilemap height in pixels (this is calculated by the component)
     * @readonly
     */
    public realHeight: number;

    private tiledData: TiledTilemap;
    private tiledLayer: TiledLayer;
    private tileset: Tileset;
    private layer: string;
    private smooth?: boolean;

    private tilesetTileIds: number[] = [];
    private chunks: TiledChunk[] = [];
    private scaledTileWidth: number = 0;
    private scaledTileHeight: number = 0;

    private renderData: ITilemapRenderData[] = [];

    protected init({
        tiledData,
        tilemapLayer,
        tileset,
        tileWidth,
        tileHeight,
        layer,
        orientation,
        smooth,
    }: TiledTilemapRendererOptions): void {
        this.tiledData = tiledData;
        this.tileset = tileset;
        this.tileWidth = tileWidth ?? this.tileset.tileWidth * this.gameConfig.spriteDefaultScale.x;
        this.tileHeight = tileHeight ?? this.tileset.tileHeight * this.gameConfig.spriteDefaultScale.y;
        this.layer = layer;
        this.smooth = smooth ?? false;
        this.orientation = orientation ?? TilemapOrientation.Center;

        this.tiledLayer = this.tiledData.layers.find((layer) => layer.name === tilemapLayer);
        if (!this.tiledLayer) throw new Exception("Invalid tilemap layer");

        this.width = this.tiledLayer.width;
        this.height = this.tiledLayer.height;

        this.processTilemap();
    }

    protected update(): void {
        this.updateRenderData();

        this.renderData.forEach((renderData) => this.renderManager.addRenderData(renderData));
    }

    private processTilemap(): void {
        if (this.tiledLayer.visible === true) {
            this.opacity = this.tiledLayer.opacity;
            this.tintColor = this.tiledLayer.tintcolor;

            if (this.tiledData.infinite) {
                this.tiledLayer.chunks
                    .sort((a, b) => a.x - b.x)
                    .sort((a, b) => a.y - b.y)
                    .forEach((chunk) => this.processChunk(chunk));
            } else {
                this.processChunk(this.tiledLayer);
            }
        }

        this.updateRenderData();

        this.tilesetTileIds = []; // free memory
    }

    private processChunk(chunk: TiledChunk | TiledLayer): void {
        const renderData: ITilemapRenderData = {
            type: RenderDataType.Tilemap,
            layer: this.layer ?? this.gameObject.layer,
            location: this.gameObject.ui ? RenderLocation.ViewPort : RenderLocation.WorldSpace,
            position: new Vector2(),
            tileset: this.tileset,
            tilemap: {
                width: chunk.width,
                tileWidth: this.tileWidth,
                tileHeight: this.tileHeight,
            },
            tiles: chunk.data.map((tile) => this.getTilesetTileId(tile)),
            orientation: TilemapOrientation.RightDown,
            smooth: this.smooth,
        };

        if (chunk.type && chunk.type === "tilelayer") {
            this.tiles = renderData.tiles;
        } else {
            renderData.tiles.forEach((tile, index) => {
                this.tiles[
                    this.tiledLayer.width * (chunk.y + Math.floor(index / chunk.width)) +
                        chunk.x +
                        (index % chunk.width)
                ] = tile;
            });
        }

        this.renderData.push(renderData);
        this.chunks.push(chunk as TiledChunk);
    }

    private getTilesetTileId(tile: number): number {
        if (!this.tilesetTileIds[tile]) {
            this.tilesetTileIds[tile] = this.tiledData.tilesets.reduce(
                (id, tileset) => (tile >= tileset.firstgid ? tile - tileset.firstgid + 1 : id),
                0
            );
        }

        return this.tilesetTileIds[tile];
    }

    private updateRenderData(): void {
        this.scaledTileWidth = this.tileWidth * this.gameObject.transform.scale.x;
        this.scaledTileHeight = this.tileHeight * this.gameObject.transform.scale.y;

        this.realWidth = this.tiledLayer.width * this.scaledTileWidth;
        this.realHeight = this.tiledLayer.height * this.scaledTileHeight;

        this.renderData.forEach((renderData, index) => {
            renderData.layer = this.layer ?? this.gameObject.layer;

            renderData.position.set(
                this.gameObject.transform.position.x +
                    (this.orientation === TilemapOrientation.Center ? -this.realWidth / 2 : 0) +
                    this.chunks[index].x * this.scaledTileWidth,
                this.gameObject.transform.position.y +
                    ([TilemapOrientation.Center, TilemapOrientation.RightCenter].includes(this.orientation)
                        ? this.realHeight / 2
                        : this.orientation == TilemapOrientation.RightUp
                        ? this.realHeight
                        : 0) -
                    this.chunks[index].y * this.scaledTileHeight
            );

            renderData.tilemap.tileWidth = this.scaledTileWidth;
            renderData.tilemap.tileHeight = this.scaledTileHeight;
            renderData.tintColor = this.tintColor;
            renderData.alpha = this.opacity;
        });
    }
}

/** @category Components */
export interface TiledTilemap {
    width: number;
    height: number;
    infinite: boolean;
    layers: TiledLayer[];
    renderorder: string;
    tilesets: { firstgid: number }[];
    tilewidth: number;
    tileheight: number;
}

/** @category Components */
export interface TiledChunk {
    data: number[];
    x: number;
    y: number;
    width: number;
    height: number;
    type?: string;
}

/** @category Components */
export interface TiledLayer {
    name: string;
    id: number;
    chunks?: TiledChunk[];
    data?: number[];
    x: number;
    y: number;
    type: string;
    width: number;
    height: number;
    opacity: number;
    visible: boolean;
    startx?: number;
    starty?: number;
    offsetx?: number;
    offsety?: number;
    tintcolor?: string;
}
