/**
 * Vistera – Database seed script
 *
 * Creates the 4 demo agents and seeds all 8 properties + VR tours.
 *
 * Requirements:
 *   - NEXT_PUBLIC_SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY  (never expose client-side)
 *
 * One-time setup (if not done yet):
 *   Run supabase/migrations/005_seed_helper.sql in your Supabase SQL Editor,
 *   then run this script.
 *
 * Usage:
 *   npm run seed
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

  // ── 0. Pre-flight ────────────────────────────────────────────────────────────
  const { error: preflightErr } = await (supabase as any)
    .from('profiles')
    .select('id')
    .limit(1);
  if (preflightErr) {
    console.error('❌  Pre-flight failed — run 001_initial_schema.sql in your Supabase SQL Editor first.');
    console.error(`    ${preflightErr.message}`);
    process.exit(1);
  }

  // Verify the seed helper function exists
  const { error: fnCheckErr } = await (supabase as any).rpc('create_seed_user', {
    p_email: '__probe__@vistera.test',
    p_name: '', p_phone: '', p_agency: '', p_region: '',
    p_languages: [], p_rating: 0, p_review_count: 0,
  });
  // PGRST202 = function not found; anything else means the function exists but errored (expected for probe)
  if (fnCheckErr?.code === 'PGRST202') {
    console.error('❌  create_seed_user function not found.');
    console.error('    Run supabase/migrations/005_seed_helper.sql in your Supabase SQL Editor, then retry.');
    process.exit(1);
  }
  // Clean up probe user if it was accidentally created
  await (supabase.auth.admin as any).listUsers().then(async ({ data }: any) => {
    const probe = data?.users?.find((u: any) => u.email === '__probe__@vistera.test');
    if (probe) await (supabase.auth.admin as any).deleteUser(probe.id);
  }).catch(() => {});

  console.log('✅  Database ready.\n');

  // ── 1. Create agent auth users via RPC ──────────────────────────────────────
  const agentIdMap: Record<string, string> = {};

  for (const agent of agents) {
    console.log(`👤  Creating agent: ${agent.name}`);

    const { data: userId, error } = await (supabase as any).rpc('create_seed_user', {
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
      console.error(`    ❌ ${error.message}`);
      continue;
    }

    agentIdMap[agent.id] = userId as string;
    console.log(`    ✅  ${userId}`);
  }

  console.log('');

  // ── 2. Insert properties ────────────────────────────────────────────────────
  for (const prop of properties) {
    const agentDbId = agentIdMap[prop.agent.id];
    if (!agentDbId) {
      console.warn(`⚠️   Skipping "${prop.titleDe}" — agent not found`);
      continue;
    }

    console.log(`🏠  Inserting: ${prop.titleDe}`);

    const { data: propRow, error: propErr } = await (supabase as any)
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
        price_per_sqm:  prop.pricePerSqm ?? null,
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
        plot_area:      prop.features.plotArea ?? null,
        floor:          prop.features.floor ?? null,
        total_floors:   prop.features.totalFloors ?? null,
        year_built:     prop.features.yearBuilt ?? null,
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
      console.error(`    ❌ ${propErr.message}`);
      continue;
    }

    for (let i = 0; i < prop.vrTours.length; i++) {
      const tour = prop.vrTours[i];
      await (supabase as any).from('vr_tours').insert({
        property_id:   propRow.id,
        panorama_url:  tour.panoramaUrl,
        thumbnail_url: tour.thumbnailUrl,
        room_name:     tour.roomName,
        room_name_de:  tour.roomNameDe,
        sort_order:    i,
      });
    }

    console.log(`    ✅  Done (${prop.vrTours.length} VR tour${prop.vrTours.length !== 1 ? 's' : ''})`);
  }

  console.log('\n🎉  Seeding complete!');
  console.log('    Agent login password: Vistera2024!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
