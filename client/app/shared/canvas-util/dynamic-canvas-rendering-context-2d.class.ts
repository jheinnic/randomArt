/**
 * Created by jheinnic on 1/11/17.
 */

export class DynamicCanvasRenderingContext2D implements CanvasRenderingContext2D
{
  public ctx: CanvasRenderingContext2D = null;

  constructor(initialCtx?: CanvasRenderingContext2D) {
    this.ctx = initialCtx;
  }

  get canvas(): HTMLCanvasElement {
    return this.ctx.canvas;
  }

  get fillStyle(): string|CanvasGradient|CanvasPattern { return this.ctx.fillStyle; }

  set fillStyle(value: string|CanvasGradient|CanvasPattern) { this.ctx.fillStyle = value; }

  get font(): string { return this.ctx.font; }

  set font(value: string) { this.ctx.font = value; }

  get globalAlpha(): number { return this.ctx.globalAlpha; }

  set globalAlpha(value: number) { this.ctx.globalAlpha = value; }

  get globalCompositeOperation(): string { return this.ctx.globalCompositeOperation; }

  set globalCompositeOperation(value: string) { this.ctx.globalCompositeOperation = value; }

  get lineCap(): string { return this.ctx.lineCap; }

  set lineCap(value: string) { this.ctx.lineCap = value; }

  get lineDashOffset(): number { return this.ctx.lineDashOffset; }

  set lineDashOffset(value: number) { this.ctx.lineDashOffset = value; }

  get lineJoin(): string { return this.ctx.lineJoin; }

  set lineJoin(value: string) { this.ctx.lineJoin = value; }

  get lineWidth(): number { return this.ctx.lineWidth; }

  set lineWidth(value: number) { this.ctx.lineWidth = value; }

  get miterLimit(): number { return this.ctx.miterLimit; }

  set miterLimit(value: number) { this.ctx.miterLimit = value; }

  get msFillRule(): string { return this.ctx.msFillRule; }

  set msFillRule(value: string) { this.ctx.msFillRule = value; }

  get msImageSmoothingEnabled(): boolean { return this.ctx.msImageSmoothingEnabled; }

  set msImageSmoothingEnabled(value: boolean) { this.ctx.msImageSmoothingEnabled = value; }

  get shadowBlur(): number { return this.ctx.shadowBlur; }

  set shadowBlur(value: number) { this.ctx.shadowBlur = value; }

  get shadowColor(): string { return this.ctx.shadowColor; }

  set shadowColor(value: string) { this.ctx.shadowColor = value; }

  get shadowOffsetX(): number { return this.ctx.shadowOffsetX; }

  set shadowOffsetX(value: number) { this.ctx.shadowOffsetX = value; }

  get shadowOffsetY(): number { return this.ctx.shadowOffsetY; }

  set shadowOffsetY(value: number) { this.ctx.shadowOffsetY = value; }

  get strokeStyle(): string|CanvasGradient|CanvasPattern { return this.ctx.strokeStyle; }

  set strokeStyle(value: string|CanvasGradient|CanvasPattern) { this.ctx.strokeStyle = value; }

  get textAlign(): string { return this.ctx.textAlign; }

  set textAlign(value: string) { this.ctx.textAlign = value; }

  get textBaseline(): string { return this.ctx.textBaseline; }

  set textBaseline(value: string) { this.ctx.textBaseline = value; }

  get mozImageSmoothingEnabled(): boolean { return this.ctx.mozImageSmoothingEnabled; }

  set mozImageSmoothingEnabled(value: boolean) { this.ctx.mozImageSmoothingEnabled = value; }

  get webkitImageSmoothingEnabled(): boolean { return this.ctx.webkitImageSmoothingEnabled; }

  set webkitImageSmoothingEnabled(value: boolean) { this.ctx.webkitImageSmoothingEnabled = value; }

  get oImageSmoothingEnabled(): boolean { return this.ctx.oImageSmoothingEnabled; }

  set oImageSmoothingEnabled(value: boolean) { this.ctx.oImageSmoothingEnabled = value; }

  public beginPath(): void {
    this.ctx.beginPath();
  }

  public clearRect(x: number, y: number, w: number, h: number): void {
    this.ctx.clearRect(x, y, w, h);
  }

  public clip(fillRule?: string): void {
    this.ctx.clip(fillRule);
  }

