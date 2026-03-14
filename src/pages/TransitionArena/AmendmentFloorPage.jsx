import React from 'react';
import { useLang } from '../../contexts/LangContext';

export default function AmendmentFloorPage() {
  const { t } = useLang();

  return (
    <div className="amendment-floor-page">
      <h1>{t('amendment_floor_title')}</h1>
      <p>{t('amendment_floor_description')}</p>
      {/* Placeholder for line-item edits and voting */}
    </div>
  );
}
