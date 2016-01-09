import Camera from './camera';
import Plane from './obj/plane';
import Wall from './obj/wall';
import {getWebGLContext, initShaders, createProgram, loadShader} from './tools/utility'
import {VSHADER_SOURCE,FSHADER_SOURCE} from './shaders/default'

class GL {
    constructor (dom) {
        var self = this;

        var renderList = this.renderList = [];

        var canvas = document.getElementById(dom);

        var gl = this.gl = getWebGLContext(canvas);
        // console.log(canvas,gl,'22')
        initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);

        gl.enable(gl.DEPTH_TEST);

        gl.clearColor(0.98, 0.98, 0.98, 1.0);

        //init camear
        self.camera = new Camera(this.gl);

        function draw(){
            gl.clear(gl.COLOR_BUFFER_BIT);
            for (var i in renderList) {
                renderList[i].render();
            }
            requestAnimationFrame(draw);
        }
        requestAnimationFrame(draw);
    }

    Plane (obj) {
        var plane = new Plane(this, obj);
        this.renderList.push(plane);
        return plane;
    }

    Wall (obj) {
        var wall = new Wall(this, obj);
        this.renderList.push(wall);
        return wall;
    }

}
global.GL = GL
