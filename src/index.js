const BACKGROUND_COLOR = [0xCA / 255, 0xA8 / 255, 0xF5 / 255];   // "MYSTICAL GREEN"...

const FRAGMENT_TYPE = 'nyx-fragment';
const FRAGMENT_DEFAULT = `
    precision mediump float;
    
    uniform vec2 u_resolution;

    void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution;
        gl_FragColor = vec4(uv.x, uv.y, 0., 1.);
    }
`;


class Nyx {

    constructor (name, width, height) {

        if (!name) name = 'default';


        width = parseFloat(width);

        if (!width || !isFinite(width))
            throw 'NYX CONSTRUCTOR ERROR: width is not a number';

        height = height ? height : width;


        this.uniforms.set('u_resolution', [width, height]);
        this.uniforms.set('u_start_time', new Date().getTime());


        const canvas = document.createElement('canvas');

        canvas.name = name;
        canvas.width = width;
        canvas.height = height;

        document.body.appendChild(canvas, document.body);

        const ctx = canvas.getContext('webgl');


        if (!ctx)
            throw 'NYX CONSTRUCTOR ERROR: your browser does not support WebGL';


        ctx.clearColor(BACKGROUND_COLOR[0], BACKGROUND_COLOR[1], BACKGROUND_COLOR[2], 1.);
        ctx.clear(ctx.COLOR_BUFFER_BIT | ctx.DEPTH_BUFFER_BIT);

        const program = ctx.createProgram();

        const vShader = ctx.createShader(ctx.VERTEX_SHADER);
        const fShader = ctx.createShader(ctx.FRAGMENT_SHADER);

        ctx.shaderSource(fShader, document.querySelector('script[type="' + FRAGMENT_TYPE + '"][name="' + name + '"]')?.textContent || FRAGMENT_DEFAULT);
        ctx.shaderSource(vShader, `
            attribute vec2 a_position;

            void main() {
                gl_Position = vec4(a_position, 0., 1.);
            }
        `);

        ctx.compileShader(vShader);
        ctx.compileShader(fShader);

        if (!ctx.getShaderParameter(fShader, ctx.COMPILE_STATUS))
            throw 'NYX FRAGMENT SHADER ' + ctx.getShaderInfoLog(fShader);

        ctx.attachShader(program, vShader);
        ctx.attachShader(program, fShader);

        ctx.linkProgram(program);
        ctx.useProgram(program);


        const vBuffer = ctx.createBuffer();
        ctx.bindBuffer(ctx.ARRAY_BUFFER, vBuffer);
        ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array([-1, +1, +0, -1, -1, +0, +1, -1, -0, +1, +1, -0,]), ctx.STATIC_DRAW);

        const iBuffer = ctx.createBuffer();
        ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, iBuffer);
        ctx.bufferData(ctx.ELEMENT_ARRAY_BUFFER, new Uint16Array([3, 2, 1, 3, 1, 0]), ctx.STATIC_DRAW);


        const location = ctx.getAttribLocation(program, 'a_position');

        ctx.vertexAttribPointer(location, 3, ctx.FLOAT, ctx.FALSE, 0, 0);
        ctx.enableVertexAttribArray(location);


        for (let n in this.uniforms) {

            if (typeof this.uniforms[n] === 'function')
                continue;

            this.uniforms[n].location = ctx.getUniformLocation(program, n);
        }

        this.ctx = ctx;
        this.canvas = canvas;
        this.program = program;

        this.refresh();

        if (this.settings.refresh)
            setInterval(this.refresh, this.settings.interval);
    }

    settings = {

        refresh: true,
        interval: 16.667,
    }

    uniforms = {

        'u_start_time': {
            type: '1f',
            value: 0,
        },

        'u_time': {
            type: '1f',
            value: () => { return (new Date().getTime() - this.uniforms['u_start_time'].value) / 1000; },
        },

        'u_resolution': {
            type: '2f',
            value: [0., 0.],
        },

        new: (name, type, value) => {

            this.uniforms[name] = {

                type: type,
                value: value,
            }

            if (this.ctx)
                this.uniforms[name].location = this.ctx.getUniformLocation(this.program, name);

            return this.uniforms;
        },

        set: (name, value) => {

            if (!this.uniforms.hasOwnProperty(name))
                throw 'NYX UNIFORM ERROR: ' + name + ' is undefined';

            this.uniforms[name].value = value;

            return this.uniforms;
        }
    }

    refresh = () => {

        const ctx = this.ctx;

        for (let n in this.uniforms) {

            if (typeof this.uniforms[n] === 'function')
                continue;

            const uniform = this.uniforms[n];
            const value = typeof uniform.value === 'function' ? uniform.value() : uniform.value;

            switch (uniform.type) {

                case '1f':
                    ctx.uniform1f(uniform.location, value);
                    break;
                case '2f':
                    ctx.uniform2fv(uniform.location, value);
                    break;
                case '3f':
                    ctx.uniform3fv(uniform.location, value);
                    break;
                case '4f':
                    ctx.uniform4fv(uniform.location, value);
                    break;

                case '1i':
                    ctx.uniform1i(uniform.location, value);
                    break;
                case '2i':
                    ctx.uniform2iv(uniform.location, value);
                    break;
                case '3i':
                    ctx.uniform3iv(uniform.location, value);
                    break;
                case '4i':
                    ctx.uniform4iv(uniform.location, value);
                    break;

                case '2m':
                    ctx.uniformMatrix2fv(uniform.location, false, value);
                    break;
                case '3m':
                    ctx.uniformMatrix3fv(uniform.location, false, value);
                    break;
                case '4m':
                    ctx.uniformMatrix4fv(uniform.location, false, value);
                    break;

                default:
                    throw 'NYX UNIFORM ERROR: ' + uniform.type + ' is not valid unifrom type in webctx';
            }
        }

        ctx.drawElements(ctx.TRIANGLES, 6, ctx.UNSIGNED_SHORT, 0);
    }
}

const Nyks = Nyx;
