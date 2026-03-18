import type { Property } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DbPropertyRow = Record<string, any>;

/**
 * Maps a Supabase `properties` row (with joined vr_tours and agent) to the
 * app-level Property type used by all client components.
 *
 * Expected Supabase query shape:
 *   .select(`
 *     *,
 *     vr_tours(id, panorama_url, thumbnail_url, room_name, room_name_de),
 *     agent:profiles!agent_id(
 *       id, name, avatar_url, phone,
 *       agent_profiles(agency, region, languages, rating, review_count)
 *     )
 *   `)
 */
export function mapDbProperty(row: DbPropertyRow): Property {
  const ap = row.agent?.agent_profiles;

  return {
    id: row.id,
    title: row.title,
    titleDe: row.title_de ?? row.title,
    description: row.description ?? '',
    descriptionDe: row.description_de ?? row.description ?? '',
    type: row.type,
    listingType: row.listing_type,
    price: Number(row.price),
    currency: row.currency,
    pricePerSqm: row.price_per_sqm ? Number(row.price_per_sqm) : undefined,
    address: {
      street: row.street ?? '',
      city: row.city,
      region: row.region ?? '',
      country: row.country,
      postalCode: row.postal_code ?? '',
      lat: Number(row.lat ?? 0),
      lng: Number(row.lng ?? 0),
    },
    features: {
      rooms: row.rooms ?? 0,
      bedrooms: row.bedrooms ?? 0,
      bathrooms: row.bathrooms ?? 0,
      area: Number(row.area),
      plotArea: row.plot_area ? Number(row.plot_area) : undefined,
      floor: row.floor ?? undefined,
      totalFloors: row.total_floors ?? undefined,
      yearBuilt: row.year_built ?? undefined,
      parking: row.parking ?? false,
      elevator: row.elevator ?? false,
      balcony: row.balcony ?? false,
      garden: row.garden ?? false,
      cellar: row.cellar ?? false,
      energyClass: row.energy_class ?? undefined,
    },
    amenities: row.amenities ?? [],
    images: row.images ?? [],
    vrTours: (row.vr_tours ?? []).map((vt: DbPropertyRow) => ({
      id: vt.id,
      panoramaUrl: vt.panorama_url,
      thumbnailUrl: vt.thumbnail_url ?? '',
      roomName: vt.room_name ?? '',
      roomNameDe: vt.room_name_de ?? '',
    })),
    agent: {
      id: row.agent?.id ?? '',
      name: row.agent?.name ?? '',
      agency: ap?.agency ?? '',
      phone: row.agent?.phone ?? '',
      email: '',
      avatar: row.agent?.avatar_url ?? '',
      region: ap?.region ?? '',
      languages: ap?.languages ?? [],
      propertiesCount: 0,
      rating: Number(ap?.rating ?? 0),
      reviewCount: ap?.review_count ?? 0,
    },
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    views: row.views ?? 0,
    vrViews: row.vr_views ?? 0,
    featured: row.featured ?? false,
  };
}

const PROPERTY_SELECT = `
  *,
  vr_tours(id, panorama_url, thumbnail_url, room_name, room_name_de, sort_order),
  agent:profiles!agent_id(
    id, name, avatar_url, phone,
    agent_profiles(agency, region, languages, rating, review_count)
  )
`.trim();

export { PROPERTY_SELECT };
