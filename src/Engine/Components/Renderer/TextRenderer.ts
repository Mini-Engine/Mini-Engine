import { RenderComponent } from "../../Component";
import { TextRenderData } from "../../Core/Rendering/RenderData/TextRenderData";
import { RenderManager } from "../../Core/Rendering/RenderManager";
import { container } from "../../Game";

interface Config {
    text: string;
    font: string;
    size: number;
    color: string;
    bold: boolean;
    italic: boolean;
    lineSeparation: number;
    width: number;
    height: number;
}

export const TYPE_TEXT_RENDERER = "TextRenderer";

export class TextRenderer extends RenderComponent {
    public text: string = "";
    public font: string = "Sans";
    public size: number = 12;
    public color: string = "#000000";
    public bold: boolean = false;
    public italic: boolean = false;
    public lineSeparation: number = 5;
    public width: number = 0;
    public height: number = 0;

    private renderManager: RenderManager = container.getSingleton<RenderManager>("RenderManager");
    private renderData: TextRenderData = new TextRenderData();

    constructor({
        width,
        height,
        text = "",
        font = "Sans",
        size = 12,
        color = "#000000",
        bold = false,
        italic = false,
        lineSeparation = 5,
    }: Config) {
        super();

        this.type = TYPE_TEXT_RENDERER;

        this.width = width;
        this.height = height;
        this.text = text;
        this.font = font;
        this.size = size;
        this.color = color;
        this.bold = bold;
        this.italic = italic;
        this.lineSeparation = lineSeparation;
    }

    protected start(): void {
        this.update();
    }

    protected update(): void {
        if (this.gameObject.ui === false) {
            throw new Error("TextRenderer only can be used on UI GameObjects");
        }

        this.renderData.layer = this.gameObject.layer;
        this.renderData.ui = this.gameObject.ui;
        this.renderData.text = this.text;
        this.renderData.textSize = this.size;
        this.renderData.color = this.color;
        this.renderData.font = this.font;
        this.renderData.position.x = this.gameObject.transform.position.x;
        this.renderData.position.y = this.gameObject.transform.position.y;
        this.renderData.lineSeparation = this.lineSeparation;
        this.renderData.bold = this.bold;
        this.renderData.italic = this.italic;

        this.renderManager.addToRenderStack(this.renderData);
    }
}
