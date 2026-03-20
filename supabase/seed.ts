/**
 * Vistera – Database seed script
 *
 * Creates the 4 demo agents and seeds all 8 properties + VR tours.
 *
 * Requirements:
 *   - NEXT_PUBLIC_SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY  (never expose client-side)
 *
 * One-time setup:
 *   Run supabase/migrations/005_seed_helper.sql in your Supabase SQL Editor,
 *   then run:  npm run seed
 */

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import { createClient } from '@supabase/supabase-js';
import { agents, properties } from '../src/lib/data';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('❌  NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.');
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function run() {
  console.log('🌱  Seeding Vistera database…\n');

  // ── 0. Pre-flight: confirm schema exists ────────────────────────────────────
  const { error: preflightErr } = await supabase
    .from('profiles')
    .select('id')
    .limit(1);
  if (preflightErr) {
    console.error('❌  Schema missing — run 001_initial_schema.sql in your Supabase SQL Editor first.');
    console.error(`    ${preflightErr.message}`);
    process.exit(1);
  }
  console.log('✅  Schema verified.\n');

  // ── 1. Create agent users via the seed helper RPC ───────────────────────────
  //
  // create_seed_user() does three things atomically:
  //   1. Repairs the handle_new_user trigger (fixes the v1 bug)
  //   2. Inserts directly into auth.users (bypasses Supabase Auth API)
  //   3. Upserts profiles + agent_profiles with full data
  //
  // If the function is not found (PGRST202), the migration hasn't been run yet.

  const agentIdMap: Record<string, string> = {};
  let migrationMissing = false;

  for (const agent of agents) {
    console.log(`👤  Creating agent: ${agent.name}`);

    const { data: userId, error } = await supabase.rpc('create_seed_user', {
      p_email:        agent.email,
      p_name:         agent.name,
      p_phone:        agent.phone,
      p_agency:       agent.agency,
      p_region:       agent.region,
      p_languages:    agent.languages,
      p_rating:       agent.rating,
      p_review_count: agent.reviewCount,
    });

    if (error) {
      if (error.code === 'PGRST202') {
        console.error('\n❌  create_seed_user function not found in your database.');
        console.error('    Run this file in your Supabase SQL Editor first:');
        console.error('    → supabase/migrations/005_seed_helper.sql');
        console.error('    Then run npm run seed again.\n');
        migrationMissing = true;
        break;
      }
      console.error(`    ❌ ${error.message}`);
      continue;
    }

    agentIdMap[agent.id] = userId as string;
    console.log(`    ✅  ${userId}`);
  }

  if (migrationMissing) process.exit(1);

  console.log('');

  // ── 2. Insert properties and VR tours ───────────────────────────────────────
  for (const prop of properties) {
    const agentDbId = agentIdMap[prop.agent.id];
    if (!agentDbId) {
      console.warn(`⚠️   Skipping "${prop.titleDe}" — agent not seeded`);
      continue;
    }

    console.log(`🏠  Inserting: ${prop.titleDe}`);

    const { data: propRow, error: propErr } = await supabase
      .from('properties')
      .insert({
        agent_id:       agentDbId,
        title:          prop.title,
        title_de:       prop.titleDe,
        description:    prop.description,
        description_de: prop.descriptionDe,
        type:           prop.type,
        listing_type:   prop.listingType,
        price:          prop.price,
        currency:       prop.currency,
        price_per_sqm:  prop.pricePerSqm    ?? null,
        street:         prop.address.street,
        city:           prop.address.city,
        region:         prop.address.region,
        country:        prop.address.country,
        postal_code:    prop.address.postalCode,
        lat:            prop.address.lat,
        lng:            prop.address.lng,
        rooms:          prop.features.rooms,
        bedrooms:       prop.features.bedrooms,
        bathrooms:      prop.features.bathrooms,
        area:           prop.features.area,
        plot_area:      prop.features.plotArea    ?? null,
        floor:          prop.features.floor       ?? null,
        total_floors:   prop.features.totalFloors ?? null,
        year_built:     prop.features.yearBuilt   ?? null,
        parking:        prop.features.parking,
        elevator:       prop.features.elevator,
        balcony:        prop.features.balcony,
        garden:         prop.features.garden,
        cellar:         prop.features.cellar,
        energy_class:   prop.features.energyClass ?? null,
        amenities:      prop.amenities,
        images:         prop.images,
        status:         prop.status,
        featured:       prop.featured,
        views:          prop.views,
        vr_views:       prop.vrViews,
      })
      .select('id')
      .single();

    if (propErr) {
      console.error(`    ❌ property: ${propErr.message}`);
      continue;
    }

    for (let i = 0; i < prop.vrTours.length; i++) {
      const tour = prop.vrTours[i];
      const { error: vrErr } = await supabase.from('vr_tours').insert({
        property_id:   propRow.id,
        panorama_url:  tour.panoramaUrl,
        thumbnail_url: tour.thumbnailUrl,
        room_name:     tour.roomName,
        room_name_de:  tour.roomNameDe,
        sort_order:    i,
      });
      if (vrErr) console.error(`    ❌ vr_tour ${i}: ${vrErr.message}`);
    }

    console.log(`    ✅  ${prop.vrTours.length} VR tour${prop.vrTours.length !== 1 ? 's' : ''}`);
  }

  console.log('\n🎉  Seeding complete!');
  console.log('    Agent login password: Vistera2024!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