  public createImageData(imageDataOrSw: number|ImageData, sh?: number): ImageData {
    return this.ctx.createImageData(imageDataOrSw, sh);
  }

  public createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient {
    return this.ctx.createLinearGradient(x0, y0, x1, y1);
  }

  public createPattern(
    image: HTMLImageElement|HTMLCanvasElement|HTMLVideoElement, repetition: string
  ): CanvasPattern {
    return this.ctx.createPattern(image, repetition);
  }

  public createRadialGradient(
    x0: number, y0: number, r0: number, x1: number, y1: number, r1: number
  ): CanvasGradient {
    return this.ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
  }

  public drawImage(
    image: HTMLImageElement|HTMLCanvasElement|HTMLVideoElement, offsetX: number,
    offsetY: number, width?: number, height?: number, canvasOffsetX?: number,
    canvasOffsetY?: number, canvasImageWidth?: number, canvasImageHeight?: number
  ): void {
    this.ctx.drawImage(image, offsetX, offsetY, width, height, canvasOffsetX, canvasOffsetY, canvasImageWidth, canvasImageHeight);
  }

  public fill(fillRule?: string): void {
    this.ctx.fill(fillRule);
  }

  public fillRect(x: number, y: number, w: number, h: number): void {
    this.ctx.fillRect(x, y, w, h);
  }

  public fillText(text: string, x: number, y: number, maxWidth?: number): void {
    this.ctx.fillText(text, x, y, maxWidth);
  }

  public getImageData(sx: number, sy: number, sw: number, sh: number): ImageData {
    this.ctx.getImageData(sx, sy, sw, sh);
    return undefined;
  }

  public getLineDash(): number[] {
    this.ctx.getLineDash();
    return undefined;
  }

  public isPointInPath(x: number, y: number, fillRule?: string): boolean {
    this.ctx.isPointInPath(x, y, fillRule);
    return undefined;
  }

  public measureText(text: string): TextMetrics {
    this.ctx.measureText(text);
    return undefined;
  }

  public putImageData(
    imagedata: ImageData, dx: number, dy: number, dirtyX?: number, dirtyY?: number,
    dirtyWidth?: number, dirtyHeight?: number
  ): void {
    this.ctx.putImageData(imagedata, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight);
  }

  public restore(): void {
    this.ctx.restore();
  }

  public rotate(angle: number): void {
    this.ctx.rotate(angle);
  }

  public save(): void {
    this.ctx.save();
  }

  public scale(x: number, y: number): void {
    this.ctx.scale(x, y);
  }

  public setLineDash(segments: number[]): void {
    this.ctx.setLineDash(segments);
  }

  public setTransform(
    m11: number, m12: number, m21: number, m22: number, dx: number, dy: number
  ): void {
    this.ctx.setTransform(m11, m12, m21, m22, dx ,dy);
  }

  public stroke(): void {
    this.ctx.stroke();
  }

  public strokeRect(x: number, y: number, w: number, h: number): void {
    this.ctx.strokeRect(x, y, w, h);
  }

  public strokeText(text: string, x: number, y: number, maxWidth?: number): void {
    this.ctx.strokeText(text, x, y, maxWidth);
  }

  public transform(
    m11: number, m12: number, m21: number, m22: number, dx: number, dy: number
  ): void {
    this.ctx.transform(m11, m12, m21, m22, dx, dy);
  }

  public translate(x: number, y: number): void {
    this.ctx.translate(x, y);
  }

  public arc(
    x: number, y: number, radius: number, startAngle: number, endAngle: number,
    anticlockwise?: boolean
  ): void {
    this.ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
  }

  public arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void {
    this.ctx.arcTo(x1, y1, x2, y2, radius);
  }

  public bezierCurveTo(
    cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number
  ): void {
    this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
  }

  public closePath(): void {
    this.ctx.closePath();
  }

  public ellipse(
    x: number, y: number, radiusX: number, radiusY: number, rotation: number,
    startAngle: number, endAngle: number, anticlockwise?: boolean
  ): void {
    this.ctx.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise);
  }

  public lineTo(x: number, y: number): void {
    this.ctx.lineTo(x, y);
  }

  public moveTo(x: number, y: number): void {
    this.ctx.moveTo(x, y);
  }

  public quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void {
    this.ctx.quadraticCurveTo(cpx, cpy, x, y);
  }

  public rect(x: number, y: number, w: number, h: number): void {
    this.ctx.rect(x, y, w, h);

  }

}
