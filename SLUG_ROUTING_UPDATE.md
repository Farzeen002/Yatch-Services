# Slug-Based URL Routing Update

## Overview

Updated the yacht detail pages to use SEO-friendly slug URLs instead of UUIDs.

## Changes

### Before

```
/yachts/752344fa-2c34-4c23-8a85-ec256695da35
```

### After

```
/yachts/azure-explorer
```

## What Was Changed

### 1. New Utility Functions (`lib/slug-utils.ts`)

- `createSlug(name)` - Converts yacht names to URL-friendly slugs
- `slugToName(slug)` - Converts slugs back to searchable format
- `matchesSlug(yachtName, slug)` - Checks if a yacht name matches a slug

**Example:**

```typescript
createSlug("Azure Explorer"); // Returns: "azure-explorer"
createSlug("Ocean Dream"); // Returns: "ocean-dream"
```

### 2. API Route (`app/api/yachts/[id]/route.ts`)

- Updated to support **both UUID and slug** lookups
- Checks if the identifier is a UUID, otherwise treats it as a slug
- Backward compatible with existing UUID links

### 3. Frontend Route (`app/yachts/[slug]/page.tsx`)

- Renamed folder from `[id]` to `[slug]`
- Updated to fetch yacht data using slug instead of UUID
- All functionality remains the same

### 4. Component Updates

Updated all yacht links to use slugs:

- `components/featured-yachts.tsx` - Featured yacht cards
- `components/yachts-catalog.tsx` - Yacht catalog listings
- `components/user-bookings.tsx` - Booking history "View Yacht" buttons

## Benefits

<<<<<<< HEAD
 **SEO-Friendly URLs** - Better for search engine optimization
 **User-Friendly** - Easy to read and share (e.g., `/yachts/azure-explorer`)
 **Backward Compatible** - Old UUID links still work
 **Maintainable** - All slug logic centralized in `slug-utils.ts`
=======
✅ **SEO-Friendly URLs** - Better for search engine optimization
✅ **User-Friendly** - Easy to read and share (e.g., `/yachts/azure-explorer`)
✅ **Backward Compatible** - Old UUID links still work
✅ **Maintainable** - All slug logic centralized in `slug-utils.ts`
>>>>>>> landing-video

## How It Works

1. **User clicks on a yacht** → Link uses slug: `/yachts/azure-explorer`
2. **API receives request** → Checks if "azure-explorer" is a UUID
3. **Not a UUID** → Fetches all yachts and matches by slug
4. **Returns yacht data** → Frontend displays the page

## Examples

### Yacht Name to Slug Conversion

| Yacht Name         | Slug                 |
| ------------------ | -------------------- |
| Azure Explorer     | `azure-explorer`     |
| Ocean Dream        | `ocean-dream`        |
| Sunset Paradise    | `sunset-paradise`    |
| Luxury Escape 2024 | `luxury-escape-2024` |

## Testing

Test with any yacht name:

```
http://localhost:3000/yachts/azure-explorer
http://localhost:3000/yachts/ocean-dream
```

Old UUID links still work:

```
http://localhost:3000/yachts/752344fa-2c34-4c23-8a85-ec256695da35
```

## Notes

- Slugs are **case-insensitive** (Azure-Explorer = azure-explorer)
- Special characters are **automatically removed**
- Multiple spaces/hyphens are **collapsed** to single hyphens
- All components now use the centralized `createSlug()` function
