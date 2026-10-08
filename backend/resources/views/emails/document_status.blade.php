<!DOCTYPE html>
<html>
<head>
    <title>Document Request Update</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; }
        .header { background-color: #1e3a8a; color: white; padding: 15px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 20px; }
        .status { font-size: 18px; font-weight: bold; color: #10b981; }
        .footer { margin-top: 20px; font-size: 12px; color: #6b7280; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Barangay Olympia</h2>
        </div>
        <div class="content">
            <p>Dear {{ $document->resident->first_name ?? 'Resident' }},</p>
            
            <p>There has been an update regarding your document request for <strong>{{ $document->documentType->name ?? 'a document' }}</strong>.</p>
            
            <p>The current status of your request is now: <span class="status">{{ $document->status }}</span></p>

            @if($document->status === 'Ready for Pick-up')
                <p>You may now visit the Barangay Hall to claim your document. Please bring a valid ID for verification.</p>
            @elseif($document->status === 'Approved')
                <p>Your request has been approved and is currently being processed. We will notify you once it is ready for pick-up.</p>
            @endif

            <p>Thank you,<br>Barangay Olympia Administration</p>
        </div>
        <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
