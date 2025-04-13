@component('mail::message')
# Hello {{ $data['contactName'] }},

We regret to inform you that your application for {{ $data['companyName'] }} has not been approved at this time.

If you have any questions about this decision, please feel free to contact our support team.

Thanks,<br>
{{ config('app.name') }}
@endcomponent