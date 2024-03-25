# MillenniCare
### Setting up repo for local development
1. Clone the repository
2. Run `pnpm i` to install dependencies
3. Run `cp .env.example .env` to create a copy of the required environment variables
4. Run `pnpm db:push` to push changes to local db
5. Run `pnpm dev` to run both Expo and NextJS apps
### Using turborepo cache
1. Create `.turbo/config.json`
2. Insert these values and replace the apiurl with the actual Lambda url
```
{
  "teamid": "team_millennicare",
  "apiurl": "http://localhost:3000"
}
```
3. Add `TURBO_TOKEN`, `TURBO_API`, and `TURBO_TEAM` to `.env`

