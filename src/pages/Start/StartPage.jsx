import React, { useEffect, useRef, useState, useMemo, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import { supabase } from '../../lib/supabase';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useFBO } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';
import { ThemeSwitch } from '../../components/ThemeSwitch/ThemeSwitch';
import { useTheme } from '../../contexts/ThemeContext';
import './StartPage.css';

// ─── Live stats ────────────────────────────────────────────────────────────────
function useLiveStats() {
    const [stats, setStats] = useState(null);
    useEffect(() => {
        Promise.all([
            supabase.from('profiles').select('*', { count: 'exact', head: true }),
            supabase.from('transitional_plans').select('*', { count: 'exact', head: true }).eq('status', 'arena'),
            supabase.from('votes').select('*', { count: 'exact', head: true }),
        ]).then(([users, plans, votes]) => {
            setStats({ users: users.count ?? 0, plans: plans.count ?? 0, votes: votes.count ?? 0 });
        }).catch(() => {});
    }, []);
    return stats;
}

// ─── Feature data ──────────────────────────────────────────────────────────────
const LEFT_FEATURES = [
    { icon: '🏛', title: { en: 'Transitional Plans', fa: 'طرح‌های انتقالی' }, desc: { en: 'Endorse real frameworks like the Mahsa Charter already active on the Main Stage.', fa: 'طرح‌های واقعی مانند منشور مهسا را بر روی صحنه اصلی تأیید کنید.' } },
    { icon: '🗳', title: { en: 'Amendment Floor', fa: 'کف اصلاحات' }, desc: { en: 'Propose and vote on line-item edits to any active plan in real time.', fa: 'پیشنهاد و رأی‌گیری برای تغییرات خط‌به‌خط در طرح‌های فعال.' } },
    { icon: '🌱', title: { en: 'Plan Incubator', fa: 'پرورشگاه طرح' }, desc: { en: 'New grassroots plans earn a Main Stage spot after 10,000 verified signatures.', fa: 'طرح‌های جدید مردمی پس از ۱۰,۰۰۰ امضای تأیید‌شده به صحنه اصلی می‌رسند.' } },
    { icon: '📈', title: { en: 'Live Consensus', fa: 'اجماع زنده' }, desc: { en: 'Stock-style graphs track daily momentum shifts across all competing plans.', fa: 'نمودارهای سهام‌وار تغییرات روزانه اجماع در تمام طرح‌ها را نشان می‌دهند.' } },
    { icon: '🤝', title: { en: 'Web of Trust', fa: 'شبکه اعتماد' }, desc: { en: 'Join via invite-only codes shared by people you trust — no bots allowed.', fa: 'از طریق کدهای دعوت‌نامه از افراد مورد اعتماد بپیوندید — ربات مجاز نیست.' } },
    { icon: '🔐', title: { en: 'Privacy First', fa: 'اولویت با حریم خصوصی' }, desc: { en: 'No government ID required. Verify freely with institutional email or passkey.', fa: 'نیازی به شناسه دولتی نیست. با ایمیل دانشگاهی یا کلید تأیید کنید.' } },
];

const RIGHT_FEATURES = [
    { icon: '⚖️', title: { en: 'Shadow Cabinet', fa: 'کابینه سایه' }, desc: { en: 'Nominate and elect experts into sector roles using ranked-choice voting.', fa: 'کارشناسان را برای نقش‌های بخشی با رأی‌گیری ترجیحی منصوب و انتخاب کنید.' } },
    { icon: '🌍', title: { en: 'Diaspora Map', fa: 'نقشه دیاسپورا' }, desc: { en: 'See where Iranian voices are concentrated across the globe in real time.', fa: 'ببینید صداهای ایرانی در سراسر جهان کجا متمرکز شده‌اند.' } },
    { icon: '🏆', title: { en: 'Civic Score', fa: 'امتیاز مدنی' }, desc: { en: '3-tier system: higher score means more weight in governance votes.', fa: 'سیستم ۳ سطحی: امتیاز بالاتر یعنی وزن بیشتر در رأی‌گیری‌های حاکمیتی.' } },
    { icon: '🗺', title: { en: 'Blueprint Explorer', fa: 'کاوشگر طرح‌ها' }, desc: { en: 'Compare every proposed system of government side-by-side in detail.', fa: 'هر سیستم پیشنهادی حکومت را به طور مفصل در کنار هم مقایسه کنید.' } },
    { icon: '🔥', title: { en: 'Activity Grid', fa: 'شبکه فعالیت' }, desc: { en: '365-day contribution heatmap on your profile — like GitHub, but for democracy.', fa: 'نقشه حرارتی ۳۶۵ روزه مشارکت در پروفایل شما — مثل گیت‌هاب، برای دموکراسی.' } },
    { icon: '📜', title: { en: 'Permanent Constitution', fa: 'قانون اساسی دائمی' }, desc: { en: 'Phase 2 destination: a ratified post-collapse constitution built from the ground up.', fa: 'مرحله دوم: قانون اساسی دائمی پس از فروپاشی که از پایه ساخته می‌شود.' } },
];

