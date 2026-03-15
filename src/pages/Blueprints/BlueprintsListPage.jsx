import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import { BLUEPRINTS } from '../../data';
import styles from './BlueprintsListPage.module.css';

export default function BlueprintsListPage() {
    const { t, isRTL } = useLang();

    const blueprints = Object.values(BLUEPRINTS);

    return (
        <div className={styles.root} dir={isRTL ? 'rtl' : 'ltr'}>
            <div className={styles.inner}>
                <div className={styles.eyebrow}>
                    {t({ en: 'STAGE 2 — THE DESTINATION', fa: 'مرحله ۲ — مقصد' })}
                </div>
                <h1 className={styles.title}>
                    {t({ en: 'Governance Blueprints', fa: 'طرح‌های حاکمیتی' })}
                </h1>
                <p className={styles.subtitle}>
                    {t({
                        en: "Six proposed systems of government for Iran's permanent constitution",
                        fa: 'شش سیستم حکومتی پیشنهادی برای قانون اساسی دائمی ایران',
                    })}
                </p>

                <div className={styles.cardList}>
                    {blueprints.map((bp) => (
                        <Link
                            key={bp.id}
                            to={`/blueprint/gov/${bp.id}`}
                            className={styles.card}
                        >
                            <div className={styles.cardBody}>
                                <div className={styles.cardTitle}>{t(bp.name)}</div>
                                {bp.desc && (
                                    <div className={styles.cardDesc}>
                                        {typeof bp.desc === 'object' ? t(bp.desc) : bp.desc}
                                    </div>
                                )}
                            </div>
                            <div className={styles.cardActions}>
                                <span className={styles.cardLink}>
                                    {t({ en: 'MAP', fa: 'نقشه' })}
                                </span>
                                <Link
                                    to={`/blueprint/gov/${bp.id}/sectors`}
                                    className={styles.cardLink}
                                    onClick={e => e.stopPropagation()}
                                >
                                    {t({ en: 'SECTORS', fa: 'بخش‌ها' })}
                                </Link>
                            </div>
                            <span className={styles.cardArrow}>→</span>
                        </Link>
                    ))}
                </div>

                <div className={styles.footer}>
                    <Link to="/destination" className={styles.footerLink}>
                        {t({ en: '← Destination Hub', fa: 'مرکز مقصد ←' })}
                    </Link>
                    <Link to="/compare" className={styles.footerLink}>
                        {t({ en: 'Compare blueprints →', fa: '← مقایسه طرح‌ها' })}
                    </Link>
                </div>
            </div>
        </div>
    );
}
