# Steps to setup

1. Install the doppler cli [https://docs.doppler.com/docs/install-cli](https://docs.doppler.com/docs/install-cli#installation)
2. Run `doppler setup --token=dp.st.local_dev_test.Vn1a4xbjx4ucVaVkkVRcA56ZpIdp6YP0Z8YXW6P5bXw --no-interactive`
3. Run `npm run local:dev`
4. To take down the docker container `npm run local:dev:down`


# Migrations

1. To create a migration `npm run dev:migrate:make src/migrations/name_of_migration`
2. To apply the migration `npm run dev:migrate:latest`

## Database Management

#### Backup
```bash
pg_dump --clean --no-owner --no-privileges -Fc -v -d postgresql://user:password@host:port/databaseName -f file.dump
```

#### Restore
```bash
pg_restore --no-owner --no-privileges -v -d postgresql://user:password@host:port/databaseName backups/december.dump
```

