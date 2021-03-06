/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GameObject = require('../GameObject');

/**
 * Renders this Game Object with the Canvas Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.Blitter#renderCanvas
 * @since 3.0.0
 * @private
 *
 * @param {Phaser.Renderer.Canvas.CanvasRenderer} renderer - A reference to the current active Canvas renderer.
 * @param {Phaser.GameObjects.Blitter} src - The Game Object being rendered in this call.
 * @param {number} interpolationPercentage - Reserved for future use and custom pipelines.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 */
var BlitterCanvasRenderer = function (renderer, src, interpolationPercentage, camera)
{
    if (GameObject.RENDER_MASK !== src.renderFlags || (src.cameraFilter > 0 && (src.cameraFilter & camera._id)))
    {
        return;
    }

    var list = src.getRenderList();

    renderer.setBlendMode(src.blendMode);

    var ctx = renderer.gameContext;
    var cameraScrollX = src.x - camera.scrollX * src.scrollFactorX;
    var cameraScrollY = src.y - camera.scrollY * src.scrollFactorY;

    //  Render bobs
    for (var i = 0; i < list.length; i++)
    {
        var bob = list[i];
        var flip = (bob.flipX || bob.flipY);
        var frame = bob.frame;
        var cd = frame.canvasData;
        var dx = frame.x;
        var dy = frame.y;
        var fx = 1;
        var fy = 1;

        if (!flip)
        {
            renderer.blitImage(dx + bob.x + cameraScrollX, dy + bob.y + cameraScrollY, bob.frame);
        }
        else
        {
            if (bob.flipX)
            {
                fx = -1;
                dx -= cd.dWidth;
            }

            if (bob.flipY)
            {
                fy = -1;
                dy -= cd.dHeight;
            }

            ctx.save();
            ctx.translate(bob.x + cameraScrollX, bob.y + cameraScrollY);
            ctx.scale(fx, fy);
            ctx.drawImage(frame.source.image, cd.sx, cd.sy, cd.sWidth, cd.sHeight, dx, dy, cd.dWidth, cd.dHeight);
            ctx.restore();
        }
    }
};

module.exports = BlitterCanvasRenderer;
