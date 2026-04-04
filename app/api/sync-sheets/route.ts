import { NextResponse } from 'next/server';
import { google } from 'googleapis';

// This API route securely pushes lead data from our NextJS app directly to Google Sheets Tab 2
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, businessId, businessName, source } = body;

    // We require the Google Service Account credentials to be in .env.local
    const { GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SPREADSHEET_ID } = process.env;

    if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_SPREADSHEET_ID) {
      console.warn('Google Sheets API credentials missing. Simulating success for dev environment.');
      return NextResponse.json({ success: true, message: 'Simulated sync (credentials missing)' });
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
        // Replace escaped newlines with actual newlines
        private_key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
      ],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    
    // Target "TAB 2: LEAD CAPTURE" based on the project spec
    // We assume columns are: Timestamp, Name, Email, Phone, Business Voted For, Source
    const targetRange = 'TAB 2: LEAD CAPTURE!A:F';
    
    const timestamp = new Date().toISOString();
    
    await sheets.spreadsheets.values.append({
      spreadsheetId: GOOGLE_SPREADSHEET_ID,
      range: targetRange,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          [timestamp, name, email, phone, businessName || businessId, source]
        ]
      }
    });

    return NextResponse.json({ success: true, message: 'Data synced to Google Sheets successfully' });

  } catch (error: any) {
    console.error('Error syncing to Google Sheets:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to sync to Google Sheets' },
      { status: 500 }
    );
  }
}