// ─── Shaders ───────────────────────────────────────────────────────────────────
const SIM_VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const SIM_FRAG = `
  varying vec2 vUv;
  uniform sampler2D uCurrentPosition;
  uniform sampler2D uOriginalPosition;
  uniform float uTime;
  uniform float uCurl;
  uniform float uSpeed;

  vec3 snoise(vec3 uv) {
    uv.x += uTime * 0.01;
    float s  = sin(uv.z * 2.1) * 0.2 + cos(uv.y * 3.2) * 0.3 + sin(uv.x * 2.2) * 0.2;
    float c  = cos(uv.z * 2.1) * 0.2 + sin(uv.y * 3.2) * 0.3 + cos(uv.x * 2.2) * 0.2;
    float s2 = sin(uv.y * 1.1) * 0.2 + cos(uv.x * 2.2) * 0.3 + sin(uv.z * 1.2) * 0.2;
    float c2 = cos(uv.y * 1.1) * 0.2 + sin(uv.x * 2.2) * 0.3 + cos(uv.z * 1.2) * 0.2;
    return vec3(s, c, s2 * c2) * uCurl;
  }

  void main() {
    vec3 currentPos  = texture2D(uCurrentPosition,  vUv).xyz;
    vec3 originalPos = texture2D(uOriginalPosition, vUv).xyz;
    vec3 noise = snoise(currentPos * 0.1);
    currentPos += noise * uSpeed;
    gl_FragColor = vec4(currentPos, 1.0);
  }
`;

const RENDER_VERT = `
  uniform sampler2D uPosition;
  uniform float uTime;
  uniform float uIsLight;
  varying vec3 vColor;
  varying float vNormY;

  void main() {
    vec3 pos = texture2D(uPosition, position.xy).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = uIsLight > 0.5 ? 2.8 : 1.5;
    vColor = normalize(pos) * 0.5 + 0.5;
    vNormY = normalize(pos).y;
  }
`;

const RENDER_FRAG = `
  uniform float uIsLight;
  varying vec3 vColor;
  varying float vNormY;

  void main() {
    vec3 color;
    if (uIsLight > 0.5) {
      // Iran flag: green (top) → white (middle) → red (bottom)
      vec3 flagGreen = vec3(0.28,  0.48,  0.68 );
      vec3 flagWhite = vec3(0.48,  0.55,  0.70 );
      vec3 flagRed   = vec3(0.32,  0.42,  0.62 );
      float t = clamp(vNormY * 0.5 + 0.5, 0.0, 1.0);
      if (t > 0.5) {
        color = mix(flagWhite, flagGreen, (t - 0.5) * 2.0);
      } else {
        color = mix(flagRed, flagWhite, t * 2.0);
      }
    } else {
      color = vColor;
    }
    gl_FragColor = vec4(color, 1.0);
  }
`;

