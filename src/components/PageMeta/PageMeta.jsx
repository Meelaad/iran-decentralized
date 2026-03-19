import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'IranDAO';
const DEFAULT_TITLE = 'IranDAO — Decentralized Digital Government Blueprint';
const DEFAULT_DESC = 'A blueprint for Iran\'s decentralized digital future — transparent governance, citizen sovereignty, and blockchain-based institutions.';
const DEFAULT_IMAGE = 'https://irandao.org/preview.png';

export function PageMeta({ title, description, image, lang = 'en' }) {
    const fullTitle = title ? `${title} — ${SITE_NAME}` : DEFAULT_TITLE;
    const desc = description ?? DEFAULT_DESC;
    const img = image ?? DEFAULT_IMAGE;

    return (
        <Helmet>
            <html lang={lang} />
            <title>{fullTitle}</title>
            <meta name="description" content={desc} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={desc} />
            <meta property="og:image" content={img} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={desc} />
            <meta name="twitter:image" content={img} />
        </Helmet>
    );
}
