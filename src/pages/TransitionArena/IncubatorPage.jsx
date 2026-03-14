import React from 'react';
import { useLang } from '../../contexts/LangContext';

export default function IncubatorPage() {
  const { t } = useLang();

  return (
    <div className="incubator-page">
      <h1>{t('incubator_title')}</h1>
      <p>{t('incubator_description')}</p>
      {/* Placeholder for user-generated plans */}
    </div>
  );
}
