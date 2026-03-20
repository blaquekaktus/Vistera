/**
 * Vistera – Database seed script
 *
 * Creates the 4 demo agents as auth users and seeds all 8 properties + VR tours.
 *
 * Requirements:
 *   - NEXT_PUBLIC_SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY  (never expose client-side)
 *
 * Usage:
 *   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co \
 *   SUPABASE_SERVICE_ROLE_KEY=eyJ... \
 *   npx tsx supabase/seed.ts
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

  // ── 0. Pre-flight: verify migrations have been applied ──────────────────────
  const { error: preflightErr } = await (supabase as any)
    .from('profiles')
    .select('id')
    .limit(1);
  if (preflightErr) {
    console.error('❌  Pre-flight failed — migrations may not have been applied.');
    console.error(`   ${preflightErr.message}`);
    process.exit(1);
  }
  console.log('✅  Database schema verified.\n');

  // ── 1. Create agent auth users ──────────────────────────────────────────────
  const agentIdMap: Record<string, string> = {};

  for (const agent of agents) {
    console.log(`👤  Creating agent: ${agent.name}`);

    // Try to create; skip if email already exists
    const { data: existing } = await (supabase.auth.admin as any).listUsers();
    const alreadyExists = existing?.users?.find((u: any) => u.email === agent.email);

    let userId: string;

    if (alreadyExists) {
      userId = alreadyExists.id;
      console.log(`    ↳ Already exists — reusing ${userId}`);
    } else {
      const { data, error } = await (supabase.auth.admin as any).createUser({
        email: agent.email,
        password: 'Vistera2024!',
        email_confirm: true,
        user_metadata: {
          name: agent.name,
          role: 'agent',
        },
      });

      if (error) {
        console.error(`    ❌ ${JSON.stringify(error)}`);
        continue;
      }

      userId = data.user.id;
      console.log(`    ✅  Created — ${userId}`);
    }

    agentIdMap[agent.id] = userId;

    // Upsert profile (service role bypasses RLS; handles case where trigger didn't fire)
    const { error: profileErr } = await (supabase as any)
      .from('profiles')
      .upsert({
        id: userId,
        name: agent.name,
        role: 'agent',
        phone: agent.phone,
      });
    if (profileErr) console.warn(`    ⚠️  Profile upsert: ${profileErr.message}`);

    // Upsert agent_profile
    const { error: agentProfileErr } = await (supabase as any)
      .from('agent_profiles')
      .upsert({
        id: userId,
        agency: agent.agency,
        region: agent.region,
        languages: agent.languages,
        rating: agent.rating,
        review_count: agent.reviewCount,
      });
    if (agentProfileErr) console.warn(`    ⚠️  Agent profile upsert: ${agentProfileErr.message}`);
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
        agent_id: agentDbId,
        title: prop.title,
        title_de: prop.titleDe,
        description: prop.description,
        description_de: prop.descriptionDe,
        type: prop.type,
        listing_type: prop.listingType,
        price: prop.price,
        currency: prop.currency,
        price_per_sqm: prop.pricePerSqm ?? null,
        street: prop.address.street,
        city: prop.address.city,
        region: prop.address.region,
        country: prop.address.country,
        postal_code: prop.address.postalCode,
        lat: prop.address.lat,
        lng: prop.address.lng,
        rooms: prop.features.rooms,
        bedrooms: prop.features.bedrooms,
        bathrooms: prop.features.bathrooms,
        area: prop.features.area,
        plot_area: prop.features.plotArea ?? null,
        floor: prop.features.floor ?? null,
        total_floors: prop.features.totalFloors ?? null,
        year_built: prop.features.yearBuilt ?? null,
        parking: prop.features.parking,
        elevator: prop.features.elevator,
        balcony: prop.features.balcony,
        garden: prop.features.garden,
        cellar: prop.features.cellar,
        energy_class: prop.features.energyClass ?? null,
        amenities: prop.amenities,
        images: prop.images,
        status: prop.status,
        featured: prop.featured,
        views: prop.views,
        vr_views: prop.vrViews,
      })
      .select('id')
      .single();

    if (propErr) {
      console.error(`    ❌ ${propErr.message}`);
      continue;
    }

    // Insert VR tours
    for (let i = 0; i < prop.vrTours.length; i++) {
      const tour = prop.vrTours[i];
      await (supabase as any).from('vr_tours').insert({
        property_id: propRow.id,
        panorama_url: tour.panoramaUrl,
        thumbnail_url: tour.thumbnailUrl,
        room_name: tour.roomName,
        room_name_de: tour.roomNameDe,
        sort_order: i,
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