// ─── Particle Text Title ───────────────────────────────────────────────────────
class Particle {
    constructor() {
        this.pos = { x: 0, y: 0 };
        this.vel = { x: 0, y: 0 };
        this.acc = { x: 0, y: 0 };
        this.target = { x: 0, y: 0 };
        this.closeEnoughTarget = 100;
        this.maxSpeed = 1.0;
        this.maxForce = 0.1;
        this.isKilled = false;
        this.startColor = { r: 0, g: 0, b: 0 };
        this.targetColor = { r: 0, g: 0, b: 0 };
        this.colorWeight = 0;
        this.colorBlendRate = 0.01;
    }
    move() {
        const dx = this.pos.x - this.target.x;
        const dy = this.pos.y - this.target.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const prox = dist < this.closeEnoughTarget ? dist / this.closeEnoughTarget : 1;
        const tx = this.target.x - this.pos.x;
        const ty = this.target.y - this.pos.y;
        const m = Math.sqrt(tx * tx + ty * ty) || 1;
        const nx = (tx / m) * this.maxSpeed * prox;
        const ny = (ty / m) * this.maxSpeed * prox;
        const sx = nx - this.vel.x;
        const sy = ny - this.vel.y;
        const sm = Math.sqrt(sx * sx + sy * sy) || 1;
        this.acc.x += (sx / sm) * this.maxForce;
        this.acc.y += (sy / sm) * this.maxForce;
        this.vel.x += this.acc.x; this.vel.y += this.acc.y;
        this.pos.x += this.vel.x; this.pos.y += this.vel.y;
        this.acc.x = 0; this.acc.y = 0;
    }
    draw(ctx) {
        if (this.colorWeight < 1.0) this.colorWeight = Math.min(this.colorWeight + this.colorBlendRate, 1.0);
        const r = Math.round(this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight);
        const g = Math.round(this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight);
        const b = Math.round(this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight);
        const alpha = this.isKilled ? Math.max(0, 1 - this.colorWeight) : this.colorWeight;
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.fillRect(this.pos.x, this.pos.y, 2, 2);
    }
    kill(width, height) {
        if (!this.isKilled) {
            const angle = Math.random() * Math.PI * 2;
            const mag = (width + height) / 2;
            this.target.x = width / 2 + Math.cos(angle) * mag;
            this.target.y = height / 2 + Math.sin(angle) * mag;
            this.startColor = {
                r: this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight,
                g: this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight,
                b: this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight,
            };
            this.targetColor = { r: 0, g: 0, b: 0 };
            this.colorWeight = 0;
            this.isKilled = true;
        }
    }
}

