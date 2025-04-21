@component('mail::message')
# Hello {{ $data['contactName'] }},

Great news! Your application for {{ $data['companyName'] }} has been approved.

You can now access your application at:
{{ $data['loginUrl'] }}

Your login credentials are:
- Email: {{ $data['contact_email'] }}
- Password: {{ $data['password'] }}

Please change your password after your first login for security purposes.

If you have any questions or need assistance, please don't hesitate to contact our support team.

Thanks,<br>
{{ config('app.name') }}
@endcomponent
