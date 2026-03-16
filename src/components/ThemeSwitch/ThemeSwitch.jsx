import { useTheme } from '../../contexts/ThemeContext';
import './ThemeSwitch.css';

const SunIcon = () => (
    <svg className="ts-icon ts-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <line x1="12" y1="2"  x2="12" y2="4"  />
        <line x1="12" y1="20" x2="12" y2="22" />
        <line x1="4.22" y1="4.22"  x2="5.64" y2="5.64"  />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="2"  y1="12" x2="4"  y2="12" />
        <line x1="20" y1="12" x2="22" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
);

const MoonIcon = () => (
    <svg className="ts-icon ts-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
);

export function ThemeSwitch() {
    const { theme, toggleTheme } = useTheme();
    const isLight = theme === 'light';

    return (
        <button
            className={`ts-wrap ${isLight ? 'ts-wrap--light' : 'ts-wrap--dark'}`}
            onClick={toggleTheme}
            role="switch"
            aria-checked={isLight}
            aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
        >
            <span className={`ts-icon-wrap ${isLight ? 'ts-icon-wrap--active' : 'ts-icon-wrap--inactive'}`}>
                <SunIcon />
            </span>

            <span className="ts-track">
                <span className="ts-thumb" />
            </span>

            <span className={`ts-icon-wrap ${!isLight ? 'ts-icon-wrap--active' : 'ts-icon-wrap--inactive'}`}>
                <MoonIcon />
            </span>
        </button>
    );
}
