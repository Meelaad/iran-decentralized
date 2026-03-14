import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useLang } from '../../contexts/LangContext';
import './TransitionArenaLayout.css';

export default function TransitionArenaLayout() {
  const { t } = useLang();

  return (
    <div className="transition-arena-layout">
      <nav className="transition-arena-nav">
        <NavLink to="/transition/main-stage">{t('main_stage_nav')}</NavLink>
        <NavLink to="/transition/incubator">{t('incubator_nav')}</NavLink>
        <NavLink to="/transition/amendment-floor">{t('amendment_floor_nav')}</NavLink>
        <NavLink to="/transition/shadow-cabinet">{t('shadow_cabinet_nav')}</NavLink>
      </nav>
      <main className="transition-arena-content">
        <Outlet />
      </main>
    </div>
  );
}
