import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { sendBookingConfirmation } from '@/lib/africas-talking';

/**
 * Create a new booking
 * POST /api/bookings
 */
export async function POST(req: NextRequest) {
  try {
    const { clientId, serviceId, bookingDate, bookingTime, notes } = await req.json();

    if (!clientId || !serviceId || !bookingDate || !bookingTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get service details
    const serviceResult = await sql`
      SELECT name, price FROM services WHERE id = ${serviceId}
    `;

    if (serviceResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    const service = serviceResult.rows[0];

    // Get user phone for SMS
    const userResult = await sql`
      SELECT phone FROM users WHERE id = ${clientId}
    `;

    // Create booking
    const bookingResult = await sql`
      INSERT INTO bookings (client_id, service_id, booking_date, booking_time, total_price, notes)
      VALUES (${clientId}, ${serviceId}, ${bookingDate}, ${bookingTime}, ${service.price}, ${notes || null})
      RETURNING *
    `;

    const booking = bookingResult.rows[0];

    // Send confirmation SMS
    if (userResult.rows.length > 0) {
      await sendBookingConfirmation(userResult.rows[0].phone, {
        serviceName: service.name,
        date: bookingDate,
        time: bookingTime,
        price: service.price,
      });
    }

    return NextResponse.json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error('Create booking error:', error);
    return NextResponse.json(
      { error: 'Failed to create booking', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * Get user's bookings
 * GET /api/bookings?clientId=xxx
 */
export async function GET(req: NextRequest) {
  try {
    const clientId = req.nextUrl.searchParams.get('clientId');

    if (!clientId) {
      return NextResponse.json(
        { error: 'clientId is required' },
        { status: 400 }
      );
    }

    const result = await sql`
      SELECT b.*, s.name as service_name, s.price
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      WHERE b.client_id = ${clientId}
      ORDER BY b.booking_date DESC
    `;

    return NextResponse.json({
      success: true,
      bookings: result.rows,
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings', details: String(error) },
      { status: 500 }
    );
  }
}
