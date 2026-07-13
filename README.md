# DOST-STII Hiring Portal

Public recruitment portal for the Department of Science and Technology - Science and Technology Information Institute (DOST-STII).

The current welcome page provides a public vacancy board where applicants can review open job positions and proceed to a separate application page for a selected vacancy.

## Current Features

- Public DOST-STII hiring landing page
- API-driven vacancy board
- Latest vacancy highlight card
- Loading skeleton state while vacancies are being fetched
- Laravel paginator support with Previous, Next, and page number controls
- Per-vacancy Apply button using `/vacancies/{id-or-slug}/apply`
- Footer with DOST-STII identity, quick links, and HR contact details
- Philippine timezone configured through `APP_TIMEZONE=Asia/Manila`

## Main Routes

```php
GET /                  // Inertia welcome page
GET /get-job-positions // Paginated job positions API
```

The vacancy board expects `/get-job-positions` to return:

```json
{
  "data": {
    "current_page": 1,
    "data": [],
    "from": 1,
    "last_page": 1,
    "per_page": 10,
    "to": 10,
    "total": 0
  },
  "success": true,
  "message": "Job positions fetched successfully"
}
```

## Development

Install dependencies:

```bash
composer install
npm install
```

Prepare environment:

```bash
cp .env.example .env
php artisan key:generate
php artisan migrate
```

Run the app:

```bash
php artisan serve
npm run dev
```

Or use the Composer development script:

```bash
composer run dev
```

Build frontend assets:

```bash
npm run build
```

## Frontend Stack

- React 19
- Inertia.js
- Vite
- Tailwind CSS
- Axios
- Lucide React icons

## Backend Stack

- Laravel 12
- PHP 8.2+
- Laravel Sanctum
- Ziggy

## Notes

- The homepage is implemented in `resources/js/pages/welcome.tsx`.
- Job position API logic is handled by `app/Http/Controllers/JobPositionController.php`.
- Job data is represented by `app/Models/JobPosition.php`.
- The Apply buttons currently point to future routes such as `/vacancies/{job_position_slug}/apply` or `/vacancies/{job_position_id}/apply`.