function ParticleTitle({ words = ['IranDAO'], isRTL = false, isLight = false }) {
    const canvasRef = useRef(null);
    const stateRef  = useRef({ particles: [], frame: 0, wordIdx: 0, animId: null });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const S = stateRef.current;
        S.particles = []; S.frame = 0; S.wordIdx = 0;

        function resize() {
            const p = canvas.parentElement;
            if (p) { canvas.width = p.clientWidth; canvas.height = p.clientHeight; }
        }

        function showWord(word) {
            const off = document.createElement('canvas');
            off.width = canvas.width; off.height = canvas.height;
            const c2 = off.getContext('2d');
            const fs = Math.min(canvas.width * 0.2, canvas.height * 0.68, 130);
            c2.fillStyle = 'white';
            c2.font = `700 ${fs}px ${isRTL ? '"Vazirmatn",sans-serif' : '"Space Grotesk",Arial,sans-serif'}`;
            c2.textAlign = 'center'; c2.textBaseline = 'middle';
            if (isRTL) c2.direction = 'rtl';
            c2.fillText(word, canvas.width / 2, canvas.height / 2);

            const { data } = c2.getImageData(0, 0, canvas.width, canvas.height);
            const coords = [];
            for (let i = 0; i < data.length; i += 4 * 4) coords.push(i);
            for (let i = coords.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [coords[i], coords[j]] = [coords[j], coords[i]];
            }

            // Find actual text pixel x-bounds so flag stripes span the word, not the full canvas
            let textMinX = canvas.width, textMaxX = 0;
            for (const ci of coords) {
                if (data[ci + 3] <= 0) continue;
                const x = (ci / 4) % canvas.width;
                if (x < textMinX) textMinX = x;
                if (x > textMaxX) textMaxX = x;
            }
            const textSpan = textMaxX - textMinX || 1;

            const ps = S.particles;
            const mag = (canvas.width + canvas.height) / 2;
            let pi = 0;

            for (const ci of coords) {
                if (data[ci + 3] <= 0) continue;
                const tx = (ci / 4) % canvas.width;
                const ty = Math.floor(ci / 4 / canvas.width);
                let p;
                if (pi < ps.length) { p = ps[pi]; p.isKilled = false; pi++; }
                else {
                    p = new Particle();
                    const a = Math.random() * Math.PI * 2;
                    p.pos.x = canvas.width / 2 + Math.cos(a) * mag;
                    p.pos.y = canvas.height / 2 + Math.sin(a) * mag;
                    p.maxSpeed = Math.random() * 6 + 4;
                    p.maxForce = p.maxSpeed * 0.05;
                    p.colorBlendRate = Math.random() * 0.0275 + 0.0025;
                    ps.push(p);
                }
                p.startColor = {
                    r: p.startColor.r + (p.targetColor.r - p.startColor.r) * p.colorWeight,
                    g: p.startColor.g + (p.targetColor.g - p.startColor.g) * p.colorWeight,
                    b: p.startColor.b + (p.targetColor.b - p.startColor.b) * p.colorWeight,
                };
                if (isLight) {
                    // Light mode: plain dark charcoal
                    p.targetColor = { r: 30, g: 30, b: 35 };
                } else {
                    // Dark mode: original gradient across canvas width — unchanged
                    const flagT = canvas.width > 0 ? tx / canvas.width : 0;
                    if (flagT <= 0.5) {
                        const s = flagT * 2;
                        p.targetColor = {
                            r: Math.round(0   + (255 - 0)   * s),
                            g: Math.round(215 + (255 - 215) * s),
                            b: Math.round(30  + (255 - 30)  * s),
                        };
                    } else {
                        const s = (flagT - 0.5) * 2;
                        p.targetColor = {
                            r: Math.round(255 + (240 - 255) * s),
                            g: Math.round(255 * (1 - s)),
                            b: Math.round(255 * (1 - s)),
                        };
                    }
                }
                p.colorWeight = 0;
                p.target.x = tx; p.target.y = ty;
            }
            for (let i = pi; i < ps.length; i++) ps[i].kill(canvas.width, canvas.height);
        }

        function animate() {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const ps = S.particles;
            for (let i = ps.length - 1; i >= 0; i--) {
                ps[i].move(); ps[i].draw(ctx);
                if (ps[i].isKilled && (ps[i].pos.x < 0 || ps[i].pos.x > canvas.width || ps[i].pos.y < 0 || ps[i].pos.y > canvas.height))
                    ps.splice(i, 1);
            }
            S.frame++;
            if (words.length > 1 && S.frame % 260 === 0) {
                S.wordIdx = (S.wordIdx + 1) % words.length;
                showWord(words[S.wordIdx]);
            }
            S.animId = requestAnimationFrame(animate);
        }

        resize();
        showWord(words[0]);
        animate();

        function onResize() { resize(); showWord(words[S.wordIdx]); }
        window.addEventListener('resize', onResize);
        return () => { cancelAnimationFrame(S.animId); window.removeEventListener('resize', onResize); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="sp-particle-title">
            <canvas ref={canvasRef} className="sp-particle-canvas" />
        </div>
    );
}

