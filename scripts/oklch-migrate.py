"""
oklch-migrate.py — Replaces all hardcoded brand/neutral hex/rgba color values
across every CSS file with CSS custom properties (var(--clr-*)) or inline oklch().

Run from project root:
    python scripts/oklch-migrate.py [--dry-run]
"""

import re, sys
from pathlib import Path

DRY_RUN = '--dry-run' in sys.argv
ROOT = Path(__file__).parent.parent / 'src'
# Exclude global.css — it IS the token definition file; its comments hold the original hex refs
EXCLUDE = {'global.css'}
css_files = [f for f in ROOT.rglob('*.css') if f.name not in EXCLUDE]

# ── Alpha-to-variable lookup ─────────────────────────────────────────────────
# Maps exact alpha string → CSS variable name (for the purple/green/red families)

ACCENT_VARS = {
    '0.05': 'var(--clr-accent-05)', '0.06': 'var(--clr-accent-05)',
    '0.08': 'var(--clr-accent-08)', '0.07': 'var(--clr-accent-08)',
    '0.1':  'var(--clr-accent-10)', '0.10': 'var(--clr-accent-10)',
    '0.12': 'var(--clr-accent-10)',
    '0.15': 'var(--clr-accent-15)',
    '0.18': 'var(--clr-accent-18)',
    '0.2':  'var(--clr-accent-20)', '0.20': 'var(--clr-accent-20)',
    '0.25': 'var(--clr-accent-25)', '0.28': 'var(--clr-accent-25)',
    '0.3':  'var(--clr-accent-30)', '0.30': 'var(--clr-accent-30)',
    '0.35': 'var(--clr-accent-35)',
    '0.4':  'var(--clr-accent-40)', '0.40': 'var(--clr-accent-40)',
    '0.5':  'var(--clr-accent-50)', '0.50': 'var(--clr-accent-50)',
    '0.6':  'var(--clr-accent-60)', '0.60': 'var(--clr-accent-60)',
    '0.7':  'var(--clr-accent-70)', '0.70': 'var(--clr-accent-70)',
    '1':    'var(--clr-accent)',
}

GREEN_VARS = {
    '0.05': 'var(--clr-green-05)',
    '0.08': 'var(--clr-green-08)',
    '0.1':  'var(--clr-green-10)', '0.10': 'var(--clr-green-10)', '0.12': 'var(--clr-green-10)',
    '0.15': 'var(--clr-green-15)',
    '0.2':  'var(--clr-green-20)', '0.20': 'var(--clr-green-20)',
    '0.25': 'var(--clr-green-25)',
    '0.3':  'var(--clr-green-30)', '0.30': 'var(--clr-green-30)',
    '0.4':  'var(--clr-green-40)', '0.40': 'var(--clr-green-40)',
    '0.5':  'var(--clr-green-50)', '0.50': 'var(--clr-green-50)',
    '0.6':  'var(--clr-green-60)', '0.60': 'var(--clr-green-60)',
    '0.7':  'var(--clr-green-70)', '0.70': 'var(--clr-green-70)',
    '0.8':  'var(--clr-green-80)', '0.80': 'var(--clr-green-80)',
    '0.85': 'var(--clr-green-85)',
    '1':    'var(--clr-green)',
}

RED_VARS = {
    '0.1':  'var(--clr-red-10)', '0.10': 'var(--clr-red-10)',
    '0.15': 'var(--clr-red-15)',
    '0.2':  'var(--clr-red-20)', '0.20': 'var(--clr-red-20)',
    '0.25': 'var(--clr-red-25)',
    '0.3':  'var(--clr-red-30)', '0.30': 'var(--clr-red-30)',
    '0.4':  'var(--clr-red-40)', '0.40': 'var(--clr-red-40)',
    '0.5':  'var(--clr-red-50)', '0.50': 'var(--clr-red-50)',
    '0.6':  'var(--clr-red-60)', '0.60': 'var(--clr-red-60)',
    '1':    'var(--clr-red)',
}

# ── Callback factories ────────────────────────────────────────────────────────

def accent_cb(m):
    a = m.group(1).strip()
    return ACCENT_VARS.get(a, f'oklch(55% 0.23 293 / {a})')

def accent_deep_cb(m):
    a = m.group(1).strip()
    return f'oklch(45% 0.25 293 / {a})'

def green_cb(m):
    a = m.group(1).strip()
    return GREEN_VARS.get(a, f'oklch(59% 0.18 141 / {a})')

def red_cb(m):
    a = m.group(1).strip()
    return RED_VARS.get(a, f'oklch(48% 0.22 28 / {a})')

def amber_cb(m):
    a = m.group(1).strip()
    if a in ('0.3', '0.30'):
        return 'var(--clr-amber-30)'
    return f'oklch(70% 0.18 75 / {a})'

def dark_navy_cb(m):
    a = m.group(1).strip()
    return f'oklch(14% 0.04 280 / {a})'

def bg_cb(m):
    a = m.group(1).strip()
    if a in ('0.92',):
        return 'var(--clr-bg-nav)'
    return f'oklch(8% 0.01 200 / {a})'

def light_bg_cb(m):
    a = m.group(1).strip()
    return f'oklch(98% 0.005 250 / {a})'

def white_cb(m):
    a = m.group(1).strip()
    return f'oklch(100% 0 0 / {a})'

def black_cb(m):
    a = m.group(1).strip()
    return f'oklch(0% 0 0 / {a})'

def bg_panel_cb(m):
    a = m.group(1).strip()
    return f'oklch(10% 0.015 215 / {a})'

def bg_card_cb(m):
    a = m.group(1).strip()
    return f'oklch(11% 0.015 215 / {a})'

def bg_surface_cb(m):
    a = m.group(1).strip()
    return f'oklch(13% 0.02 220 / {a})'

def red_dark_cb(m):
    a = m.group(1).strip()
    return f'oklch(48% 0.22 28 / {a})'

def green_dark_cb(m):
    a = m.group(1).strip()
    return f'oklch(59% 0.18 141 / {a})'

def live_green_cb(m):
    a = m.group(1).strip()
    return f'oklch(42% 0.13 135 / {a})'

def orange_cb(m):
    a = m.group(1).strip()
    return f'oklch(75% 0.18 65 / {a})'

