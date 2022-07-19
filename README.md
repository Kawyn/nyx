JavaScript framework that facilitates working with fragment shaders.

## Instalation

```html
<script src="https://kawyn.github.io/nyx/lib/main.min.js"></script>
```

## Setup

Create canvas using nyx (note that height is optional):

```js
const nyx = new Nyx("your-superb-name", width, height);
```

The canvas will look like this: <br />

<p align="center">
  <img src="https://user-images.githubusercontent.com/51327713/120539723-28d7ea80-c3e8-11eb-933e-7675815aade3.png"/>
</p>

To use custom shaders create a `<script>` with type "nyx-fragment" before calling `new Nyx()`:

```html
<script type="nyx-fragment" name="your-superb-name">
    // Your shader code goes here
</script>
```

## Template

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
        <title>template</title>

        <script src="https://kawyn.github.io/nyx/lib/main.min.js"></script>
        <script type="nyx-fragment" name="your-superb-name">
            precision mediump float;

            uniform float u_time;
            uniform vec2 u_resolution;

            void main() {

                vec2 xy =  gl_FragCoord.xy / u_resolution.xy;
                gl_FragColor = vec4(xy.x, xy.y, sin(u_time), 1.);
            }
        </script>
    </head>

    <body>
        <script>
            new Nyx("your-superb-name", 250);
        </script>
    </body>
</html>
```

## Examples

-   [metaballs](https://kawyn.github.io/nyx/docs/examples/metaballs.html)

##

## Properties

| Property              | Default Value | Description                                            |
| --------------------- | :-----------: | ------------------------------------------------------ |
| canvas                | C\*           | Canvas object.                                         |
| ctx                   | C\*           | WebGL context of canvas.                               |
| settings.refresh      | true          | When true, the canvas will be automatically refreshed. |
| settings.interval     | 16.667        | Number of miliseconds between refreshs.                |
| uniforms.u_start_time | C\*           | Start time                                             |
| uniforms.u_time       | 0             | Time from start in seconds.                            |
| uniforms.u_resolution | C\*           | Resolution of canvas in pixels.                        |

\*Defined in constructor.

## Methods

```js
/**
 * Creates new uniform (chainable).
 * @param {string} name Name of uniform.
 * @param {string} type Type of uniform.
 * @param {any} value Constant of function which returns value.
 */
uniforms.new(name, type, value);

/**
 * Updates value of existing uniform (chainable).
 * @param {string} name Name of uniform.
 * @param {any} value New value of uniform.
 */
uniforms.set(name, value);

/**
 * Refresh canvas with new values of uniforms.
 */
refresh();
```
