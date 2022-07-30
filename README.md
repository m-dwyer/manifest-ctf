# ManifestCTF

A modern CTF platform to help inquisitive minds learn & grow.

## Getting Started

### Setup

Recommended setup is to install the supabase cli from https://github.com/supabase/cli
Then:
```
supabase init
supabase start
```
And create a .env file, filing in the details from the supbase CLI output:
```
cp .env.example .env
```

You should now be able to access Supabase Studio via http://localhost:54323/
Likewise, when running (see below), the app can be access via http://localhost:3000/

### Alternate Setup

First, run supabase within docker compose along with inbucket for emails:
```
docker compose -f docker/docker-compose.yml -f docker/docker-compose.override.yml up
```

### Running

After setting up, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Development

To SQL dump from postgres container, in case you wish to persist db schema beyond docker volume
or otherwise need to recreate the database
```
docker exec CONTAINER pg_dump -h localhost -U postgres -Fp > db.sql
```
