@component('mail::message')
# Hello {{ $data['contactName'] }},

Thank you for registering {{ $data['companyName'] }} with our platform. Your application is currently under review.

Once approved, you can access your application at:
{{ config('app.protocol', 'https') }}://{{ $data['subdomain'] }}.{{ config('app.domain') }}

Your temporary login credentials are:
- Email: {{ $data['contact_email'] }}
- Password: {{ $data['temporaryPassword'] }}

Please change your password upon first login.

We'll process your application as soon as possible.

Thanks,<br>
{{ config('app.name') }}
@endcomponent
