import './BrandMark.css';

export function BrandMark({ size = 'lg' }) {
    return (
        <div className={`brand-mark brand-mark--${size}`}>
            <span className="brand-mark-iran">IRAN</span>
            <span className="brand-mark-dao">DAO</span>
        </div>
    );
}
