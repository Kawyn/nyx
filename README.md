# NYX
JavaScript framework that facilitates working with fragment shaders.

## Instalation
```html
<script src="https://kawyn.github.io/nyx/src/index.js"> </script>
```

## Setup
Create canvas using nyx (note that height is optional):
```js
const nyx = new Nyx('your-superb-name', width, height);
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
      
      <script src="https://kawyn.github.io/nyx/src/index.js"> </script>
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
          new Nyx('your-superb-name', 250);
      </script>
  </body>
</html>
```

## Examples
- [metaballs](https://kawyn.github.io/nyx/docs/examples/metaballs.html)


## Docs
Properties
---
`.canvas` - canvas object <br />
`.ctx` - WebGL context of canvas <br />

`.settings.refresh` - when true, the canvas will be automatically refreshed every `settings.interval` miliseconds <br />
`.settings.interval`- number of miliseconds between refreshs <br />

`.uniforms.u_start_time` - start time <br >
`.uniforms.u_time` - time from start in seconds <br >
`.uniforms.u_resolution` - resolution of canvas in pixels <br >

`.textures` - TODO

Methods
---
`.refresh()` - refresh canvas <br />
`.uniforms.new(name, type, value)` - create new uniform given [type](https://webglfundamentals.org/webgl/lessons/webgl-shaders-and-glsl.html#uniforms) where value is constant or function which returns value <br />
`.uniforms.set(name, value)` - update existing uniform
