import React from 'react';
import { useLang } from '../../contexts/LangContext';

export default function ShadowCabinetPage() {
  const { t } = useLang();

  return (
    <div className="shadow-cabinet-page">
      <h1>{t('shadow_cabinet_title')}</h1>
      <p>{t('shadow_cabinet_description')}</p>
      {/* Placeholder for sector nominations and ranked-choice voting */}
    </div>
  );
}
