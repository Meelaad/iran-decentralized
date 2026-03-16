import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import styles from './TransitionalPlansPage.module.css';

export default function TransitionalPlansPage() {
    const { t, isRTL } = useLang();

    return (
        <div className={styles.root} dir={isRTL ? 'rtl' : 'ltr'}>
            <div className={styles.inner}>
                <div className={styles.eyebrow}>
                    {t({ en: 'STAGE 1 — THE TRANSITION', fa: 'مرحله ۱ — انتقال' })}
                </div>
                <h1 className={styles.title}>
                    {t({ en: 'Transitional Plans', fa: 'طرح‌های انتقالی' })}
                </h1>
                <p className={styles.subtitle}>
                    {t({
                        en: "Documented frameworks proposed for Iran's post-regime transition period",
                        fa: 'چارچوب‌های مستند پیشنهادشده برای دوران انتقال ایران پس از رژیم',
                    })}
                </p>

                <section className={styles.section}>
                    <div className={styles.sectionLabel}>
                        {t({ en: 'REFERENCE DOCUMENTS', fa: 'اسناد مرجع' })}
                    </div>
                    <div className={styles.cardList}>
                        <Link to="/transitional/plan/nufdi" className={styles.card} style={{ '--card-accent': '#7c72e8' }}>
                            <div className={styles.cardAccentBar} />
                            <div className={styles.cardBody}>
                                <div className={styles.cardTitle}>
                                    {t({ en: 'NUFDI Blueprint', fa: 'طرح NUFDI' })}
                                </div>
                                <div className={styles.cardMeta}>
                                    {t({
                                        en: 'National United Front of Democrats of Iran',
                                        fa: 'جبهه ملی متحد دموکرات‌های ایران',
                                    })}
                                </div>
                                <div className={styles.cardTag}>
                                    {t({ en: 'Decentralized Federal · 18–24 months', fa: 'فدرال غیرمتمرکز · ۱۸–۲۴ ماه' })}
                                </div>
                            </div>
                            <span className={styles.cardArrow}>→</span>
                        </Link>

                        <Link to="/transitional/plan/mirhosein-mousavi" className={styles.card} style={{ '--card-accent': '#69d98c' }}>
                            <div className={styles.cardAccentBar} />
                            <div className={styles.cardBody}>
                                <div className={styles.cardTitle}>
                                    {t({ en: 'Mousavi — "To Save Iran"', fa: 'موسوی — «برای نجات ایران»' })}
                                </div>
                                <div className={styles.cardMeta}>
                                    {t({
                                        en: 'Mir Hossein Mousavi (Green Movement)',
                                        fa: 'میر حسین موسوی (جنبش سبز)',
                                    })}
                                </div>
                                <div className={styles.cardTag}>
                                    {t({ en: '3-Stage Popular Sovereignty', fa: 'حاکمیت مردمی ۳ مرحله‌ای' })}
                                </div>
                            </div>
                            <span className={styles.cardArrow}>→</span>
                        </Link>

                        <Link to="/transitional/plan/itc" className={styles.card} style={{ '--card-accent': '#ff9a42' }}>
                            <div className={styles.cardAccentBar} />
                            <div className={styles.cardBody}>
                                <div className={styles.cardTitle}>
                                    {t({ en: 'Iran Transition Council (ITC)', fa: 'شورای انتقال ایران (ITC)' })}
                                </div>
                                <div className={styles.cardMeta}>
                                    {t({ en: 'Shadow Government & Transitional Planning Unit', fa: 'دولت سایه و واحد برنامه‌ریزی انتقالی' })}
                                </div>
                                <div className={styles.cardTag}>
                                    {t({ en: 'Operational Shadow Government · Est. 2019', fa: 'دولت سایه عملیاتی · تأسیس ۲۰۱۹' })}
                                </div>
                            </div>
                            <span className={styles.cardArrow}>→</span>
                        </Link>

                        <Link to="/transitional/plan/cpild" className={styles.card} style={{ '--card-accent': '#f59e0b' }}>
                            <div className={styles.cardAccentBar} />
                            <div className={styles.cardBody}>
                                <div className={styles.cardTitle}>
                                    {t({ en: 'Constitutionalist Party of Iran (CPILD)', fa: 'حزب مشروطه ایران (لیبرال دموکرات)' })}
                                </div>
                                <div className={styles.cardMeta}>
                                    {t({
                                        en: 'Constitutionalist Party of Iran — Liberal Democrat',
                                        fa: 'حزب مشروطه ایران — لیبرال دموکرات',
                                    })}
                                </div>
                                <div className={styles.cardTag}>
                                    {t({ en: 'Constitutional Monarchy · Liberal Democracy', fa: 'پادشاهی مشروطه · دموکراسی لیبرال' })}
                                </div>
                            </div>
                            <span className={styles.cardArrow}>→</span>
                        </Link>

                        <Link to="/transitional/plan/jmi" className={styles.card} style={{ '--card-accent': '#e8c840' }}>
                            <div className={styles.cardAccentBar} />
                            <div className={styles.cardBody}>
                                <div className={styles.cardTitle}>
                                    {t({ en: 'Jebhe Melli Iran (JMI)', fa: 'جبهه ملی ایران (JMI)' })}
                                </div>
                                <div className={styles.cardMeta}>
                                    {t({
                                        en: 'National Front of Iran · Founded 1949 by Dr. Mossadegh',
                                        fa: 'جبهه ملی ایران · تأسیس ۱۹۴۹ توسط دکتر مصدق',
                                    })}
                                </div>
                                <div className={styles.cardTag}>
                                    {t({ en: 'Mosaddeghist Democratic Republic', fa: 'جمهوری دموکراتیک مصدقی' })}
                                </div>
                            </div>
                            <span className={styles.cardArrow}>→</span>
                        </Link>

                        <Link to="/transitional/plan/cpfik" className={styles.card} style={{ '--card-accent': '#26d9b2' }}>
                            <div className={styles.cardAccentBar} />
                            <div className={styles.cardBody}>
                                <div className={styles.cardTitle}>
                                    {t({ en: 'CPFIK — Kurdish Federal Blueprint', fa: 'CPFIK — طرح فدرال کردستان' })}
                                </div>
                                <div className={styles.cardMeta}>
                                    {t({
                                        en: 'Coalition of Political Forces of Iranian Kurdistan',
                                        fa: 'ائتلاف نیروهای سیاسی کردستان ایران',
                                    })}
                                </div>
                                <div className={styles.cardTag}>
                                    {t({ en: 'Federal Liberation · Active Military Operations', fa: 'رهایی فدرال · عملیات نظامی فعال' })}
                                </div>
                            </div>
                            <span className={styles.cardArrow}>→</span>
                        </Link>

                        <Link to="/transitional/plan/uri" className={styles.card} style={{ '--card-accent': '#e8507a' }}>
                            <div className={styles.cardAccentBar} />
                            <div className={styles.cardBody}>
                                <div className={styles.cardTitle}>
                                    {t({ en: 'URI / Hamgami Coalition', fa: 'ائتلاف URI / همگامی' })}
                                </div>
                                <div className={styles.cardMeta}>
                                    {t({
                                        en: 'United Republicans of Iran & Hamgami Coalition',
                                        fa: 'جمهوری‌خواهان متحد ایران و ائتلاف همگامی',
                                    })}
                                </div>
                                <div className={styles.cardTag}>
                                    {t({ en: 'Secular Republic · Two-Phase Transition', fa: 'جمهوری سکولار · انتقال دو مرحله‌ای' })}
                                </div>
                            </div>
                            <span className={styles.cardArrow}>→</span>
                        </Link>

                        <Link to="/transitional/plan/civil-society" className={styles.card} style={{ '--card-accent': '#ffd166' }}>
                            <div className={styles.cardAccentBar} />
                            <div className={styles.cardBody}>
                                <div className={styles.cardTitle}>
                                    {t({ en: 'Iran Civil Society Charter', fa: 'منشور جامعه مدنی ایران' })}
                                </div>
                                <div className={styles.cardMeta}>
                                    {t({
                                        en: 'Civil Society Research & Advocacy Network',
                                        fa: 'شبکه پژوهش و حمایت جامعه مدنی',
                                    })}
                                </div>
                                <div className={styles.cardTag}>
                                    {t({ en: 'Civil Society Framework', fa: 'چارچوب جامعه مدنی' })}
                                </div>
                            </div>
                            <span className={styles.cardArrow}>→</span>
                        </Link>
                    </div>
                </section>

                <section className={styles.section}>
                    <div className={styles.sectionLabel}>
                        {t({ en: 'THE ARENA', fa: 'آرنا' })}
                    </div>
                    <Link to="/arena" className={styles.arenaCard}>
                        <div className={styles.arenaCardBody}>
                            <div className={styles.arenaCardTitle}>
                                {t({ en: 'Transition Arena', fa: 'آرنای انتقال' })}
                            </div>
                            <div className={styles.arenaCardDesc}>
                                {t({
                                    en: 'View live plans being endorsed and debated by the community',
                                    fa: 'مشاهده طرح‌های زنده که توسط جامعه تأیید و بحث می‌شوند',
                                })}
                            </div>
                        </div>
                        <span className={styles.cardArrow}>→</span>
                    </Link>
                </section>

                <div className={styles.footer}>
                    <Link to="/compare/transition" className={styles.footerLink}>
                        {t({ en: 'Compare transitional plans side by side →', fa: '← مقایسه طرح‌های انتقالی در کنار هم' })}
                    </Link>
                </div>
            </div>
        </div>
    );
}
