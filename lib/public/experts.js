import { createClient } from '@supabase/supabase-js';
import { getCallerIdFromReq, awardScoreForUser } from './civic.js';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export async function voteExpert(req) {
  const callerId = await getCallerIdFromReq(req);
  if (!callerId) throw { status: 401, error: 'Unauthorized' };
  const body = await new Promise((res) => { let d=''; req.on('data',c=>d+=c); req.on('end',()=>{try{res(JSON.parse(d||'{}'))}catch(e){res({})}}); });
  const { expertId, score } = body;
  if (!expertId || typeof score !== 'number') throw { status: 400, error: 'expertId and numeric score required' };
  const { error: upsertErr } = await supabase.from('expert_votes').upsert({ expert_id: expertId, user_id: callerId, score }, { onConflict: ['expert_id','user_id'] });
  if (upsertErr) throw { status: 500, error: 'Failed to vote expert' };
  await awardScoreForUser(callerId, 'expert_vote', { expert_id: expertId, score });
  return { ok: true };
}

export async function nominateExpert(req) {
  const callerId = await getCallerIdFromReq(req);
  if (!callerId) throw { status: 401, error: 'Unauthorized' };
  const body = await new Promise((res) => { let d=''; req.on('data',c=>d+=c); req.on('end',()=>{try{res(JSON.parse(d||'{}'))}catch(e){res({})}}); });
  const { planId, display_name, role, bio } = body;
  if (!planId || !display_name) throw { status: 400, error: 'planId and display_name required' };
  const { error: insErr } = await supabase.from('experts').insert({ plan_id: planId, display_name, role: role || null, bio: bio || null, nominated_by: callerId });
  if (insErr) throw { status: 500, error: 'Failed to nominate expert' };
  await awardScoreForUser(callerId, 'comment_posted', { plan_id: planId });
  return { ok: true };
}

export async function postExpertQA(req) {
  const callerId = await getCallerIdFromReq(req);
  if (!callerId) throw { status: 401, error: 'Unauthorized' };
  const body = await new Promise((res) => { let d=''; req.on('data',c=>d+=c); req.on('end',()=>{try{res(JSON.parse(d||'{}'))}catch(e){res({})}}); });
  const { expertId, question, answer } = body;
  if (!expertId || !question) throw { status: 400, error: 'expertId and question required' };
  const { error: insErr } = await supabase.from('expert_qa').insert({ expert_id: expertId, user_id: callerId, question, answer: answer || null });
  if (insErr) throw { status: 500, error: 'Failed to post QA' };
  await awardScoreForUser(callerId, 'comment_posted', { expert_id: expertId });
  return { ok: true };
}
