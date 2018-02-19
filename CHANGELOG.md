# Change Log

## [1.0.0]

### Initial release
* Support info and warning level reminders
* Supprort timeouts, aka if you ignore a reminder, 5 min later it will trigger again

## [1.0.2]

### Info/Warning level message bug fixes
* Fixed a bug causing the warning/info message to spam the user
* Now timeouts all messages below the warning level that occurred correctly

### New config values
* User can now modify the timeout used when a message is triggered. It defaults to 5 minutes