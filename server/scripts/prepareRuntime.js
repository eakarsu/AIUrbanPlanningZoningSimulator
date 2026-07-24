'use strict';
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const pool = require('../db');

async function main() {
  if (!['true', '1'].includes(process.env.ALLOW_SCHEMA_MIGRATION || '')) {
    throw new Error('ALLOW_SCHEMA_MIGRATION=true is required');
  }
  const email = (process.env.PROVISION_ADMIN_EMAIL || '').trim().toLowerCase();
  const password = process.env.PROVISION_ADMIN_PASSWORD || '';
  const name = (process.env.PROVISION_ADMIN_NAME || '').trim();
  const tenantName = (process.env.GOVERNANCE_TENANT_ID || '').trim();
  if (!email || !name || !tenantName || password.length < 12) {
    throw new Error('runtime admin email, name, tenant, and a 12+ character password are required');
  }
  const migration = fs.readFileSync(path.resolve(__dirname, '../migrations/001_governed_zoning.sql'), 'utf8');
  await pool.query(migration);
  await pool.query(`CREATE TABLE IF NOT EXISTS zoning_ai_results (
    id BIGSERIAL PRIMARY KEY,
    tenant_id BIGINT NOT NULL REFERENCES zoning_tenants(id),
    user_id BIGINT NOT NULL REFERENCES zoning_users(id),
    feature_type TEXT NOT NULL,
    input_data JSONB NOT NULL,
    result JSONB NOT NULL,
    model_used TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )`);
  const hash = await bcrypt.hash(password, 12);
  const user = await pool.query(
    `INSERT INTO zoning_users(email,password_hash,name) VALUES($1,$2,$3)
     ON CONFLICT(email) DO UPDATE SET password_hash=EXCLUDED.password_hash,name=EXCLUDED.name RETURNING id`,
    [email, hash, name]
  );
  let tenant = await pool.query('SELECT id FROM zoning_tenants WHERE name=$1 ORDER BY id LIMIT 1', [tenantName]);
  if (!tenant.rows[0]) tenant = await pool.query('INSERT INTO zoning_tenants(name) VALUES($1) RETURNING id', [tenantName]);
  await pool.query(
    `INSERT INTO zoning_memberships(tenant_id,user_id,role,active) VALUES($1,$2,'admin',TRUE)
     ON CONFLICT(tenant_id,user_id) DO UPDATE SET role='admin',active=TRUE`,
    [tenant.rows[0].id, user.rows[0].id]
  );
  console.log('Runtime schema and administrator are ready.');
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; }).finally(() => pool.end());
