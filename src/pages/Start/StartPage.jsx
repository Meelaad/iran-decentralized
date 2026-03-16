import React, { useEffect, useRef, useState, useMemo, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import { supabase } from '../../lib/supabase';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useFBO } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';
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
  uniform sampler2D uOriginalPosition;
  uniform float uTime;
  varying vec3 vColor;

  void main() {
    vec3 pos     = texture2D(uPosition,         position.xy).xyz;
    vec3 origPos = texture2D(uOriginalPosition, position.xy).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = 1.5;

    // Colour pinned to ORIGINAL Y so stripes stay spatially correct as particles swirl.
    // Dividing by 1.5 maps the TorusKnot Y range (~-1.5 to +1.5) to -1..1.
    // Green never blends with Red — they only blend through White in the centre.
    vec3 flagGreen = vec3(0.137, 0.624, 0.251); // #239F40
    vec3 flagWhite = vec3(1.0,   1.0,   1.0  ); // #FFFFFF
    vec3 flagRed   = vec3(0.855, 0.0,   0.0  ); // #DA0000

    float y = clamp(origPos.y / 1.5, -1.0, 1.0);
    if (y > 0.0) {
      vColor = mix(flagWhite, flagGreen, y);
    } else {
      vColor = mix(flagWhite, flagRed, -y);
    }
  }
`;

const RENDER_FRAG = `
  varying vec3 vColor;
  void main() {
    gl_FragColor = vec4(vColor, 1.0);
  }
`;

// ─── 3D Particle Scene ─────────────────────────────────────────────────────────
function ParticleScene() {
    const SIZE = 128;
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
            uPosition:         { value: null },
            uOriginalPosition: { value: null },
            uTime:             { value: 0 },
        },
    }), []);

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
        renderMat.uniforms.uPosition.value         = fbo1.texture;
        renderMat.uniforms.uOriginalPosition.value = originalPositionTexture;
        renderMat.uniforms.uTime.value             = clock.elapsedTime;

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
                <Bloom intensity={0.4} luminanceThreshold={0.4} luminanceSmoothing={0.7} />
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
    const navigate = useNavigate();
    const stats    = useLiveStats();
    const heroRef  = useRef(null);

    // GSAP entrance animation
    useEffect(() => {
        if (!heroRef.current) return;
        const ctx = gsap.context(() => {
            const tl = gsap.timeline();
            tl.fromTo('.sp-title-word',
                { y: 70, opacity: 0 },
                { y: 0, opacity: 1, stagger: 0.12, duration: 1, ease: 'power3.out' }
            )
            .fromTo('.sp-tagline',
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
                '-=0.5'
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

    const titleWords = isRTL
        ? ['اتحاد·', 'ایرانیان·', 'آینده']
        : ['Unite.', 'Build.', 'Lead.'];

    return (
        <div className="sp-root" dir={isRTL ? 'rtl' : 'ltr'}>
            {/* 3D canvas background */}
            <div className="sp-canvas-wrap">
                <Canvas camera={{ position: [0, 0, 4.5], fov: 60 }}>
                    <Suspense fallback={null}>
                        <ParticleScene />
                    </Suspense>
                </Canvas>
            </div>

            {/* Dark vignette overlay */}
            <div className="sp-overlay" />

            {/* Top marquee — LEFT_FEATURES scrolling left */}
            <FeatureMarquee items={LEFT_FEATURES} reverse={false} />

            {/* Hero centre */}
            <div className="sp-hero" ref={heroRef}>
                <div className="sp-eyebrow">IRAN · DAO</div>

                <h1 className="sp-title">
                    {titleWords.map((word, i) => (
                        <span key={i} className="sp-title-word-wrap">
                            <span className="sp-title-word">{word}</span>
                        </span>
                    ))}
                </h1>

                <p className="sp-tagline">
                    {isRTL
                        ? 'اتحاد ایرانیان برای تعیین سرنوشت سیاسی خود'
                        : 'Unite the diaspora. Build the future.'}
                </p>

                <button className="sp-cta" onClick={() => navigate('/choose')}>
                    {isRTL ? 'شروع سفر سیاسی' : 'Begin Your Journey'}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                <div className="sp-hero-sub">
                    <div className="sp-hint">{isRTL ? 'ورود با کد دعوت' : 'Entry via invite code'}</div>
                    {stats && (
                        <div className="sp-stats">
                            <span>{stats.users.toLocaleString()} {isRTL ? 'ایرانی' : 'Iranians'}</span>
                            <span className="sp-stats-dot">·</span>
                            <span>{stats.plans} {isRTL ? 'طرح فعال' : 'active plans'}</span>
                            <span className="sp-stats-dot">·</span>
                            <span>{stats.votes.toLocaleString()} {isRTL ? 'رأی' : 'votes'}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom marquee — RIGHT_FEATURES scrolling right */}
            <FeatureMarquee items={RIGHT_FEATURES} reverse={true} />

            {/* Language switcher */}
            <div className="sp-lang">
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
    );
}
