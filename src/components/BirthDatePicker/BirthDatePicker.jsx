import { useState, useRef, useEffect } from 'react';
import './BirthDatePicker.css';

const VISIBLE = 5;
const CENTER  = Math.floor(VISIBLE / 2);

const DAYS   = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
const MONTHS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));

const CURRENT_YEAR = new Date().getFullYear();
const MAX_YEAR     = CURRENT_YEAR - 18;
const MIN_YEAR     = CURRENT_YEAR - 99;
const YEARS        = Array.from({ length: MAX_YEAR - MIN_YEAR + 1 }, (_, i) => String(MIN_YEAR + i));

const DEFAULT_YEAR_STR   = String(Math.min(MAX_YEAR, CURRENT_YEAR - 28));
const DEFAULT_YEAR_INDEX = Math.max(0, YEARS.indexOf(DEFAULT_YEAR_STR));

// Keys that should always pass through without being treated as digit input
const PASSTHROUGH_KEYS = new Set([
    'Backspace','Delete','ArrowLeft','ArrowRight','ArrowUp','ArrowDown',
    'Tab','Home','End','Enter',
]);

function useItemHeight() {
    const get = () => (window.innerWidth <= 480 ? 36 : 46);
    const [itemH, setItemH] = useState(get);
    useEffect(() => {
        const h = () => setItemH(get());
        window.addEventListener('resize', h);
        return () => window.removeEventListener('resize', h);
    }, []);
    return itemH;
}

// ── DrumColumn ────────────────────────────────────────────────────────────────
function DrumColumn({ items, selectedIndex, onSelect, label, itemH }) {
    const [liveOffset, setLiveOffset] = useState(0);
    const dragRef = useRef(null);

    const translateY = (CENTER - selectedIndex) * itemH + liveOffset;
    const viewportH  = VISIBLE * itemH;

    useEffect(() => {
        function onMove(e) {
            if (!dragRef.current) return;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            setLiveOffset(clientY - dragRef.current.startY);
        }
        function onUp(e) {
            if (!dragRef.current) return;
            const clientY = e.changedTouches
                ? (e.changedTouches[0]?.clientY ?? dragRef.current.startY)
                : e.clientY;
            const delta      = clientY - dragRef.current.startY;
            const indexDelta = -Math.round(delta / dragRef.current.itemH);
            const newIndex   = Math.max(0, Math.min(dragRef.current.total - 1, dragRef.current.startIndex + indexDelta));
            dragRef.current.onSelect(newIndex);
            setLiveOffset(0);
            dragRef.current = null;
        }
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup',   onUp);
        window.addEventListener('touchmove', onMove, { passive: false });
        window.addEventListener('touchend',  onUp);
        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup',   onUp);
            window.removeEventListener('touchmove', onMove);
            window.removeEventListener('touchend',  onUp);
        };
    }, []);

    function startDrag(clientY) {
        dragRef.current = { startY: clientY, startIndex: selectedIndex, total: items.length, onSelect, itemH };
    }

    function handleWheel(e) {
        e.preventDefault();
        onSelect(Math.max(0, Math.min(items.length - 1, selectedIndex + (e.deltaY > 0 ? 1 : -1))));
    }

    return (
        <div className="drum-col">
            <div className="drum-col-label">{label}</div>
            <div
                className="drum-viewport"
                style={{ height: viewportH }}
                onMouseDown={e => { e.preventDefault(); startDrag(e.clientY); }}
                onTouchStart={e => startDrag(e.touches[0].clientY)}
                onWheel={handleWheel}
            >
                <div className="drum-bg-grid" />
                <div
                    className={`drum-track${liveOffset !== 0 ? ' is-dragging' : ''}`}
                    style={{ transform: `translateY(${translateY}px)` }}
                >
                    {items.map((item, i) => {
                        const dist    = Math.abs(i - selectedIndex);
                        const opacity = dist === 0 ? 1 : dist === 1 ? 0.45 : dist === 2 ? 0.18 : 0.06;
                        const scale   = dist === 0 ? 1 : dist === 1 ? 0.88 : 0.76;
                        return (
                            <div
                                key={i}
                                className={`drum-item${dist === 0 ? ' drum-item--selected' : ''}`}
                                style={{ height: itemH, opacity, transform: `scale(${scale})` }}
                                onClick={() => onSelect(i)}
                            >
                                {item}
                            </div>
                        );
                    })}
                </div>
                <div className="drum-reticle" style={{ height: itemH, marginTop: -itemH / 2 }}>
                    <span className="drum-reticle-corner drum-reticle-tl" />
                    <span className="drum-reticle-corner drum-reticle-tr" />
                    <span className="drum-reticle-corner drum-reticle-bl" />
                    <span className="drum-reticle-corner drum-reticle-br" />
                </div>
                <div className="drum-fade-top" />
                <div className="drum-fade-bottom" />
                <div className="drum-scanline" />
            </div>
        </div>
    );
}

