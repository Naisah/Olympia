<!DOCTYPE html>
<html>
<head>
    <title>Service Reservation Update</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; }
        .header { background-color: #1e3a8a; color: white; padding: 15px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 20px; }
        .status { font-size: 18px; font-weight: bold; color: #3b82f6; }
        .footer { margin-top: 20px; font-size: 12px; color: #6b7280; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Barangay Olympia</h2>
        </div>
        <div class="content">
            <p>Dear {{ $serviceReservation->resident->first_name ?? 'Resident' }},</p>
            
            <p>There has been an update regarding your service reservation for <strong>{{ $serviceReservation->service->name ?? 'a service' }}</strong>.</p>
            
            <p>Reservation Date/Time: {{ $serviceReservation->reservation_date ?? 'N/A' }} {{ $serviceReservation->time_slot ?? '' }}</p>

            <p>The current status of your reservation is now: <span class="status">{{ $serviceReservation->status }}</span></p>

            @if($serviceReservation->status === 'Approved')
                <p>Your reservation is confirmed! Please arrive 15 minutes before your scheduled time. Do not forget to bring any required documents or valid IDs.</p>
            @endif

            <p>Thank you,<br>Barangay Olympia Administration</p>
        </div>
        <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
