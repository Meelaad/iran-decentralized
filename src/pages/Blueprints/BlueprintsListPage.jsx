import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import { BLUEPRINTS } from '../../data';
import styles from './BlueprintsListPage.module.css';
import CONTENT from '../../locales/pages/blueprints-list.json';

export default function BlueprintsListPage() {
    const { t, isRTL } = useLang();

    const blueprints = Object.values(BLUEPRINTS);

    return (
        <div className={styles.root} dir={isRTL ? 'rtl' : 'ltr'}>
            <div className={styles.inner}>
                <div className={styles.eyebrow}>
                    {t(CONTENT.eyebrow)}
                </div>
                <h1 className={styles.title}>
                    {t(CONTENT.title)}
                </h1>
                <p className={styles.subtitle}>
                    {t(CONTENT.subtitle)}
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
                                    {t(CONTENT.mapButton)}
                                </span>
                                <Link
                                    to={`/blueprint/gov/${bp.id}/sectors`}
                                    className={styles.cardLink}
                                    onClick={e => e.stopPropagation()}
                                >
                                    {t(CONTENT.sectorsButton)}
                                </Link>
                            </div>
                            <span className={styles.cardArrow}>→</span>
                        </Link>
                    ))}
                </div>

                <div className={styles.footer}>
                    <Link to="/destination" className={styles.footerLink}>
                        {t(CONTENT.destinationLink)}
                    </Link>
                    <Link to="/compare" className={styles.footerLink}>
                        {t(CONTENT.compareLink)}
                    </Link>
                </div>
            </div>
        </div>
    );
}
