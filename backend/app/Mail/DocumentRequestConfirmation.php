<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class DocumentRequestConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $firstName,
        public string $documentName,
        public string $trackingNumber,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Document Request Confirmation – Barangay Olympia',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.document_request',
        );
    }
}
