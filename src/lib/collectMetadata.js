// djb2 hash for strings
function djb2(str) {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) + hash) + str.charCodeAt(i);
        hash |= 0;
    }
    return (hash >>> 0).toString(16);
}

function getCanvasHash() {
    try {
        const canvas = document.createElement('canvas');
        canvas.width = 240; canvas.height = 60;
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = '#f60';
        ctx.fillRect(100, 5, 80, 30);
        ctx.fillStyle = '#069';
        ctx.font = 'bold 14px Arial, sans-serif';
        ctx.fillText('IranDAO', 5, 30);
        ctx.fillStyle = 'rgba(102,204,0,0.6)';
        ctx.font = '12px monospace';
        ctx.fillText('fingerprint', 5, 50);
        return djb2(canvas.toDataURL());
    } catch { return null; }
}

function getWebGLInfo() {
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) return { webgl_vendor: null, webgl_renderer: null };
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        return {
            webgl_vendor: ext ? gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR),
            webgl_renderer: ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER),
        };
    } catch { return { webgl_vendor: null, webgl_renderer: null }; }
}

async function getAudioHash() {
    try {
        const Ctx = window.OfflineAudioContext || window.webkitOfflineAudioContext;
        if (!Ctx) return null;
        const ctx = new Ctx(1, 5000, 44100);
        const osc = ctx.createOscillator();
        const comp = ctx.createDynamicsCompressor();
        osc.connect(comp);
        comp.connect(ctx.destination);
        osc.start(0);
        const buffer = await ctx.startRendering();
        const data = buffer.getChannelData(0);
        let sum = 0;
        for (let i = 0; i < data.length; i++) sum += Math.abs(data[i]);
        return djb2(sum.toFixed(10));
    } catch { return null; }
}

export async function collectMetadata() {
    const [audioHash, webglInfo] = await Promise.all([
        getAudioHash(),
        Promise.resolve(getWebGLInfo()),
    ]);
    return {
        user_agent:     navigator.userAgent?.slice(0, 500),
        language:       navigator.language,
        timezone:       Intl.DateTimeFormat().resolvedOptions().timeZone,
        screen:         `${screen.width}x${screen.height}`,
        color_depth:    screen.colorDepth,
        hardware_cores: navigator.hardwareConcurrency || null,
        device_memory:  navigator.deviceMemory || null,
        platform:       navigator.platform,
        touch_points:   navigator.maxTouchPoints,
        canvas_hash:    getCanvasHash(),
        audio_hash:     audioHash,
        ...webglInfo,
    };
}