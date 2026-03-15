import { createClient } from '@supabase/supabase-js';
import { getCallerIdFromReq, awardScoreForUser } from './civic.js';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export async function submitPlan(req) {
  const callerId = await getCallerIdFromReq(req);
  if (!callerId) throw { status: 401, error: 'Unauthorized' };
  const body = await new Promise((res) => { let d=''; req.on('data',c=>d+=c); req.on('end',()=>{try{res(JSON.parse(d||'{}'))}catch(e){res({})}}); });
  const { title_en, title_fa, summary_en, summary_fa, full_doc_url } = body;
  if (!title_en || !summary_en) throw { status: 400, error: 'title_en and summary_en required' };
  // Check caller's civic_score (must be MID or HIGH -> civic_score >=4)
  const { data: profile } = await supabase.from('profiles').select('civic_score').eq('id', callerId).maybeSingle();
  if ((profile?.civic_score || 0) < 4) throw { status: 403, error: 'Insufficient civic score to submit plan' };
  const { error: insErr, data } = await supabase.from('transitional_plans').insert({ name_en: title_en, name_fa: title_fa || null, summary_en: summary_en, summary_fa: summary_fa || null, full_doc_url: full_doc_url || null, status: 'incubator' }).select('id').maybeSingle();
  if (insErr) throw { status: 500, error: 'Failed to submit plan' };
  const planId = data?.id;
  await awardScoreForUser(callerId, 'plan_submitted', { plan_id: planId });
  return { ok: true, planId };
}
