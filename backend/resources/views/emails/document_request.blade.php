<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Document Request Confirmation</title>
  <style>
    body { margin: 0; padding: 0; background: #f4f6f9; font-family: 'Segoe UI', Arial, sans-serif; }
    .wrapper { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #1a3a6e 0%, #2d5cb8 100%); padding: 36px 40px; text-align: center; }
    .header img { width: 56px; margin-bottom: 12px; }
    .header h1 { color: #ffffff; font-size: 22px; margin: 0; letter-spacing: 0.5px; }
    .header p { color: #c8d8f5; font-size: 13px; margin: 6px 0 0; }
    .body { padding: 40px; }
    .body h2 { color: #1a3a6e; font-size: 20px; margin: 0 0 8px; }
    .body p { color: #555; font-size: 15px; line-height: 1.7; margin: 0 0 16px; }
    .tracking-box { background: #f0f5ff; border: 1.5px dashed #2d5cb8; border-radius: 8px; padding: 20px 24px; text-align: center; margin: 24px 0; }
    .tracking-box .label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #888; margin-bottom: 6px; }
    .tracking-box .code { font-size: 28px; font-weight: 700; color: #1a3a6e; letter-spacing: 3px; }
    .info-row { display: flex; justify-content: space-between; background: #f9f9f9; border-radius: 8px; padding: 14px 18px; margin-bottom: 10px; }
    .info-row .key { font-size: 13px; color: #888; }
    .info-row .val { font-size: 13px; font-weight: 600; color: #333; }
    .note { background: #fffbea; border-left: 4px solid #f5c518; padding: 14px 18px; border-radius: 0 8px 8px 0; font-size: 13px; color: #7a6000; margin-top: 24px; }
    .footer { background: #f4f6f9; padding: 24px 40px; text-align: center; }
    .footer p { font-size: 12px; color: #aaa; margin: 0; }
    .footer a { color: #2d5cb8; text-decoration: none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>Barangay Olympia</h1>
      <p>Official Barangay Services Portal</p>
    </div>
    <div class="body">
      <h2>Hello, {{ $firstName }}! 👋</h2>
      <p>Your document request has been successfully submitted. Our staff will review it and process your request as soon as possible.</p>

      <div class="tracking-box">
        <div class="label">Tracking Number</div>
        <div class="code">{{ $trackingNumber }}</div>
      </div>

      <div class="info-row">
        <span class="key">Document Requested</span>
        <span class="val">{{ $documentName }}</span>
      </div>
      <div class="info-row">
        <span class="key">Status</span>
        <span class="val">⏳ Pending Review</span>
      </div>

      <div class="note">
        📌 Please keep your tracking number safe. You may use it to follow up on the status of your request at the Barangay Hall or through our portal.
      </div>

      <p style="margin-top: 24px;">If you did not make this request, please contact us immediately at the Barangay Hall.</p>
    </div>
    <div class="footer">
      <p>© {{ date('Y') }} Barangay Olympia &nbsp;|&nbsp; This is an automated message, please do not reply.</p>
    </div>
  </div>
</body>
</html>
