import { colorTransform } from '../tools/utility'
import Obj3D from './obj.js';

class Wall  extends Obj3D{
    constructor(GL, obj) {
        console.log(obj.path)
        super();
        this.GL = GL;
        this.gl = GL.gl;
        this.obj = obj = obj || {}
        this.width = obj.thickness || 0.20;
        this.height = obj.height || 3.0;

        var color = colorTransform(obj.color);

        this.verticesColors = new Float32Array([-this.width / 2, +this.height / 2, 0.10, color[0], color[1], color[2], +this.width / 2, +this.height / 2, 0.10, color[0], color[1], color[2], +this.width / 2, -this.height / 2, 0.10, color[0], color[1], color[2], -this.width / 2, -this.height / 2, 0.10, color[0], color[1], color[2], ]);


        this.indices = new Uint8Array([
            0, 1, 2, 0, 2, 3,
        ]);
    }
}


export default Wall;