// ── Segmented date input ──────────────────────────────────────────────────────
// Three keyboard segments: YYYY · MM · DD
// Rules:
//   • Only digits accepted (regex /^\d$/ gated at keydown)
//   • Auto-advance to next segment when current is full
//   • Auto-pad: month first digit > 1 → prefix "0"; day first digit > 3 → prefix "0"
//   • Clamp on completion: month 01-12, day 01-31
//   • Backspace on empty segment → focus previous
//   • Paste of 8 digits (e.g. 19900122) → distribute YYYYMMDD
function SegmentedDateInput({ yearStr, monthStr, dayStr, onYear, onMonth, onDay }) {
    const yearRef  = useRef(null);
    const monthRef = useRef(null);
    const dayRef   = useRef(null);

    // ── Distribute a raw 8-digit paste across all three fields ──────────────
    function distributeDigits(digits) {
        const d = digits.replace(/\D/g, '');
        if (d.length >= 8) {
            onYear(clampYear(d.slice(0, 4)));
            onMonth(clampMonth(d.slice(4, 6)));
            onDay(clampDay(d.slice(6, 8)));
            dayRef.current?.focus();
        } else if (d.length >= 6) {
            onYear(clampYear(d.slice(0, 4)));
            onMonth(clampMonth(d.slice(4, 6)));
            monthRef.current?.focus();
        } else if (d.length >= 4) {
            onYear(clampYear(d.slice(0, 4)));
            monthRef.current?.focus();
        }
    }

    function clampYear(s) {
        const n = parseInt(s, 10);
        if (isNaN(n)) return s;
        if (n > MAX_YEAR) return String(MAX_YEAR);
        if (n < MIN_YEAR) return String(MIN_YEAR);
        return s;
    }

    function clampMonth(s) {
        const n = parseInt(s, 10);
        if (isNaN(n) || n < 1) return '01';
        if (n > 12) return '12';
        return s.padStart(2, '0');
    }

    function clampDay(s) {
        const n = parseInt(s, 10);
        if (isNaN(n) || n < 1) return '01';
        if (n > 31) return '31';
        return s.padStart(2, '0');
    }

    // ── YEAR ─────────────────────────────────────────────────────────────────
    function onYearKeyDown(e) {
        if (!PASSTHROUGH_KEYS.has(e.key) && !/^\d$/.test(e.key)) {
            e.preventDefault();
        }
    }

    function onYearChange(e) {
        let val = e.target.value.replace(/\D/g, '').slice(0, 4);
        if (val.length === 4) val = clampYear(val);
        onYear(val);
        if (val.length === 4) monthRef.current?.focus();
    }

    function onYearPaste(e) {
        e.preventDefault();
        distributeDigits(e.clipboardData.getData('text'));
    }

    // ── MONTH ─────────────────────────────────────────────────────────────────
    function onMonthKeyDown(e) {
        if (!PASSTHROUGH_KEYS.has(e.key) && !/^\d$/.test(e.key)) {
            e.preventDefault();
        }
        if (e.key === 'Backspace' && monthStr === '') {
            e.preventDefault();
            yearRef.current?.focus();
        }
    }

    function onMonthChange(e) {
        let val = e.target.value.replace(/\D/g, '').slice(0, 2);
        // First digit > 1 → can't form valid two-digit month ≥ 10, so pad
        if (val.length === 1 && parseInt(val, 10) > 1) {
            val = '0' + val;
        }
        // Clamp on two digits
        if (val.length === 2) val = clampMonth(val);
        onMonth(val);
        if (val.length === 2) dayRef.current?.focus();
    }

    function onMonthPaste(e) {
        e.preventDefault();
        distributeDigits(e.clipboardData.getData('text'));
    }

    // ── DAY ───────────────────────────────────────────────────────────────────
    function onDayKeyDown(e) {
        if (!PASSTHROUGH_KEYS.has(e.key) && !/^\d$/.test(e.key)) {
            e.preventDefault();
        }
        if (e.key === 'Backspace' && dayStr === '') {
            e.preventDefault();
            monthRef.current?.focus();
        }
    }

    function onDayChange(e) {
        let val = e.target.value.replace(/\D/g, '').slice(0, 2);
        // First digit > 3 → can't form valid two-digit day ≥ 30 starting with that, pad
        if (val.length === 1 && parseInt(val, 10) > 3) {
            val = '0' + val;
        }
        if (val.length === 2) val = clampDay(val);
        onDay(val);
    }

    function onDayPaste(e) {
        e.preventDefault();
        distributeDigits(e.clipboardData.getData('text'));
    }

    return (
        <div className="drum-seg-row">
            <div className="drum-seg-field">
                <input
                    ref={yearRef}
                    className="drum-seg-input drum-seg-year"
                    type="text"
                    inputMode="numeric"
                    value={yearStr}
                    maxLength={4}
                    placeholder="YYYY"
                    autoComplete="off"
                    spellCheck={false}
                    onKeyDown={onYearKeyDown}
                    onChange={onYearChange}
                    onPaste={onYearPaste}
                />
                <span className="drum-seg-label">YYYY</span>
            </div>
            <span className="drum-seg-sep" aria-hidden="true">·</span>
            <div className="drum-seg-field">
                <input
                    ref={monthRef}
                    className="drum-seg-input drum-seg-mm"
                    type="text"
                    inputMode="numeric"
                    value={monthStr}
                    maxLength={2}
                    placeholder="MM"
                    autoComplete="off"
                    spellCheck={false}
                    onKeyDown={onMonthKeyDown}
                    onChange={onMonthChange}
                    onPaste={onMonthPaste}
                />
                <span className="drum-seg-label">MM</span>
            </div>
            <span className="drum-seg-sep" aria-hidden="true">·</span>
            <div className="drum-seg-field">
                <input
                    ref={dayRef}
                    className="drum-seg-input drum-seg-dd"
                    type="text"
                    inputMode="numeric"
                    value={dayStr}
                    maxLength={2}
                    placeholder="DD"
                    autoComplete="off"
                    spellCheck={false}
                    onKeyDown={onDayKeyDown}
                    onChange={onDayChange}
                    onPaste={onDayPaste}
                />
                <span className="drum-seg-label">DD</span>
            </div>
        </div>
    );
}