def error_red_cb(m):
    a = m.group(1).strip()
    return f'oklch(62% 0.20 25 / {a})'

def light_warm_cb(m):
    a = m.group(1).strip()
    return f'oklch(99% 0.01 80 / {a})'

def dark_red_cb(m):
    a = m.group(1).strip()
    return f'oklch(40% 0.20 23 / {a})'

def very_dark_cb(m):
    a = m.group(1).strip()
    return f'oklch(7% 0.01 215 / {a})'

def dark_navy2_cb(m):
    a = m.group(1).strip()
    return f'oklch(14% 0.03 215 / {a})'

def bg_deep_cb(m):
    a = m.group(1).strip()
    return f'oklch(10% 0.02 215 / {a})'

def slate_border_cb(m):
    a = m.group(1).strip()
    return f'oklch(50% 0.03 235 / {a})'

def cce3f0_alpha_cb(m):
    a = m.group(1).strip()
    return f'oklch(88% 0.03 220 / {a})'

def purple_overlay_cb(m):
    a = m.group(1).strip()
    return f'oklch(55% 0.18 310 / {a})'

def arch_blue_cb(m):
    a = m.group(1).strip()
    return f'oklch(23% 0.18 268 / {a})'

def accent_mid_cb(m):
    """rgba(124,114,232,α) — mid-purple, close to accent"""
    a = m.group(1).strip()
    return ACCENT_VARS.get(a, f'oklch(55% 0.23 293 / {a})')

def accent_deep2_cb(m):
    """rgba(83,74,183,α) — deep purple, close to accent-deep"""
    a = m.group(1).strip()
    return f'oklch(45% 0.25 293 / {a})'

# ── Pattern list: (compiled_regex, replacement) ──────────────────────────────
# Use strings for static replacements, callables for dynamic alpha handling.

