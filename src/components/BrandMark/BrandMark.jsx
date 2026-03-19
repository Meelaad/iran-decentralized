import { useLang } from '../../contexts/LangContext';
import './BrandMark.css';

export function BrandMark({ size = 'lg' }) {
    const { isRTL, headFont } = useLang();
    const firstWord  = isRTL ? 'ایران' : 'IRAN';
    const secondWord = isRTL ? 'دائو'  : 'DAO';

    return (
        <div
            className={`brand-mark brand-mark--${size}`}
            style={{ fontFamily: headFont, direction: isRTL ? 'rtl' : 'ltr' }}
        >
            <span className="brand-mark-iran">{firstWord}</span>
            <span className="brand-mark-dao">{secondWord}</span>
        </div>
    );
}