// ─── 3D Particle Scene ─────────────────────────────────────────────────────────
function ParticleScene({ isLight = false }) {
    const SIZE = 256;
    const { gl } = useThree();
    const pointsRef = useRef(null);

    // useMemo ensures fresh materials on every mount (avoids HMR stale-ref issue)
    const simMat = useMemo(() => new THREE.ShaderMaterial({
        vertexShader: SIM_VERT,
        fragmentShader: SIM_FRAG,
        uniforms: {
            uCurrentPosition:  { value: null },
            uOriginalPosition: { value: null },
            uTime:  { value: 0 },
            uCurl:  { value: 1.5 },
            uSpeed: { value: 0.01 },
        },
    }), []);

    const renderMat = useMemo(() => new THREE.ShaderMaterial({
        vertexShader: RENDER_VERT,
        fragmentShader: RENDER_FRAG,
        uniforms: {
            uPosition: { value: null },
            uTime:     { value: 0 },
            uIsLight:  { value: 0.0 },
        },
    }), []);

    useEffect(() => {
        renderMat.uniforms.uIsLight.value = isLight ? 1.0 : 0.0;
    }, [isLight, renderMat]);

    // FBOs for ping-pong simulation
    const fboOpts = { type: THREE.FloatType, minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter };
    const fbo1 = useFBO(SIZE, SIZE, fboOpts);
    const fbo2 = useFBO(SIZE, SIZE, fboOpts);

    // Reusable simulation scene (created once, not every frame)
    const simSceneRef  = useRef(null);
    const simCameraRef = useRef(null);

    // Initialize particles from TorusKnot geometry
    const { originalPositionTexture, particlePositions } = useMemo(() => {
        const particles = new Float32Array(SIZE * SIZE * 4);
        const geom = new THREE.TorusKnotGeometry(1.2, 0.3, 400, 32);
        const pos  = geom.attributes.position.array;

        for (let i = 0; i < SIZE * SIZE; i++) {
            const i4 = i * 4;
            const pi = (i * 3) % pos.length;
            particles[i4]     = pos[pi];
            particles[i4 + 1] = pos[pi + 1];
            particles[i4 + 2] = pos[pi + 2];
            particles[i4 + 3] = 1.0;
        }
        geom.dispose();

        const tex = new THREE.DataTexture(particles, SIZE, SIZE, THREE.RGBAFormat, THREE.FloatType);
        tex.needsUpdate = true;

        // Blit initial positions into fbo1
        const tmpScene = new THREE.Scene();
        const tmpCam   = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const tmpGeo   = new THREE.PlaneGeometry(2, 2);
        const tmpMat   = new THREE.MeshBasicMaterial({ map: tex });
        const tmpMesh  = new THREE.Mesh(tmpGeo, tmpMat);
        tmpScene.add(tmpMesh);
        gl.setRenderTarget(fbo1);
        gl.render(tmpScene, tmpCam);
        gl.setRenderTarget(null);
        tmpGeo.dispose();
        tmpMat.dispose();

        // UV-space lookup coordinates for each particle
        const uvs = new Float32Array(SIZE * SIZE * 3);
        for (let i = 0; i < SIZE * SIZE; i++) {
            uvs[i * 3]     = (i % SIZE) / SIZE;
            uvs[i * 3 + 1] = Math.floor(i / SIZE) / SIZE;
            uvs[i * 3 + 2] = 0;
        }

        return { originalPositionTexture: tex, particlePositions: uvs };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gl]);

    useFrame(({ gl, clock }) => {
        // Lazy-init reusable sim scene
        if (!simSceneRef.current) {
            simSceneRef.current  = new THREE.Scene();
            simCameraRef.current = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
            const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), simMat);
            simSceneRef.current.add(mesh);
        }

        // Run one simulation step
        simMat.uniforms.uCurrentPosition.value  = fbo1.texture;
        simMat.uniforms.uOriginalPosition.value = originalPositionTexture;
        simMat.uniforms.uTime.value = clock.elapsedTime;

        gl.setRenderTarget(fbo2);
        gl.render(simSceneRef.current, simCameraRef.current);
        gl.setRenderTarget(null);

        // Ping-pong swap
        const tmp  = fbo1.texture;
        fbo1.texture = fbo2.texture;
        fbo2.texture = tmp;

        // Feed result to render pass
        renderMat.uniforms.uPosition.value = fbo1.texture;
        renderMat.uniforms.uTime.value     = clock.elapsedTime;

        // Slow rotation
        if (pointsRef.current) {
            pointsRef.current.rotation.y += 0.001;
            pointsRef.current.rotation.x += 0.0005;
        }
    });

    return (
        <>
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        args={[particlePositions, 3]}
                    />
                </bufferGeometry>
                <primitive object={renderMat} attach="material" />
            </points>
            <EffectComposer>
                <Bloom intensity={0.8} luminanceThreshold={0.05} luminanceSmoothing={0.9} />
            </EffectComposer>
        </>
    );
}

