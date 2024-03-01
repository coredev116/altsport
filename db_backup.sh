#!/bin/sh
set -e

POSTGRES_CONTAINER_ID="$(docker ps -q -f name='db')"
DUMP_FILENAME=dump_`date +%d-%m-%Y""%H%M_%S`.sql
DAYS_SINCE_LAST_MODIFIED=14

# EDITABLE VARIABLES
DB_USER="postgres"
DEST_PATH="./backups"

# Execute pg_dumpall command
docker exec -t $POSTGRES_CONTAINER_ID pg_dumpall -c -U $DB_USER > $DEST_PATH/$DUMP_FILENAME

# DELETE DB BACKUP FILES THAT ARE OLDER THAN $DAYS_SINCE_LAST_MODIFIED days
find $DEST_PATH -mtime +$DAYS_SINCE_LAST_MODIFIED -exec rm {} \;