import { useTheme } from '../../contexts/ThemeContext';
import './ThemeSwitch.css';

export function ThemeSwitch() {
    const { theme, toggleTheme } = useTheme();
    const isLight = theme === 'light';

    return (
        <div className={`ts-wrap${isLight ? '' : ' ts-wrap--dark'}`}>
            <label className="ts-label">
                <span className="ts-switch">
                    <input
                        className="ts-input"
                        type="checkbox"
                        role="switch"
                        checked={isLight}
                        onChange={toggleTheme}
                        aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
                    />
                    <span className="ts-surface">
                        <span className="ts-surface-glare" />
                    </span>
                    <span className="ts-inner-shadow" />
                    <span className="ts-inner">
                        <span className="ts-inner-glare" />
                    </span>
                    <span className="ts-rocker-shadow" />
                    <span className="ts-rocker-sides">
                        <span className="ts-rocker-sides-glare" />
                    </span>
                    <span className="ts-rocker">
                        <span className="ts-rocker-glare" />
                    </span>
                    <span className="ts-light">
                        <span className="ts-light-inner" />
                    </span>
                </span>
            </label>
        </div>
    );
}