PAT = [
    # ── rgba brand/structural colors ─────────────────────────────────────────
    # Purple (139, 92, 246) — catches ANY alpha
    (re.compile(r'rgba\(\s*139\s*,\s*92\s*,\s*246\s*,\s*([0-9.]+)\s*\)'), accent_cb),
    # Mid-purple (124, 114, 232)
    (re.compile(r'rgba\(\s*124\s*,\s*114\s*,\s*232\s*,\s*([0-9.]+)\s*\)'), accent_mid_cb),
    # Deep purple (83, 74, 183)
    (re.compile(r'rgba\(\s*83\s*,\s*74\s*,\s*183\s*,\s*([0-9.]+)\s*\)'), accent_deep2_cb),
    # Dark purple (124, 58, 237)
    (re.compile(r'rgba\(\s*124\s*,\s*58\s*,\s*237\s*,\s*([0-9.]+)\s*\)'), accent_deep_cb),
    # Green (35, 159, 64)
    (re.compile(r'rgba\(\s*35\s*,\s*159\s*,\s*64\s*,\s*([0-9.]+)\s*\)'), green_cb),
    # Green dark (46, 125, 50) / (46, 125, 82)
    (re.compile(r'rgba\(\s*46\s*,\s*125\s*,\s*(?:50|82)\s*,\s*([0-9.]+)\s*\)'), green_dark_cb),
    # Live indicator green (59, 109, 17)
    (re.compile(r'rgba\(\s*59\s*,\s*109\s*,\s*17\s*,\s*([0-9.]+)\s*\)'), live_green_cb),
    # Red (218, 0, 0)
    (re.compile(r'rgba\(\s*218\s*,\s*0\s*,\s*0\s*,\s*([0-9.]+)\s*\)'), red_cb),
    # Red dark (183, 28, 28) / (211, 47, 47) / (239, 83, 80) — structural only
    (re.compile(r'rgba\(\s*(?:183\s*,\s*28\s*,\s*28|211\s*,\s*47\s*,\s*47)\s*,\s*([0-9.]+)\s*\)'), red_dark_cb),
    # Amber (217, 119, 6)
    (re.compile(r'rgba\(\s*217\s*,\s*119\s*,\s*6\s*,\s*([0-9.]+)\s*\)'), amber_cb),
    # Dark navy (20, 20, 82) — light-mode overlay
    (re.compile(r'rgba\(\s*20\s*,\s*20\s*,\s*82\s*,\s*([0-9.]+)\s*\)'), dark_navy_cb),
    # Near-black bg (1, 3, 3)
    (re.compile(r'rgba\(\s*1\s*,\s*3\s*,\s*3\s*,\s*([0-9.]+)\s*\)'), bg_cb),
    # Dark bg panel variants (7,16,26) / (10,14,21) / (10,16,26)
    (re.compile(r'rgba\(\s*(?:7\s*,\s*16\s*,\s*26|10\s*,\s*14\s*,\s*21|10\s*,\s*16\s*,\s*26)\s*,\s*([0-9.]+)\s*\)'), bg_panel_cb),
    # Dark bg card variants (8,13,22) / (9,14,24) / (10,18,32) / (8,12,20)
    (re.compile(r'rgba\(\s*(?:8\s*,\s*13\s*,\s*22|9\s*,\s*14\s*,\s*24|10\s*,\s*18\s*,\s*32|8\s*,\s*12\s*,\s*20)\s*,\s*([0-9.]+)\s*\)'), bg_card_cb),
    # Dark bg surface variants (13,27,42) / (14,22,36) / (14,19,29) / (15,25,35)
    (re.compile(r'rgba\(\s*(?:13\s*,\s*27\s*,\s*42|14\s*,\s*22\s*,\s*36|14\s*,\s*19\s*,\s*29|15\s*,\s*25\s*,\s*35)\s*,\s*([0-9.]+)\s*\)'), bg_surface_cb),
    # Orange/amber (255, 165, 0) — AdminDraftGuard
    (re.compile(r'rgba\(\s*255\s*,\s*165\s*,\s*0\s*,\s*([0-9.]+)\s*\)'), orange_cb),
    # Error red variants (255,80,80) / (255,100,100)
    (re.compile(r'rgba\(\s*255\s*,\s*(?:80|100)\s*,\s*(?:80|100)\s*,\s*([0-9.]+)\s*\)'), error_red_cb),
    # Light warm white for light-mode cards (255,251,244)
    (re.compile(r'rgba\(\s*255\s*,\s*251\s*,\s*244\s*,\s*([0-9.]+)\s*\)'), light_warm_cb),
    # Dark red for light mode (168,35,42)
    (re.compile(r'rgba\(\s*168\s*,\s*35\s*,\s*42\s*,\s*([0-9.]+)\s*\)'), dark_red_cb),
    # Architecture gradients: very dark (4,8,20)/(5,8,18)/(5,8,22)/(6,8,12)/(7,9,13)/(4,8,14)
    (re.compile(r'rgba\(\s*(?:4\s*,\s*8\s*,\s*(?:14|20)|5\s*,\s*8\s*,\s*(?:18|22)|6\s*,\s*8\s*,\s*12|7\s*,\s*9\s*,\s*13)\s*,\s*([0-9.]+)\s*\)'), very_dark_cb),
    # Architecture blueprint blue overlay (21,40,153)
    (re.compile(r'rgba\(\s*21\s*,\s*40\s*,\s*153\s*,\s*([0-9.]+)\s*\)'), arch_blue_cb),
    # Architecture purple overlay (171,71,188)
    (re.compile(r'rgba\(\s*171\s*,\s*71\s*,\s*188\s*,\s*([0-9.]+)\s*\)'), purple_overlay_cb),
    # GovTree bg overlay (13,31,45)
    (re.compile(r'rgba\(\s*13\s*,\s*31\s*,\s*45\s*,\s*([0-9.]+)\s*\)'), dark_navy2_cb),
    # ConsensusMeter/misc (19,38,50)
    (re.compile(r'rgba\(\s*19\s*,\s*38\s*,\s*50\s*,\s*([0-9.]+)\s*\)'), bg_deep_cb),
    # Architecture overlay (8,12,18) / (8,12,22) / (8,12,28) / (8,14,26)
    (re.compile(r'rgba\(\s*8\s*,\s*(?:12\s*,\s*(?:18|22|28)|14\s*,\s*26)\s*,\s*([0-9.]+)\s*\)'), bg_card_cb),
    # Architecture overlay (9,14,22)
    (re.compile(r'rgba\(\s*9\s*,\s*14\s*,\s*22\s*,\s*([0-9.]+)\s*\)'), bg_card_cb),
    # Slate/blue-grey borders (98,114,138) / (90,103,122) / (84,96,114) / (111,141,178) / (97,121,146) / (120,140,165)
    (re.compile(r'rgba\(\s*(?:98\s*,\s*114\s*,\s*138|90\s*,\s*103\s*,\s*122|84\s*,\s*96\s*,\s*114|111\s*,\s*141\s*,\s*178|97\s*,\s*121\s*,\s*146|120\s*,\s*140\s*,\s*165|143\s*,\s*168\s*,\s*192)\s*,\s*([0-9.]+)\s*\)'), slate_border_cb),
    # Muted grey (90,106,126) — Layout nav/border neutral
    (re.compile(r'rgba\(\s*90\s*,\s*106\s*,\s*126\s*,\s*([0-9.]+)\s*\)'), lambda m: f'oklch(50% 0.025 230 / {m.group(1).strip()})'),
    # CCE3F0 with alpha (204,227,240)
    (re.compile(r'rgba\(\s*204\s*,\s*227\s*,\s*240\s*,\s*([0-9.]+)\s*\)'), cce3f0_alpha_cb),
    # Gold/amber (240,192,96) — layout badge color
    (re.compile(r'rgba\(\s*240\s*,\s*192\s*,\s*96\s*,\s*([0-9.]+)\s*\)'), lambda m: f'oklch(82% 0.10 80 / {m.group(1).strip()})'),
    # Notification red (255,68,68)
    (re.compile(r'rgba\(\s*255\s*,\s*68\s*,\s*68\s*,\s*([0-9.]+)\s*\)'), lambda m: f'oklch(55% 0.22 25 / {m.group(1).strip()})'),
    # Light-red/error (239,154,154) — light red variant
    (re.compile(r'rgba\(\s*239\s*,\s*154\s*,\s*154\s*,\s*([0-9.]+)\s*\)'), lambda m: f'oklch(75% 0.12 28 / {m.group(1).strip()})'),
    # Slate overlay (177,186,196) — light-mode/code overlay
    (re.compile(r'rgba\(\s*177\s*,\s*186\s*,\s*196\s*,\s*([0-9.]+)\s*\)'), lambda m: f'oklch(75% 0.02 225 / {m.group(1).strip()})'),
    # Teal accent (38,222,194) — admin map / IranDAO teal
    (re.compile(r'rgba\(\s*38\s*,\s*222\s*,\s*194\s*,\s*([0-9.]+)\s*\)'), lambda m: f'oklch(79% 0.13 180 / {m.group(1).strip()})'),
    # Success green (105,217,140) — admin used/available
    (re.compile(r'rgba\(\s*105\s*,\s*217\s*,\s*140\s*,\s*([0-9.]+)\s*\)'), lambda m: f'oklch(67% 0.18 155 / {m.group(1).strip()})'),
    # Soft red (229,115,115) — admin error state
    (re.compile(r'rgba\(\s*229\s*,\s*115\s*,\s*115\s*,\s*([0-9.]+)\s*\)'), lambda m: f'oklch(65% 0.16 27 / {m.group(1).strip()})'),
    # Success green (129,199,132) — admin success state
    (re.compile(r'rgba\(\s*129\s*,\s*199\s*,\s*132\s*,\s*([0-9.]+)\s*\)'), lambda m: f'oklch(67% 0.15 145 / {m.group(1).strip()})'),
    # Error red (220,38,38)
    (re.compile(r'rgba\(\s*220\s*,\s*38\s*,\s*38\s*,\s*([0-9.]+)\s*\)'), red_dark_cb),
    # Success teal (16,185,129) — Careers
    (re.compile(r'rgba\(\s*16\s*,\s*185\s*,\s*129\s*,\s*([0-9.]+)\s*\)'), lambda m: f'oklch(67% 0.18 160 / {m.group(1).strip()})'),
    # Dark overlays (16,20,26) / (22,26,35) — Careers card
    (re.compile(r'rgba\(\s*(?:16\s*,\s*20\s*,\s*26|22\s*,\s*26\s*,\s*35)\s*,\s*([0-9.]+)\s*\)'), bg_panel_cb),
    # Mobile nav (10,16,30)
    (re.compile(r'rgba\(\s*10\s*,\s*16\s*,\s*30\s*,\s*([0-9.]+)\s*\)'), bg_panel_cb),
    # BlueprintEditor bg (9,13,19)
    (re.compile(r'rgba\(\s*9\s*,\s*13\s*,\s*19\s*,\s*([0-9.]+)\s*\)'), bg_card_cb),
    # BlueprintEditor border (91,103,120)
    (re.compile(r'rgba\(\s*91\s*,\s*103\s*,\s*120\s*,\s*([0-9.]+)\s*\)'), slate_border_cb),
    # AccessMode overlay (10,15,22)
    (re.compile(r'rgba\(\s*10\s*,\s*15\s*,\s*22\s*,\s*([0-9.]+)\s*\)'), bg_panel_cb),
    # Admin dark overlay (4,8,16)
    (re.compile(r'rgba\(\s*4\s*,\s*8\s*,\s*16\s*,\s*([0-9.]+)\s*\)'), very_dark_cb),
    # WorldDotMap tooltip (1,6,15)
    (re.compile(r'rgba\(\s*1\s*,\s*6\s*,\s*15\s*,\s*([0-9.]+)\s*\)'), bg_cb),
    # ThemeSwitch indigo moon (129,140,248)
    (re.compile(r'rgba\(\s*129\s*,\s*140\s*,\s*248\s*,\s*([0-9.]+)\s*\)'), lambda m: f'oklch(67% 0.17 280 / {m.group(1).strip()})'),
    # ThemeSwitch amber sun (245,158,11)
    (re.compile(r'rgba\(\s*245\s*,\s*158\s*,\s*11\s*,\s*([0-9.]+)\s*\)'), lambda m: f'oklch(78% 0.18 80 / {m.group(1).strip()})'),
    # ThemeSwitch focus ring (99,102,241)
    (re.compile(r'rgba\(\s*99\s*,\s*102\s*,\s*241\s*,\s*([0-9.]+)\s*\)'), lambda m: f'oklch(58% 0.20 280 / {m.group(1).strip()})'),
    # ThemeSwitch slate muted (148,163,184)
    (re.compile(r'rgba\(\s*148\s*,\s*163\s*,\s*184\s*,\s*([0-9.]+)\s*\)'), lambda m: f'oklch(67% 0.03 235 / {m.group(1).strip()})'),
    # Warm white for light mode (255,251,235)
    (re.compile(r'rgba\(\s*255\s*,\s*251\s*,\s*235\s*,\s*([0-9.]+)\s*\)'), lambda m: f'oklch(99% 0.02 95 / {m.group(1).strip()})'),
    # BrandMark cyan (79,195,247)
    (re.compile(r'rgba\(\s*79\s*,\s*195\s*,\s*247\s*,\s*([0-9.]+)\s*\)'), lambda m: f'oklch(76% 0.12 220 / {m.group(1).strip()})'),
    # BrandMark blue (2,132,199)
    (re.compile(r'rgba\(\s*2\s*,\s*132\s*,\s*199\s*,\s*([0-9.]+)\s*\)'), lambda m: f'oklch(52% 0.14 240 / {m.group(1).strip()})'),
    # White overlay (255, 255, 255) — ANY alpha
    (re.compile(r'rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*([0-9.]+)\s*\)'), white_cb),
    # Black overlay (0, 0, 0) — ANY alpha
    (re.compile(r'rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*([0-9.]+)\s*\)'), black_cb),
    # Light bg (248, 250, 252)
    (re.compile(r'rgba\(\s*248\s*,\s*250\s*,\s*252\s*,\s*([0-9.]+)\s*\)'), light_bg_cb),

    # ── Hex brand colors (case-insensitive) ──────────────────────────────────
    (re.compile(r'(?i)#8b5cf6\b'),  'var(--clr-accent)'),
    (re.compile(r'(?i)#7c3aed\b'),  'var(--clr-accent-deep)'),
    (re.compile(r'(?i)#a78bfa\b'),  'var(--clr-accent-soft)'),
    (re.compile(r'(?i)#6d28d9\b'),  'oklch(38% 0.24 293)'),
    (re.compile(r'(?i)#239f40\b'),  'var(--clr-green)'),
    (re.compile(r'(?i)#da0000\b'),  'var(--clr-red)'),
    (re.compile(r'(?i)#d97706\b'),  'var(--clr-amber)'),
    (re.compile(r'(?i)#8fe3ff\b'),  'var(--clr-cyan)'),
    (re.compile(r'(?i)#66d9ff\b'),  'var(--clr-cyan)'),

    # ── Hex structural backgrounds ────────────────────────────────────────────
    (re.compile(r'(?i)#010303\b'),  'var(--clr-bg)'),
    (re.compile(r'(?i)#080d14\b'),  'var(--clr-bg-card)'),
    (re.compile(r'(?i)#0a0f18\b'),  'var(--clr-bg-panel)'),
    (re.compile(r'(?i)#07101a\b'),  'var(--clr-bg-panel)'),
    (re.compile(r'(?i)#0a1220\b'),  'var(--clr-bg-card)'),
    (re.compile(r'(?i)#0a1525\b'),  'var(--clr-bg-card)'),
    (re.compile(r'(?i)#0f1923\b'),  'var(--clr-bg-surface)'),
    (re.compile(r'(?i)#111827\b'),  'var(--clr-bg-surface)'),
    (re.compile(r'(?i)#12151c\b'),  'oklch(11% 0.01 215)'),
    (re.compile(r'(?i)#131e2b\b'),  'var(--clr-border-dim)'),
    (re.compile(r'(?i)#162030\b'),  'var(--clr-bg-elevated)'),
    (re.compile(r'(?i)#1a2530\b'),  'oklch(18% 0.02 215)'),
    (re.compile(r'(?i)#1[Aa]2933\b'), 'oklch(18% 0.02 220)'),
    (re.compile(r'(?i)#1e2a38\b'),  'var(--clr-border)'),
    (re.compile(r'(?i)#2a3040\b'),  'var(--clr-border-bright)'),
    (re.compile(r'(?i)#0d1b2a\b'),  'oklch(12% 0.02 215)'),
    (re.compile(r'(?i)#1a2533\b'),  'oklch(18% 0.02 220)'),
    (re.compile(r'(?i)#1e2837\b'),  'oklch(20% 0.02 220)'),

    # ── Hex text / neutral colors ─────────────────────────────────────────────
    (re.compile(r'(?i)#eef5ff\b'),  'var(--clr-text-heading)'),
    (re.compile(r'(?i)#e8f4fb\b'),  'oklch(95% 0.02 220)'),
    (re.compile(r'(?i)#e8f4fd\b'),  'oklch(95% 0.02 220)'),
    (re.compile(r'(?i)#cce3f0\b'),  'oklch(88% 0.03 220)'),
    (re.compile(r'(?i)#cce3f5\b'),  'oklch(88% 0.04 220)'),
    (re.compile(r'(?i)#d7e0ea\b'),  'oklch(88% 0.02 230)'),
    (re.compile(r'(?i)#c8dce8\b'),  'oklch(85% 0.03 220)'),
    (re.compile(r'(?i)#c8dff0\b'),  'oklch(85% 0.04 220)'),
    (re.compile(r'(?i)#a8c4d8\b'),  'oklch(75% 0.04 220)'),
    (re.compile(r'(?i)#a8c8e0\b'),  'oklch(75% 0.04 220)'),
    (re.compile(r'(?i)#a8b8c8\b'),  'oklch(72% 0.03 230)'),
    (re.compile(r'(?i)#a8d86e\b'),  'oklch(82% 0.13 130)'),
    (re.compile(r'(?i)#c8ccd4\b'),  'var(--clr-text)'),
    (re.compile(r'(?i)#8aa8bc\b'),  'var(--clr-text-muted)'),
    (re.compile(r'(?i)#8aa[bf][bf8]\b'), 'var(--clr-text-muted)'),
    (re.compile(r'(?i)#8a9[ab][ab]0\b'), 'var(--clr-text-muted)'),
    (re.compile(r'(?i)#8a9ab5\b'),  'var(--clr-text-muted)'),
    (re.compile(r'(?i)#8a9bb0\b'),  'var(--clr-text-muted)'),
    (re.compile(r'(?i)#8a97a8\b'),  'var(--clr-text-muted)'),
    (re.compile(r'(?i)#93abc2\b'),  'oklch(67% 0.03 220)'),
    (re.compile(r'(?i)#7a9[ad][ab5]\b'), 'var(--clr-text-muted)'),
    (re.compile(r'(?i)#7a9ab5\b'),  'var(--clr-text-muted)'),
    (re.compile(r'(?i)#7a9db5\b'),  'var(--clr-text-muted)'),
    (re.compile(r'(?i)#7a9dae\b'),  'var(--clr-text-muted)'),
    (re.compile(r'(?i)#7a8da0\b'),  'oklch(57% 0.03 220)'),
    (re.compile(r'(?i)#7a9bb0\b'),  'var(--clr-text-muted)'),
    (re.compile(r'(?i)#6a8a9e\b'),  'oklch(57% 0.04 220)'),
    (re.compile(r'(?i)#6d7891\b'),  'oklch(55% 0.02 240)'),
    (re.compile(r'(?i)#667384\b'),  'oklch(50% 0.02 240)'),
    (re.compile(r'(?i)#5a6a7e\b'),  'oklch(50% 0.025 230)'),
    (re.compile(r'(?i)#4a6b7a\b'),  'oklch(46% 0.04 220)'),
    (re.compile(r'(?i)#4a5568\b'),  'var(--clr-text-dim)'),
    (re.compile(r'(?i)#4a5a6e\b'),  'var(--clr-text-dim)'),
    (re.compile(r'(?i)#4a6070\b'),  'oklch(46% 0.02 225)'),
    (re.compile(r'(?i)#3a5468\b'),  'oklch(38% 0.04 220)'),
    (re.compile(r'(?i)#3a4a5e\b'),  'oklch(35% 0.025 230)'),
    (re.compile(r'(?i)#354959\b'),  'oklch(35% 0.025 225)'),
    (re.compile(r'(?i)#2f4666\b'),  'oklch(33% 0.06 245)'),
    (re.compile(r'(?i)#2a3545\b'),  'oklch(27% 0.03 230)'),
    (re.compile(r'(?i)#2e3e50\b'),  'var(--clr-text-faint)'),
    (re.compile(r'(?i)#475569\b'),  'oklch(43% 0.02 240)'),
    (re.compile(r'(?i)#e6ecff\b'),  'oklch(93% 0.03 250)'),
    (re.compile(r'(?i)#ef9a9a\b'),  'oklch(72% 0.12 28)'),
    (re.compile(r'(?i)#90b4c8\b'),  'oklch(70% 0.04 220)'),
    (re.compile(r'(?i)#b0cdd8\b'),  'oklch(80% 0.04 220)'),

    # ── Purple accent variants (non-brand but close) ──────────────────────────
    (re.compile(r'(?i)#c4bdff\b'),  'oklch(80% 0.12 285)'),
    (re.compile(r'(?i)#8e86d4\b'),  'oklch(62% 0.14 290)'),
    (re.compile(r'(?i)#6b65b8\b'),  'oklch(50% 0.18 290)'),

    # ── Green/teal structural variants ───────────────────────────────────────
    (re.compile(r'(?i)#66bb6a\b'),  'oklch(67% 0.15 145)'),
    (re.compile(r'(?i)#388e3c\b'),  'oklch(45% 0.16 145)'),
    (re.compile(r'(?i)#2e7d52\b'),  'oklch(45% 0.16 145)'),
    (re.compile(r'(?i)#26dec2\b'),  'oklch(79% 0.13 180)'),

    # ── Blue structural variants ──────────────────────────────────────────────
    (re.compile(r'(?i)#64b5f6\b'),  'oklch(70% 0.10 230)'),
    (re.compile(r'(?i)#1565c0\b'),  'oklch(40% 0.15 255)'),
    (re.compile(r'(?i)#141452\b'),  'oklch(14% 0.04 280)'),

    # ── Near-black / very dark ────────────────────────────────────────────────
    (re.compile(r'(?i)#000000\b'),  'oklch(0% 0 0)'),
    (re.compile(r'(?i)#0d1117\b'),  'var(--clr-bg-panel)'),
    (re.compile(r'(?i)#0a141f\b'),  'var(--clr-bg-panel)'),
    (re.compile(r'(?i)#0d1f2d\b'),  'oklch(14% 0.03 215)'),
    (re.compile(r'(?i)#04081c\b'),  'oklch(5% 0.02 260)'),
    (re.compile(r'(?i)#152899\b'),  'oklch(23% 0.18 268)'),
    (re.compile(r'(?i)#1a1a2e\b'),  'oklch(13% 0.03 280)'),
    (re.compile(r'(?i)#1b2736\b'),  'oklch(19% 0.03 220)'),
    (re.compile(r'(?i)#24384f\b'),  'oklch(26% 0.04 220)'),
    (re.compile(r'(?i)#0f172a\b'),  'oklch(12% 0.02 260)'),

    # ── Brand / accent hex (pure) ─────────────────────────────────────────────
    (re.compile(r'(?i)#ffffff\b'),  'oklch(100% 0 0)'),
    (re.compile(r'(?i)#ffa500\b'),  'oklch(75% 0.18 65)'),
    (re.compile(r'(?i)#ff6b6b\b'),  'oklch(65% 0.18 25)'),
    (re.compile(r'(?i)#a8232a\b'),  'var(--clr-red)'),
    (re.compile(r'(?i)#4fc3f7\b'),  'oklch(76% 0.12 220)'),
    (re.compile(r'(?i)#0284c7\b'),  'oklch(52% 0.14 240)'),

    # ── Greyscale ─────────────────────────────────────────────────────────────
    (re.compile(r'(?i)#ededed\b'),  'oklch(94% 0 0)'),
    (re.compile(r'(?i)#9a9a9a\b'),  'oklch(63% 0 0)'),
    (re.compile(r'(?i)#666666\b'),  'oklch(48% 0 0)'),
    (re.compile(r'(?i)#555555\b'),  'oklch(40% 0 0)'),
    (re.compile(r'(?i)#444444\b'),  'oklch(32% 0 0)'),
    (re.compile(r'(?i)(?<![0-9a-fA-F])#666\b'),  'oklch(48% 0 0)'),
    (re.compile(r'(?i)(?<![0-9a-fA-F])#555\b'),  'oklch(40% 0 0)'),
    (re.compile(r'(?i)(?<![0-9a-fA-F])#444\b'),  'oklch(32% 0 0)'),

    # ── Blue / cyan structural variants ──────────────────────────────────────
    (re.compile(r'(?i)#69bde4\b'),  'oklch(73% 0.10 220)'),
    (re.compile(r'(?i)#edf4ff\b'),  'var(--clr-text-heading)'),
    (re.compile(r'(?i)#4a7faa\b'),  'oklch(54% 0.08 225)'),
    (re.compile(r'(?i)#5a9acc\b'),  'oklch(62% 0.09 225)'),
    (re.compile(r'(?i)#aee9ff\b'),  'oklch(90% 0.08 205)'),
    (re.compile(r'(?i)#e0f4ff\b'),  'oklch(95% 0.04 220)'),

    # ── Neutral text – grey-blue spectrum ────────────────────────────────────
    (re.compile(r'(?i)#cbdde8\b'),  'oklch(85% 0.03 220)'),
    (re.compile(r'(?i)#b4c5d8\b'),  'oklch(77% 0.03 220)'),
    (re.compile(r'(?i)#d1deea\b'),  'oklch(87% 0.03 220)'),
    (re.compile(r'(?i)#afbbc7\b'),  'oklch(75% 0.025 225)'),
    (re.compile(r'(?i)#9eb2c8\b'),  'oklch(70% 0.03 220)'),
    (re.compile(r'(?i)#95a2b1\b'),  'oklch(66% 0.02 225)'),
    (re.compile(r'(?i)#8aa8be\b'),  'var(--clr-text-muted)'),
    (re.compile(r'(?i)#7e8d9e\b'),  'oklch(58% 0.025 225)'),
    (re.compile(r'(?i)#76879a\b'),  'oklch(57% 0.025 225)'),
    (re.compile(r'(?i)#728193\b'),  'oklch(55% 0.025 230)'),
    (re.compile(r'(?i)#607c8e\b'),  'oklch(52% 0.04 220)'),
    (re.compile(r'(?i)#607080\b'),  'oklch(50% 0.02 230)'),
    (re.compile(r'(?i)#566274\b'),  'oklch(44% 0.03 230)'),
    (re.compile(r'(?i)#527085\b'),  'oklch(49% 0.04 220)'),
    (re.compile(r'(?i)#4b5564\b'),  'oklch(40% 0.025 230)'),
    (re.compile(r'(?i)#2a3a4e\b'),  'oklch(28% 0.04 230)'),
    (re.compile(r'(?i)#2a4a5e\b'),  'oklch(33% 0.05 220)'),
    (re.compile(r'(?i)#768395\b'),  'oklch(55% 0.025 230)'),

    # ── Light mode specific ───────────────────────────────────────────────────
    (re.compile(r'(?i)#2[Dd]1[Bb]0[Ee]\b'), 'oklch(16% 0.05 55)'),
    (re.compile(r'(?i)#6[Bb]4[Bb]36\b'),    'oklch(38% 0.06 50)'),

    # ── ThemeSwitch specific colors ───────────────────────────────────────────
    (re.compile(r'(?i)#f59e0b\b'),  'oklch(78% 0.18 80)'),
    (re.compile(r'(?i)#818cf8\b'),  'oklch(68% 0.17 282)'),
    (re.compile(r'(?i)#a5b4fc\b'),  'oklch(77% 0.12 282)'),
    (re.compile(r'(?i)#6366f1\b'),  'oklch(58% 0.20 280)'),
    (re.compile(r'(?i)#fde68a\b'),  'oklch(91% 0.10 90)'),

    # ── Tailwind-style zinc/slate neutrals ────────────────────────────────────
    (re.compile(r'(?i)#f4f4f5\b'),  'oklch(96% 0 270)'),
    (re.compile(r'(?i)#f8fafc\b'),  'oklch(98% 0.01 240)'),
    (re.compile(r'(?i)#e2e8f0\b'),  'oklch(90% 0.02 240)'),
    (re.compile(r'(?i)#cbd5e1\b'),  'oklch(83% 0.02 235)'),
    (re.compile(r'(?i)#94a3b8\b'),  'oklch(65% 0.03 235)'),
    (re.compile(r'(?i)#64748b\b'),  'oklch(50% 0.03 240)'),
    (re.compile(r'(?i)#334155\b'),  'oklch(31% 0.03 240)'),
    (re.compile(r'(?i)#1e293b\b'),  'oklch(21% 0.03 240)'),
    (re.compile(r'(?i)#a1a1aa\b'),  'oklch(67% 0 270)'),
    (re.compile(r'(?i)#71717a\b'),  'oklch(52% 0 270)'),
    (re.compile(r'(?i)#52525b\b'),  'oklch(40% 0.01 270)'),
    (re.compile(r'(?i)#3f3f46\b'),  'oklch(31% 0.01 270)'),
    (re.compile(r'(?i)#d4d4d8\b'),  'oklch(85% 0 270)'),
    (re.compile(r'(?i)#18181b\b'),  'oklch(15% 0.01 260)'),
    (re.compile(r'(?i)#0a0a0a\b'),  'oklch(8% 0 0)'),

    # ── BrandMark / special blues ─────────────────────────────────────────────
    (re.compile(r'(?i)#c8e6f7\b'),  'oklch(90% 0.04 220)'),
    (re.compile(r'(?i)#c9d1d9\b'),  'oklch(83% 0.02 225)'),

    # ── Component-specific accent neutrals ────────────────────────────────────
    (re.compile(r'(?i)#ffd166\b'),  'oklch(87% 0.13 90)'),
    (re.compile(r'(?i)#9fb9c9\b'),  'oklch(74% 0.04 220)'),
    (re.compile(r'(?i)#8899aa\b'),  'oklch(64% 0.03 225)'),
    (re.compile(r'(?i)#4a5a6a\b'),  'oklch(43% 0.03 230)'),
    (re.compile(r'(?i)#cdd9e5\b'),  'oklch(85% 0.02 220)'),
    (re.compile(r'(?i)#e4f4ff\b'),  'oklch(95% 0.03 220)'),
    (re.compile(r'(?i)#6a7a8e\b'),  'oklch(54% 0.03 230)'),
    (re.compile(r'(?i)#c8e8f8\b'),  'oklch(91% 0.04 220)'),
    (re.compile(r'(?i)#3a7a9e\b'),  'oklch(50% 0.07 220)'),
    (re.compile(r'(?i)#f0c060\b'),  'oklch(82% 0.10 80)'),
    (re.compile(r'(?i)#7a8fa8\b'),  'oklch(58% 0.04 225)'),
    (re.compile(r'(?i)#81c784\b'),  'oklch(67% 0.15 145)'),
    (re.compile(r'(?i)#e57373\b'),  'oklch(65% 0.16 27)'),
    (re.compile(r'(?i)#f9b0b0\b'),  'oklch(80% 0.12 27)'),
    (re.compile(r'(?i)#8a9bae\b'),  'var(--clr-text-muted)'),
    (re.compile(r'(?i)#3d4e60\b'),  'oklch(36% 0.04 230)'),
    (re.compile(r'(?i)#6a8aa8\b'),  'oklch(57% 0.05 220)'),
    (re.compile(r'(?i)#8b949e\b'),  'var(--clr-text-muted)'),
    (re.compile(r'(?i)#ef4444\b'),  'oklch(55% 0.22 27)'),
    (re.compile(r'(?i)#10b981\b'),  'oklch(67% 0.18 160)'),
    (re.compile(r'(?i)#0a0c10\b'),  'var(--clr-bg-panel)'),
    (re.compile(r'(?i)#050810\b'),  'var(--clr-bg)'),
    (re.compile(r'(?i)#111122\b'),  'oklch(13% 0.03 280)'),
    (re.compile(r'(?i)#1a2536\b'),  'oklch(18% 0.03 225)'),
    (re.compile(r'(?i)#050a10\b'),  'var(--clr-bg)'),

    # ── Short hex forms ───────────────────────────────────────────────────────
    (re.compile(r'(?i)(?<![0-9a-fA-F])#fff\b'),  'oklch(100% 0 0)'),
    (re.compile(r'(?i)(?<![0-9a-fA-F])#000\b'),  'oklch(0% 0 0)'),
    (re.compile(r'(?i)(?<![0-9a-fA-F])#eee\b'),  'oklch(95% 0 0)'),
    (re.compile(r'(?i)(?<![0-9a-fA-F])#333\b'),  'oklch(24% 0 0)'),

    # ── Structural greens / reds not yet covered ──────────────────────────────
    (re.compile(r'(?i)#69d98c\b'),  'oklch(78% 0.15 145)'),   # success/Mousavi green
    (re.compile(r'(?i)#ef5350\b'),  'oklch(58% 0.19 27)'),    # standard red error
    (re.compile(r'(?i)#6ea03e\b'),  'oklch(59% 0.14 135)'),   # olive green (Transitional)

    # ── Accent mid (hex form of rgba(124,114,232)) ────────────────────────────
    (re.compile(r'(?i)#7c72e8\b'),  'oklch(60% 0.18 285)'),

    # ── Additional muted blue-grey text colors ────────────────────────────────
    (re.compile(r'(?i)#a8c4d4\b'),  'oklch(78% 0.04 220)'),
    (re.compile(r'(?i)#8aabb8\b'),  'oklch(68% 0.04 220)'),
    (re.compile(r'(?i)#9bafc0\b'),  'oklch(70% 0.04 220)'),
    (re.compile(r'(?i)#5a7a8e\b'),  'oklch(51% 0.05 220)'),
    (re.compile(r'(?i)#5a6e7a\b'),  'oklch(49% 0.03 220)'),
    (re.compile(r'(?i)#7a9ab0\b'),  'var(--clr-text-muted)'),
    (re.compile(r'(?i)#4a6075\b'),  'oklch(43% 0.04 220)'),
    (re.compile(r'(?i)#3d4f63\b'),  'oklch(36% 0.04 230)'),

    # ── Greyscale additions ───────────────────────────────────────────────────
    (re.compile(r'(?i)#e0e0e0\b'),  'oklch(90% 0 0)'),
    (re.compile(r'(?i)#e4e4e7\b'),  'oklch(91% 0 270)'),   # zinc-100
    (re.compile(r'(?i)#1c1c1e\b'),  'oklch(15% 0 270)'),   # zinc-900

    # ── Profile / Tailwind amber+yellow ──────────────────────────────────────
    (re.compile(r'(?i)#fbbf24\b'),  'oklch(85% 0.16 85)'),  # amber-400
    (re.compile(r'(?i)#eab308\b'),  'oklch(80% 0.18 90)'),  # yellow-500
    (re.compile(r'rgba\(\s*234\s*,\s*179\s*,\s*8\s*,\s*([0-9.]+)\s*\)'), lambda m: f'oklch(80% 0.18 90 / {m.group(1).strip()})'),

    # ── Profile red variants ──────────────────────────────────────────────────
    (re.compile(r'(?i)#f87171\b'),  'oklch(65% 0.17 25)'),  # red-400
    (re.compile(r'(?i)#fca5a5\b'),  'oklch(75% 0.12 25)'),  # red-300
    (re.compile(r'rgba\(\s*239\s*,\s*68\s*,\s*68\s*,\s*([0-9.]+)\s*\)'), lambda m: f'oklch(55% 0.22 27 / {m.group(1).strip()})'),

    # ── Profile purple accent ─────────────────────────────────────────────────
    (re.compile(r'rgba\(\s*167\s*,\s*139\s*,\s*250\s*,\s*([0-9.]+)\s*\)'), lambda m: f'oklch(72% 0.16 285 / {m.group(1).strip()})'),
    (re.compile(r'(?i)#c4b5fd\b'),  'oklch(78% 0.14 285)'),  # violet-300

    # ── Profile near-black / zinc ─────────────────────────────────────────────
    (re.compile(r'(?i)#09090b\b'),  'oklch(7% 0 270)'),   # zinc-950
    (re.compile(r'(?i)#111113\b'),  'oklch(11% 0 270)'),
    (re.compile(r'rgba\(\s*9\s*,\s*9\s*,\s*11\s*,\s*([0-9.]+)\s*\)'), lambda m: f'oklch(7% 0 270 / {m.group(1).strip()})'),

    # ── Dark blue / teal (Profile, Vote, Start) ───────────────────────────────
    (re.compile(r'(?i)#1e3a4e\b'),  'oklch(25% 0.04 220)'),
    (re.compile(r'(?i)#0a2233\b'),  'oklch(17% 0.04 220)'),
    (re.compile(r'(?i)#2a3f52\b'),  'oklch(29% 0.04 220)'),
    (re.compile(r'rgba\(\s*13\s*,\s*25\s*,\s*38\s*,\s*([0-9.]+)\s*\)'), lambda m: f'oklch(14% 0.03 215 / {m.group(1).strip()})'),
    (re.compile(r'rgba\(\s*6\s*,\s*10\s*,\s*20\s*,\s*([0-9.]+)\s*\)'), lambda m: f'oklch(8% 0.02 255 / {m.group(1).strip()})'),

    # ── Start page – very dark / purple overlay ───────────────────────────────
    (re.compile(r'rgba\(\s*4\s*,\s*7\s*,\s*14\s*,\s*([0-9.]+)\s*\)'), lambda m: f'oklch(6% 0.02 255 / {m.group(1).strip()})'),
    (re.compile(r'rgba\(\s*100\s*,\s*58\s*,\s*200\s*,\s*([0-9.]+)\s*\)'), lambda m: f'oklch(50% 0.20 290 / {m.group(1).strip()})'),
    (re.compile(r'rgba\(\s*240\s*,\s*235\s*,\s*255\s*,\s*([0-9.]+)\s*\)'), lambda m: f'oklch(95% 0.04 285 / {m.group(1).strip()})'),
    (re.compile(r'rgba\(\s*45\s*,\s*27\s*,\s*14\s*,\s*([0-9.]+)\s*\)'), lambda m: f'oklch(16% 0.04 50 / {m.group(1).strip()})'),
    (re.compile(r'(?i)#e2d9ff\b'),  'oklch(91% 0.06 285)'),

    # ── Transitional amber-brown overlay ─────────────────────────────────────
    (re.compile(r'rgba\(\s*186\s*,\s*117\s*,\s*23\s*,\s*([0-9.]+)\s*\)'), lambda m: f'oklch(65% 0.13 75 / {m.group(1).strip()})'),

    # ── Global page near-black backgrounds ────────────────────────────────────
    (re.compile(r'(?i)#0b0b18\b'),  'oklch(8% 0.03 280)'),
    (re.compile(r'(?i)#10111e\b'),  'oklch(11% 0.03 280)'),

    # ── Final stragglers ──────────────────────────────────────────────────────
    (re.compile(r'(?i)#9eb3c6\b'),  'oklch(71% 0.04 220)'),
    (re.compile(r'(?i)#ff4444\b'),  'oklch(55% 0.22 25)'),
    (re.compile(r'(?i)#7fd8ff\b'),  'oklch(85% 0.09 210)'),
    (re.compile(r'(?i)#e8e4ff\b'),  'oklch(93% 0.05 285)'),
    (re.compile(r'(?i)#c8d8e8\b'),  'oklch(84% 0.03 220)'),
    (re.compile(r'(?i)#4a6a7a\b'),  'oklch(45% 0.04 220)'),
]

def transform(text):
    for pattern, repl in PAT:
        if callable(repl):
            text = pattern.sub(repl, text)
        else:
            text = pattern.sub(repl, text)
    return text

changed = 0
for css_file in sorted(css_files):
    original = css_file.read_text(encoding='utf-8', errors='ignore')
    updated  = transform(original)
    if updated != original:
        if DRY_RUN:
            print(f'[DRY RUN] Would update: {css_file.relative_to(ROOT.parent)}')
        else:
            css_file.write_text(updated, encoding='utf-8')
            print(f'Updated: {css_file.relative_to(ROOT.parent)}')
        changed += 1

print(f'\n{"[DRY RUN] " if DRY_RUN else ""}Done — {changed}/{len(css_files)} files modified.')
