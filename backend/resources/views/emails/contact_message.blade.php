<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New Contact Form Submission</title>
  <style>
    body { margin: 0; padding: 0; background: #f4f6f9; font-family: 'Segoe UI', Arial, sans-serif; }
    .wrapper { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #1a3a6e 0%, #2d5cb8 100%); padding: 36px 40px; text-align: center; }
    .header h1 { color: #ffffff; font-size: 22px; margin: 0; letter-spacing: 0.5px; }
    .body { padding: 40px; }
    .body h2 { color: #1a3a6e; font-size: 20px; margin: 0 0 16px; }
    .info-row { margin-bottom: 15px; }
    .info-row .key { font-size: 13px; color: #888; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px; display: block; margin-bottom: 4px; }
    .info-row .val { font-size: 15px; color: #333; background: #f9f9f9; padding: 12px 16px; border-radius: 8px; border: 1px solid #eee; }
    .message-box { font-size: 15px; color: #333; background: #f9f9f9; padding: 16px; border-radius: 8px; border: 1px solid #eee; white-space: pre-wrap; line-height: 1.6; }
    .footer { background: #f4f6f9; padding: 24px 40px; text-align: center; }
    .footer p { font-size: 12px; color: #aaa; margin: 0; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>Barangay Olympia</h1>
    </div>
    <div class="body">
      <h2>New Contact Form Submission</h2>
      
      <div class="info-row">
        <span class="key">Name</span>
        <div class="val">{{ $name }}</div>
      </div>
      
      <div class="info-row">
        <span class="key">Email</span>
        <div class="val">{{ $email }}</div>
      </div>

      <div class="info-row">
        <span class="key">Message</span>
        <div class="message-box">{{ $messageContent }}</div>
      </div>
    </div>
    <div class="footer">
      <p>© {{ date('Y') }} Barangay Olympia &nbsp;|&nbsp; This is an automated notification.</p>
    </div>
  </div>
</body>
</html>
