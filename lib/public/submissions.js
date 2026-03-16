import { createClient } from '@supabase/supabase-js';
import { getCallerIdFromReq, awardScoreForUser } from './civic.js';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const TITLE_REGEX = /^[\u0600-\u06FFa-zA-Z0-9\s\u200c\-.,:()'"/&—–]+$/;
const URL_REGEX = /^https:\/\/.{3,}/;

export async function submitPlan(req) {
  const callerId = await getCallerIdFromReq(req);
  if (!callerId) throw { status: 401, error: 'Unauthorized' };
  const { title_en, title_fa, summary_en, summary_fa, full_doc_url } = req.body || {};
  if (!title_en || typeof title_en !== 'string' || title_en.trim().length < 5)
    throw { status: 400, error: 'English title must be at least 5 characters.' };
  if (title_en.trim().length > 120 || !TITLE_REGEX.test(title_en.trim()))
    throw { status: 400, error: 'English title contains invalid characters or exceeds 120 characters.' };
  if (!summary_en || typeof summary_en !== 'string' || summary_en.trim().length < 50)
    throw { status: 400, error: 'English summary must be at least 50 characters.' };
  if (summary_en.trim().length > 2000)
    throw { status: 400, error: 'English summary exceeds 2000 characters.' };
  if (title_fa && title_fa.trim().length > 120)
    throw { status: 400, error: 'Farsi title exceeds 120 characters.' };
  if (summary_fa && summary_fa.trim().length > 2000)
    throw { status: 400, error: 'Farsi summary exceeds 2000 characters.' };
  if (full_doc_url && !URL_REGEX.test(full_doc_url))
    throw { status: 400, error: 'Document URL must start with https://.' };
  // Check caller's civic_score (must be MID or HIGH -> civic_score >=4)
  const { data: profile } = await supabase.from('profiles').select('civic_score').eq('id', callerId).maybeSingle();
  if ((profile?.civic_score || 0) < 4) throw { status: 403, error: 'Insufficient civic score to submit plan' };
  const { error: insErr, data } = await supabase.from('transitional_plans').insert({ name_en: title_en, name_fa: title_fa || null, summary_en: summary_en, summary_fa: summary_fa || null, full_doc_url: full_doc_url || null, status: 'incubator' }).select('id').maybeSingle();
  if (insErr) throw { status: 500, error: 'Failed to submit plan' };
  const planId = data?.id;
  await awardScoreForUser(callerId, 'plan_submitted', { plan_id: planId });
  return { ok: true, planId };
}
