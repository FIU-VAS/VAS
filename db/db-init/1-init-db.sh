DB_ARCHIVE=/restore/vas-backup

if test -f "$DB_ARCHIVE"; then
  echo "Restoring data from $DB_ARCHIVE"
  mongorestore --archive="$DB_ARCHIVE"
else
  echo "File [$DB_ARCHIVE] not found"
fi