// ── BirthDatePicker ───────────────────────────────────────────────────────────
export default function BirthDatePicker({ onChange, isRTL }) {
    const itemH = useItemHeight();

    const [dayIndex,   setDayIndex]   = useState(0);
    const [monthIndex, setMonthIndex] = useState(0);
    const [yearIndex,  setYearIndex]  = useState(DEFAULT_YEAR_INDEX);

    // Segmented text input state — kept in sync with drums bidirectionally
    const [yearStr,  setYearStr]  = useState('');
    const [monthStr, setMonthStr] = useState('');
    const [dayStr,   setDayStr]   = useState('');

    // Drums → text fields + fire onChange
    useEffect(() => {
        setYearStr(YEARS[yearIndex]);
        setMonthStr(MONTHS[monthIndex]);
        setDayStr(DAYS[dayIndex]);
        onChange(`${YEARS[yearIndex]}-${MONTHS[monthIndex]}-${DAYS[dayIndex]}`);
    }, [dayIndex, monthIndex, yearIndex]); // eslint-disable-line

    // Text fields → try to sync drums (only when all three segments are complete)
    function syncDrums(y, m, d) {
        const yi = YEARS.indexOf(y);
        const mi = parseInt(m, 10) - 1;
        const di = parseInt(d, 10) - 1;
        if (yi >= 0 && mi >= 0 && mi <= 11 && di >= 0 && di <= 30) {
            setYearIndex(yi);
            setMonthIndex(mi);
            setDayIndex(di);
        }
    }

    function handleYear(val) {
        setYearStr(val);
        if (val.length === 4) syncDrums(val, monthStr, dayStr);
    }
    function handleMonth(val) {
        setMonthStr(val);
        if (val.length === 2) syncDrums(yearStr, val, dayStr);
    }
    function handleDay(val) {
        setDayStr(val);
        if (val.length === 2) syncDrums(yearStr, monthStr, val);
    }

    const drumFont   = isRTL ? "'Vazirmatn', sans-serif" : "'IBM Plex Mono', monospace";
    const dayLabel   = isRTL ? 'روز'  : 'DD';
    const monthLabel = isRTL ? 'ماه'  : 'MM';
    const yearLabel  = isRTL ? 'سال'  : 'YYYY';

    return (
        <div className="drum-picker" dir="ltr" style={{ '--drum-font': drumFont }}>
            <div className="drum-picker-inner">
                <DrumColumn items={YEARS}  selectedIndex={yearIndex}  onSelect={setYearIndex}  label={yearLabel}  itemH={itemH} />
                <div className="drum-divider"><span /><span /><span /></div>
                <DrumColumn items={MONTHS} selectedIndex={monthIndex} onSelect={setMonthIndex} label={monthLabel} itemH={itemH} />
                <div className="drum-divider"><span /><span /><span /></div>
                <DrumColumn items={DAYS}   selectedIndex={dayIndex}   onSelect={setDayIndex}   label={dayLabel}   itemH={itemH} />
            </div>

            <div className="drum-readout">
                <SegmentedDateInput
                    yearStr={yearStr}   onYear={handleYear}
                    monthStr={monthStr} onMonth={handleMonth}
                    dayStr={dayStr}     onDay={handleDay}
                />
            </div>
        </div>
    );
}
