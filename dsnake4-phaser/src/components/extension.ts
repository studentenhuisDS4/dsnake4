export function getPixelColorAt(image: ImageData, x: number, y: number) {
    return new Phaser.Display.Color(
        image.data[(x + y * image.width) * 4],
        image.data[(x + y * image.width) * 4 + 1],
        image.data[(x + y * image.width) * 4 + 2],
        image.data[(x + y * image.width) * 4 + 3]
    );
}

export function getPixelsData(textureManager: Phaser.Textures.TextureManager, key: string, frame?: string | number | undefined) {

    let textureFrame = textureManager.getFrame(key, frame);
    if (textureFrame) {

        let w = textureFrame.width;
        let h = textureFrame.height;

        // have to create new as _tempCanvas is only 1x1
        let cnv = textureManager.createCanvas('temp', w, h); // CONST.CANVAS, true);
        let ctx = cnv.getContext();

        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(textureFrame.source.image, 0, 0, w, h, 0, 0, w, h);

        let rv = ctx.getImageData(0, 0, w, h);
        return rv;
    }

    return null;
}