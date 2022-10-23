# ManifestCTF

A modern CTF platform to help inquisitive minds learn & grow.

## Getting Started

### Setup

Create a .env file:
```bash
cp .env.example .env
```

And spin up the postgres based stack:
```bash
docker compose -f docker/docker-compose.yml up
```

You can now migrate the database:
```bash
yarn prisma:migrate
```

Now, seed the database:
```bash
yarn prisma:seed
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

You can use Prisma Studio to query and update the database directly:
```bash
yarn prisma:studio
```