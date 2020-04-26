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

// let image = getPixelsData(this.textures, "logo");
        // console.log("image", image);
        // if (image != null) {
        //     // console.log("image data: ", image.);
        //     // console.log(getPixelColorAt(image, 10, 10));
        //     for (let i = 0; i < Math.min(image.width,CELLS_X); i++) {
        //         for (let j = 0; j < Math.min(image.height,CELLS_Y); j++) {
        //             // This is f'in heavy and inefficient to calculate
        //             const pixelColor = getPixelColorAt(image, i, j);
        //             this.add.rectangle(
        //                 i * this.cellWidth - this.cellWidth / 2,
        //                 j * this.cellHeight - this.cellHeight / 2,
        //                 this.cellWidth - 2, this.cellHeight - 2,
        //                 pixelColor.color32, 0.6);
        //         }
        //     }
        // }