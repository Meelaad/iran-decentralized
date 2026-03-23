import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import CONTENT from '../../locales/pages/transitional-plans.json';
import styles from './TransitionalPlansPage.module.css';

export default function TransitionalPlansPage() {
    const { t, isRTL } = useLang();

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

                <section className={styles.section}>
                    <div className={styles.sectionLabel}>
                        {t(CONTENT.sectionRefDocs)}
                    </div>
                    <div className={styles.cardList}>
                        <Link to="/transitional/plan/nufdi" className={styles.card} style={{ '--card-accent': '#7c72e8' }}>
                            <div className={styles.cardAccentBar} />
                            <div className={styles.cardBody}>
                                <div className={styles.cardTitle}>
                                    {t(CONTENT.nufdiTitle)}
                                </div>
                                <div className={styles.cardMeta}>
                                    {t(CONTENT.nufdiMeta)}
                                </div>
                                <div className={styles.cardTag}>
                                    {t(CONTENT.nufdiTag)}
                                </div>
                            </div>
                            <span className={styles.cardArrow}>→</span>
                        </Link>

                        <Link to="/transitional/plan/mirhosein-mousavi" className={styles.card} style={{ '--card-accent': '#69d98c' }}>
                            <div className={styles.cardAccentBar} />
                            <div className={styles.cardBody}>
                                <div className={styles.cardTitle}>
                                    {t(CONTENT.mousaviTitle)}
                                </div>
                                <div className={styles.cardMeta}>
                                    {t(CONTENT.mousaviMeta)}
                                </div>
                                <div className={styles.cardTag}>
                                    {t(CONTENT.mousaviTag)}
                                </div>
                            </div>
                            <span className={styles.cardArrow}>→</span>
                        </Link>

                        <Link to="/transitional/plan/itc" className={styles.card} style={{ '--card-accent': '#ff9a42' }}>
                            <div className={styles.cardAccentBar} />
                            <div className={styles.cardBody}>
                                <div className={styles.cardTitle}>
                                    {t(CONTENT.itcTitle)}
                                </div>
                                <div className={styles.cardMeta}>
                                    {t(CONTENT.itcMeta)}
                                </div>
                                <div className={styles.cardTag}>
                                    {t(CONTENT.itcTag)}
                                </div>
                            </div>
                            <span className={styles.cardArrow}>→</span>
                        </Link>

                        <Link to="/transitional/plan/cpild" className={styles.card} style={{ '--card-accent': '#f59e0b' }}>
                            <div className={styles.cardAccentBar} />
                            <div className={styles.cardBody}>
                                <div className={styles.cardTitle}>
                                    {t(CONTENT.cpildTitle)}
                                </div>
                                <div className={styles.cardMeta}>
                                    {t(CONTENT.cpildMeta)}
                                </div>
                                <div className={styles.cardTag}>
                                    {t(CONTENT.cpildTag)}
                                </div>
                            </div>
                            <span className={styles.cardArrow}>→</span>
                        </Link>

                        <Link to="/transitional/plan/jmi" className={styles.card} style={{ '--card-accent': '#e8c840' }}>
                            <div className={styles.cardAccentBar} />
                            <div className={styles.cardBody}>
                                <div className={styles.cardTitle}>
                                    {t(CONTENT.jmiTitle)}
                                </div>
                                <div className={styles.cardMeta}>
                                    {t(CONTENT.jmiMeta)}
                                </div>
                                <div className={styles.cardTag}>
                                    {t(CONTENT.jmiTag)}
                                </div>
                            </div>
                            <span className={styles.cardArrow}>→</span>
                        </Link>

                        <Link to="/transitional/plan/cpfik" className={styles.card} style={{ '--card-accent': '#26d9b2' }}>
                            <div className={styles.cardAccentBar} />
                            <div className={styles.cardBody}>
                                <div className={styles.cardTitle}>
                                    {t(CONTENT.cpfikTitle)}
                                </div>
                                <div className={styles.cardMeta}>
                                    {t(CONTENT.cpfikMeta)}
                                </div>
                                <div className={styles.cardTag}>
                                    {t(CONTENT.cpfikTag)}
                                </div>
                            </div>
                            <span className={styles.cardArrow}>→</span>
                        </Link>

                        <Link to="/transitional/plan/uri" className={styles.card} style={{ '--card-accent': '#e8507a' }}>
                            <div className={styles.cardAccentBar} />
                            <div className={styles.cardBody}>
                                <div className={styles.cardTitle}>
                                    {t(CONTENT.uriTitle)}
                                </div>
                                <div className={styles.cardMeta}>
                                    {t(CONTENT.uriMeta)}
                                </div>
                                <div className={styles.cardTag}>
                                    {t(CONTENT.uriTag)}
                                </div>
                            </div>
                            <span className={styles.cardArrow}>→</span>
                        </Link>

                        <Link to="/transitional/plan/civil-society" className={styles.card} style={{ '--card-accent': '#ffd166' }}>
                            <div className={styles.cardAccentBar} />
                            <div className={styles.cardBody}>
                                <div className={styles.cardTitle}>
                                    {t(CONTENT.civilSocietyTitle)}
                                </div>
                                <div className={styles.cardMeta}>
                                    {t(CONTENT.civilSocietyMeta)}
                                </div>
                                <div className={styles.cardTag}>
                                    {t(CONTENT.civilSocietyTag)}
                                </div>
                            </div>
                            <span className={styles.cardArrow}>→</span>
                        </Link>
                    </div>
                </section>

                <section className={styles.section}>
                    <div className={styles.sectionLabel}>
                        {t(CONTENT.sectionArena)}
                    </div>
                    <Link to="/arena" className={styles.arenaCard}>
                        <div className={styles.arenaCardBody}>
                            <div className={styles.arenaCardTitle}>
                                {t(CONTENT.arenaCardTitle)}
                            </div>
                            <div className={styles.arenaCardDesc}>
                                {t(CONTENT.arenaCardDesc)}
                            </div>
                        </div>
                        <span className={styles.cardArrow}>→</span>
                    </Link>
                </section>

                <div className={styles.footer}>
                    <Link to="/compare/transition" className={styles.footerLink}>
                        {t(CONTENT.compareLink)}
                    </Link>
                </div>
            </div>
        </div>
    );
}
