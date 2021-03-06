## Features

If your current working directory is a git repo it can watch your changes and remind you to git commit more often to prevent HUGE commits

## Requirements

Git - Download at Git official [homepage](https://git-scm.com/downloads)

## Extension Settings

* `r2g.reminderInfoLevel`: Number represents total amount of changes until a info level message triggers
* `r2g.reminderWarningLevel`: Same as info but a warning level message trigger
* `r2g.reminderTimeout`: This value specifies the timeout (in seconds) until a trigger (and levels below) can trigger again after it's been activated

## Known Issues

When specifying git.path on windows you must use " around the entire path if git is installed in a directory  with spaces, ex:

If installed in "Program Files" ( C:\Program Files\Git\bin )

`git.path` = "\"C:\\Program Files\\Git\\bin\\git.exe\"" 

## Release notes

### 1.0.0

Initial release

* Support info and warning level reminders
* Supprort timeouts, aka if you ignore a reminder, 5 min later it will trigger again

### 1.0.2

* User can now modify the timeout used when a message is triggered. It defaults to 5 minutes

## Github repo

https://github.com/patnym/remember-2-git

