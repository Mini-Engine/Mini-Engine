import { RenderComponent } from "../../Component";
import { TextRenderData } from "../../Core/Rendering/RenderData/TextRenderData";
import { RenderManager } from "../../Core/Rendering/RenderManager";
import { container } from "../../Game";

interface Config {
    width: number;
    height: number;
    text: string | string[];
    fontFamily?: string;
    fontUrl?: string;
    size?: number;
    color?: string;
    bold?: boolean;
    italic?: boolean;
    lineSeparation?: number;
}

export const TYPE_TEXT_RENDERER = "TextRenderer";

export class TextRenderer extends RenderComponent {
    public width: number = 0;
    public height: number = 0;
    public text: string | string[] = null;
    public fontFamily: string = "Sans";
    public fontUrl: string = null;
    public size: number = 12;
    public color: string = "#000000";
    public bold: boolean = false;
    public italic: boolean = false;
    public lineSeparation: number = 5;

    private renderManager: RenderManager = container.getSingleton<RenderManager>("RenderManager");
    private renderData: TextRenderData = new TextRenderData();

    constructor(config: Config) {
        super();

        this.type = TYPE_TEXT_RENDERER;

        this.width = config.width;
        this.height = config.height;
        this.text = config.text;
        this.fontFamily = config.fontFamily ?? this.fontFamily;
        this.fontUrl = config.fontUrl ?? this.fontUrl;
        this.size = config.size ?? this.size;
        this.color = config.color ?? this.color;
        this.bold = config.bold ?? this.bold;
        this.italic = config.italic ?? this.italic;
        this.lineSeparation = config.lineSeparation ?? this.lineSeparation;
    }

    protected start(): void {
        if (this.gameObject.ui === false) {
            throw new Error("TextRenderer only can be used on UI GameObjects");
        }

        this.renderData.layer = this.gameObject.layer;
        this.renderData.ui = this.gameObject.ui;
        this.renderData.fontFamily = this.fontFamily;
        this.renderData.fontUrl = this.fontUrl;
        this.renderData.bold = this.bold;
        this.renderData.italic = this.italic;
    }

    protected update(): void {
        if (this.gameObject.ui === false) {
            throw new Error("TextRenderer only can be used on UI GameObjects");
        }

        this.renderData.width = this.width;
        this.renderData.height = this.height;
        this.renderData.text = this.text;
        this.renderData.textSize = this.size;
        this.renderData.color = this.color;
        this.renderData.position.set(this.gameObject.transform.position.x, this.gameObject.transform.position.y);
        this.renderData.lineSeparation = this.lineSeparation;

        this.renderManager.addToRenderStack(this.renderData);
    }
}
