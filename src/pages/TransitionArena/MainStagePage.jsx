import React from 'react';
import { useLang } from '../../contexts/LangContext';

export default function MainStagePage() {
  const { t } = useLang();

  return (
    <div className="main-stage-page">
      <h1>{t('main_stage_title')}</h1>
      <p>{t('main_stage_description')}</p>
      {/* Placeholder for active transitional plans */}
    </div>
  );
}
