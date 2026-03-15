import { createClient } from '@supabase/supabase-js';
import { getCallerIdFromReq, awardScoreForUser } from './civic.js';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export async function listAmendments(planId) {
  if (!planId) throw { status: 400, error: 'planId required' };
  const { data, error } = await supabase
    .from('amendments')
    .select('*')
    .eq('plan_id', planId)
    .order('created_at', { ascending: false });
  if (error) throw { status: 500, error: 'Failed to load amendments' };
  return { ok: true, amendments: data || [] };
}

export async function proposeAmendment(req) {
  const callerId = await getCallerIdFromReq(req);
  if (!callerId) throw { status: 401, error: 'Unauthorized' };
  const body = await new Promise((res) => { let d=''; req.on('data',c=>d+=c); req.on('end',()=>{try{res(JSON.parse(d||'{}'))}catch(e){res({})}}); });
  const { planId, title, text } = body;
  if (!planId || !title || !text) throw { status: 400, error: 'planId, title, text required' };
  const { error: insErr } = await supabase.from('amendments').insert({ plan_id: planId, proposer_id: callerId, title, text });
  if (insErr) throw { status: 500, error: 'Failed to create amendment' };
  // award score for proposing amendment
  await awardScoreForUser(callerId, 'amendment_proposed', { plan_id: planId });
  return { ok: true };
}

export async function voteAmendment(req) {
  const callerId = await getCallerIdFromReq(req);
  if (!callerId) throw { status: 401, error: 'Unauthorized' };
  const body = await new Promise((res) => { let d=''; req.on('data',c=>d+=c); req.on('end',()=>{try{res(JSON.parse(d||'{}'))}catch(e){res({})}}); });
  const { amendmentId, vote } = body;
  if (!amendmentId || !['yes','no'].includes(vote)) throw { status: 400, error: 'amendmentId and vote (yes/no) required' };
  // upsert vote
  const { error: upsertErr } = await supabase.from('amendment_votes').upsert({ amendment_id: amendmentId, user_id: callerId, vote }, { onConflict: ['amendment_id','user_id'] });
  if (upsertErr) throw { status: 500, error: 'Failed to record vote' };
  await awardScoreForUser(callerId, 'amendment_vote', { amendment_id: amendmentId, vote });
  return { ok: true };
}
