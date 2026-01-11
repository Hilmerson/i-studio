import { Renderer, Camera, Transform, Plane, Program, Mesh, Texture, Vec2, Vec4 } from 'ogl';
import gsap from 'gsap';

const vertex = `
    attribute vec3 position;
    attribute vec2 uv;
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uHover;
    varying vec2 vUv;
    
    void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
    }
`;

const fragment = `
    precision highp float;
    uniform sampler2D tMap;
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uHover;
    uniform vec2 uResolution;
    uniform float uRatio;
    varying vec2 vUv;

    void main() {
        vec2 uv = vUv;
        
        // Mouse distortion logic
        vec2 center = uv - uMouse;
        center.x *= uRatio; 
        
        float dist = length(center);
        float strength = smoothstep(0.4, 0.0, dist) * uHover; // Increased radius slightly
        
        vec2 wave = center * strength * 0.3; // STRONGER distortion
        
        // Liquid flow
        float liquid = sin(uv.y * 12.0 + uTime * 0.8) * 0.002;
        
        vec2 distortedUv = uv - wave;
        distortedUv.x += liquid;
        
        // B&W Filter with high contrast
        vec4 color = texture2D(tMap, distortedUv);
        float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
        // Contrast curve
        float contrast = 1.2;
        gray = (gray - 0.5) * contrast + 0.5;
        
        gl_FragColor = vec4(vec3(gray), 1.0);
    }
`;

export function initHeroLiquid() {
    const container = document.querySelector('#hero-gl-container');
    if (!container) return;

    const renderer = new Renderer({
        alpha: false,
        dpr: Math.min(window.devicePixelRatio, 2)
    });

    const gl = renderer.gl;
    container.appendChild(gl.canvas);

    function resize() {
        const { width, height } = container.getBoundingClientRect();
        renderer.setSize(width, height);
        if (program) {
            program.uniforms.uResolution.value.set(width, height);
            program.uniforms.uRatio.value = width / height;
        }
    }
    window.addEventListener('resize', resize);

    const geometry = new Plane(gl, { width: 2, height: 2 });
    const texture = new Texture(gl);
    const img = new Image();
    // Using a different image or the same one? 
    // Let's use the 'cat_doors' image which is cleaner/simpler, or the interior one.
    // The interior one is nice.
    img.src = '/src/assets/images/hero.png';
    img.onload = () => {
        texture.image = img;
        resize();
    };

    const program = new Program(gl, {
        vertex,
        fragment,
        uniforms: {
            tMap: { value: texture },
            uTime: { value: 0 },
            uMouse: { value: new Vec2(0.5, 0.5) },
            uResolution: { value: new Vec2(1, 1) },
            uRatio: { value: 1 },
            uHover: { value: 0 }
        }
    });

    const mesh = new Mesh(gl, { geometry, program });

    let animationId;
    function update(t) {
        animationId = requestAnimationFrame(update);
        program.uniforms.uTime.value = t * 0.001;
        renderer.render({ scene: mesh });
    }
    animationId = requestAnimationFrame(update);

    // Interaction needs to be relative to the CONTAINER, not window
    const mouse = new Vec2(0.5, 0.5);
    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        mouse.x = (e.clientX - rect.left) / rect.width;
        mouse.y = 1.0 - ((e.clientY - rect.top) / rect.height);

        gsap.to(program.uniforms.uMouse.value, {
            x: mouse.x,
            y: mouse.y,
            duration: 0.5,
            ease: "power2.out"
        });

        gsap.to(program.uniforms.uHover, {
            value: 0.5, // Strong hover
            duration: 0.2,
            overwrite: true
        });
    });

    container.addEventListener('mouseleave', () => {
        gsap.to(program.uniforms.uHover, {
            value: 0,
            duration: 1.0,
            ease: "power2.out"
        });
    });

    resize();
}
