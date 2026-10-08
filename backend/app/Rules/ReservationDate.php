<?php

namespace App\Rules;

use Closure;
use DateTimeImmutable;
use DateTimeZone;
use Illuminate\Contracts\Validation\ValidationRule;

class ReservationDate implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $date = null;
        $timezone = new DateTimeZone('Asia/Manila');
        if (is_string($value) && preg_match('/^(\d{4}-\d{2}-\d{2}) \((8am - 9am|9am - 10am|10am - 11am|11am - 12pm|1pm - 2pm|2pm - 3pm|3pm - 4pm)\)$/', $value, $parts)) {
            $date = DateTimeImmutable::createFromFormat('!Y-m-d', $parts[1], $timezone);
            if ($date && $date->format('Y-m-d') !== $parts[1]) $date = null;
        } elseif (is_string($value) && preg_match('/^(\d{4}-\d{2}-\d{2})$/', $value, $parts)) {
            $date = DateTimeImmutable::createFromFormat('!Y-m-d', $parts[1], $timezone);
            if ($date && $date->format('Y-m-d') !== $parts[1]) $date = null;
        } elseif (is_string($value) && preg_match('/^([A-Za-z]+, [A-Za-z]+ \d{1,2}, \d{4}) \d{2}:00 [AP]M - \d{2}:00 [AP]M$/', $value, $parts)) {
            $date = DateTimeImmutable::createFromFormat('!l, F j, Y', $parts[1], $timezone);
            if ($date && $date->format('l, F j, Y') !== $parts[1]) $date = null;
        }
        if (!$date || $date < new DateTimeImmutable('today', $timezone)) {
            $fail('Choose a valid reservation date and time slot today or later.');
        }
    }
}
