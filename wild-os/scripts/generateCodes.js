#!/usr/bin/env node
// Usage: node scripts/generateCodes.js <tier> <count>
// Generates unlock codes + SQL INSERT statements for supabase/seed.sql
// Example: node scripts/generateCodes.js T1 20

import { createHash, randomBytes } from 'crypto';

const [,, tier = 'T1', countArg = '10'] = process.argv;
const count = parseInt(countArg, 10);

if (!['T1','T2','T3'].includes(tier)) {
  console.error('Tier must be T1, T2 or T3');
  process.exit(1);
}

const PREFIX = { T1: 'FOUND', T2: 'ADVAN', T3: 'MASTE' };

console.log('-- Generated codes for tier:', tier);
console.log('-- Keep the plaintext codes PRIVATE, only insert the hashes');
console.log();

for (let i = 0; i < count; i++) {
  const rand = randomBytes(4).toString('hex').toUpperCase();
  const code = PREFIX[tier] + '-' + rand.slice(0,4) + '-' + rand.slice(4);
  const hash = createHash('sha256').update(code).digest('hex');
  console.log('-- Plaintext:', code);
  console.log("INSERT INTO public.unlock_codes (code_hash, tier) VALUES ('" + hash + "', '" + tier + "');");
  console.log();
}
