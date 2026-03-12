import styles from './Spinner.module.css';

/**
 * Shared loading spinner.
 * @param {'sm'|'md'|'lg'} size  — sm=14px, md=22px (default), lg=32px
 * @param {string} className      — extra class for positioning
 */
export default function Spinner({ size = 'md', className = '' }) {
    return (
        <span
            className={`${styles.spinner} ${styles[size]}${className ? ` ${className}` : ''}`}
            aria-label="Loading"
        />
    );
}
