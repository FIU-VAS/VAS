DB_ARCHIVE=./vas-backup

if test -f "$DB_ARCHIVE"; then
  mongorestore --archive="$DB_ARCHIVE"
fi
