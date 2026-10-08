<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ServiceReservationConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $firstName,
        public string $serviceName,
        public string $reservationDate,
        public string $trackingNumber,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Reservation Confirmation – Barangay Olympia',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.service_reservation',
        );
    }
}