// ─── Horizontal marquee row ────────────────────────────────────────────────────
function FeatureMarquee({ items, reverse }) {
    const { t } = useLang();
    const quadrupled = [...items, ...items, ...items, ...items];

    return (
        <div className={`sp-marquee${reverse ? ' sp-marquee--rev' : ''}`}>
            <div className={`sp-marquee-track${reverse ? ' sp-marquee-track--rev' : ''}`}>
                {quadrupled.map((f, i) => (
                    <div key={i} className="sp-card">
                        <span className="sp-card-icon">{f.icon}</span>
                        <div className="sp-card-body">
                            <div className="sp-card-title">{t(f.title)}</div>
                            <div className="sp-card-desc">{t(f.desc)}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function StartPage() {
    const { isRTL, lang, setLang } = useLang();
    const { theme } = useTheme();
    const navigate = useNavigate();
    const stats    = useLiveStats();
    const heroRef  = useRef(null);

    // GSAP entrance animation for tagline/CTA
    useEffect(() => {
        if (!heroRef.current) return;
        const ctx = gsap.context(() => {
            gsap.timeline()
                .fromTo('.sp-tagline',
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.8 }
                )
                .fromTo('.sp-cta',
                    { scale: 0.85, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.7, ease: 'elastic.out(1, 0.6)' },
                    '-=0.4'
                )
                .fromTo('.sp-hero-sub',
                    { opacity: 0 },
                    { opacity: 1, duration: 0.6 },
                    '-=0.3'
                );
        }, heroRef);
        return () => ctx.revert();
    }, []);

    const particleWords = isRTL
        ? ['متحد', 'سازنده', 'پیشرو']
        : ['UNITE', 'BUILD', 'LEAD'];

    return (
        <div className="sp-root" dir={isRTL ? 'rtl' : 'ltr'}>
            {/* 3D canvas background */}
            <div className="sp-canvas-wrap">
                <Canvas camera={{ position: [0, 0, 4.5], fov: 60 }}>
                    <Suspense fallback={null}>
                        <ParticleScene isLight={theme === 'light'} />
                    </Suspense>
                </Canvas>
            </div>

            {/* Dark vignette overlay */}
            <div className="sp-overlay" />

            {/* Top marquee — LEFT_FEATURES scrolling left */}
            <FeatureMarquee items={LEFT_FEATURES} reverse={false} />

            {/* Hero centre */}
            <div className="sp-hero" ref={heroRef}>
                <div className="sp-eyebrow">
                    <span className="sp-eyebrow-iran">IRAN</span><span className="sp-eyebrow-dao">DAO</span>
                </div>

                <ParticleTitle key={`${lang}-${theme}`} words={particleWords} isRTL={isRTL} isLight={theme === 'light'} />

                <p className="sp-tagline">
                    {isRTL
                        ? 'اتحاد ایرانیان برای تعیین سرنوشت سیاسی خود'
                        : 'Unite the diaspora. Build the future.'}
                </p>

                <button className="sp-cta" onClick={() => navigate('/access-mode')}>
                    {isRTL ? 'شروع مسیر' : 'Begin Your Journey'}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                <div className="sp-hero-sub">
                    <div className="sp-hint">{isRTL ? 'ورود درحال حاضر فقط با کد دعوت' : 'Entry via invite code at the moment'}</div>
                    <div className="sp-bottom-controls">
                        <ThemeSwitch />
                        <div className="sp-lang-inline">
                            <button
                                className={`sp-lang-btn${lang === 'fa' ? ' is-active' : ''}`}
                                onClick={() => setLang('fa')}
                                style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                            >فارسی</button>
                            <button
                                className={`sp-lang-btn${lang === 'en' ? ' is-active' : ''}`}
                                onClick={() => setLang('en')}
                            >EN</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom marquee — RIGHT_FEATURES scrolling right */}
            <FeatureMarquee items={RIGHT_FEATURES} reverse={true} />

        </div>
    );
}
