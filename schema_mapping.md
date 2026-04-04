# Spreadsheet JSON Mapping Schema

When pulling data from the "Business Tracker" Master Spreadsheet (e.g., via Google Sheets API or a syncing script into Supabase), the rows should map to the following JSON structure to conform with the frontend Next.js types.

## Industry Mapping
Map the generic overarching Industry groupings ensuring there is a total aggregated `revenue` value.

```json
{
  "id": "string (lowercase, hypnotic identifier e.g., 'real-estate')",
  "name": "string (Display Name e.g., 'Real Estate')",
  "weight": "number (Base sizing fallback logic, generally 50 to 100)",
  "revenue": "number (Used for the Phase 3 logarithmic scaling formula: R = max(BaseSize, log(v + 1) * ScaleFactor))"
}
```

## Business Mapping
Map the columns representing individual merchants within an industry.

```json
{
  "id": "string (unique string identifier)",
  "industry_id": "string (Must map to an existing Industry ID)",
  "name": "string (Business Name)",
  "tier": "string ('small' | 'medium' | 'large')",
  "logo_url": "string (Optional: URL to the monochromatic vector logo)",
  "tagline": "string (Optional: Short descriptive tagline)",
  "deal": "string (Optional: The Phase 4 'Unlockable Deal' shown after a vote)",
  "address": "string (Optional: formatted physical address for NAP data)",
  "phone": "string (Optional: formatted phone number for NAP data)",
  "vote_count": "number (Current live vote total)",
  "committed_date": "string (ISO 8601 Timestamp: used to find the earliest committed partners for the 1.5x D3 Hover Carousel)"
}
```

## Vote Action Mapping (TAB 2)
When the Next.js form pushes a lead/vote to the spreadsheet (or Supabase), it will upload the following structure.

```json
{
  "id": "string (UUID)",
  "business_id": "string",
  "voter_name": "string",
  "voter_email": "string",
  "voter_phone": "string (Used to fingerprint 1 vote per 24 hours)",
  "created_at": "string (ISO 8601 Timestamp)"
}
```
