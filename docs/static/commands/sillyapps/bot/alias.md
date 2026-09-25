# alias development
the bot features an alias system. with aliases, you can create your own commands, mini-games, and the tools you need

## I'm just a user - what should I do?

if you want to copy someone else's alias without editing it, always use `link`. this way, you will always have the latest version of the alias!

```
_alias link <@user> <alias_name> [new_name]
```

if you want to remove an alias that is already linked, you can use this command:

```
_alias remove <alias_name>
```

if you want to rename an alias, use this command:

```
_alias rename <alias_name> <new_name>
```

if you just want to test the alias without linking it, you can use this command:

```
_alias check <@user> <alias_name>
```

---
### ok, but how do I run the alias?
it's simple: instead of `_`, use `_:`

```
_: coolalias
```

## development

### creating an alias
to create an alias, use the `alias create` command:

```
_alias create <name> <code>
```

the code to be inserted is javascript. to support updates without editing the alias, you can use a github gist; simply insert `gist:<gist_id>` instead of the code itself. example: `https://gist.github.com/itzkitb/2b2c3ad1f31850f5ac1aabb8dd9bf580` -> `gist:2b2c3ad1f31850f5ac1aabb8dd9bf580`. if you just need a large block of code, you can simply use a link from [this pastebin](https://tupid.lol/p) (cannot be edited)

after that, you can use your new alias!

```
_: <name>
```

---
### about javascript
for security reasons, all js code runs within the V8 engine (you can learn more about it [here](https://v8.dev/)). consequently, not all of js's potential can be utilized here; specifically, the following are disabled:

- internet access (this may become available in the future)
- access to host files (use a database instead)
- access to host functions
- etc.

---
### bot functions
there is a bridge between the js and the bot in the form of the `butterBror` class, which allows you to use the bot's functions

#### class contents:

- CommandContext context - current execution context
- ContextDatabase userDatabase - user-specific database
- ContextDatabase userChatDatabase - user-specific chat database
- ContextDatabase chatDatabase - chat-specific database
- ContextDatabase globalDatabase - global database
- ContextDatabase globalAliasDatabase - global alias database
- ContextDatabase chatAliasDatabase - chat alias database
- ContextDatabase userAliasDatabase - user alias database
- string test() - just a test, always returns `MrDestructoid 👍`
- string? executeCommand(string commandName, List<string> arguments) - execute the bot command and get a response (add `json:true` at the end to make parsing easier)

#### CommandContext:

- string CommandName - name of the command being executed
- string PlatformId - id of the platform the command is being executed on
- string Locale - locale of the user executing the command (e.g. `EN_US`, `RU_RU`)
- List<string> Arguments - arguments passed to the command
- List<string> PlatformPermissions - permissions that the user has on the platform (you can find the list [here](https://tupid.lol/p?i=8dHmL))
- PlatformUser PlatformUser - user data from the platform
- Chat Chat - chat data from the platform
- User User - user data in the bot
- ChatInfo ChatInfo - chat info in the bot
- OriginalMessage OriginalMessage - the original message that executed the command
- DateTime ExecutedAt - the date and time the command was executed
- string CorrelationId - the correlation id of the command execution
- CancellationToken CancellationToken - the cancellation token for the command execution nvm

#### PlatformUser:

- string Id - the id of the user on the platform
- string DisplayName - the display name of the user on the platform
- string Platform - the platform the user is on (e.g. `sillyapps:twitch`)
- List<string> Permissions - the same as `PlatformPermissions`

#### Chat:

- string Id - the id of the chat on the platform
- string Name - the name of the chat on the platform
- string Platform - the platform the chat is on (e.g. `sillyapps:twitch`)

#### User:

- string UnifiedId - the unified id of the user
- string DisplayName - the display name of the user
- Dictionary<string(platform), string(id)> PlatformIds - all connected platforms with internal ids
- DateTime CreatedAt - the date and time the user was created
- DateTime LastActive - the date and time the user was last updated
- Dictionary<string(command_id), string(count)> Statistics - the number of times each command has been executed by the user (plus, in addition commands.total and commands.successful)
- List<string> Permissions - the permissions of the user
- string PreferredLocale - the preferred locale of the user

#### ChatInfo:

- string UnifiedId - the unified id of the chat
- string PlatformId - chat id on the platform
- string Platform - the platform the chat is on (e.g. `sillyapps:twitch`)
- string Title - the title of the chat
- DateTime CreatedAt - the date and time the chat was created
- object ExtraData - bs

#### OriginalMessage:

- DateTime ReceivedAt - the date and time the message was received
- string Text - the text of the message
- string PlatformUserId - the id of the user on the platform
- string PlatformUserName - the display name of the user on the platform
- string PlatformChatId - the id of the chat on the platform
- string PlatformChatName - the name of the chat on the platform
- object ExtraData - the extra data of the message

#### ContextDatabase:

- void setData(string key, string value) - set the value of a data key
- string getData(string key) - get the value of a data key
- void deleteData(string key) - remove a data key
- Dictionary<string, string> scanKeys(string pattern) - scan for data keys matching a pattern (e.g. `alias:*`)

## examples:
CommandContext:
```json
{
  "CommandName": "js",
  "PlatformId": "sillyapps:twitch",
  "Locale": "EN_US",
  "Arguments": [
    "JSON.stringify(context)"
  ],
  "PlatformPermissions": [
    "Moderator",
    "CanBanUser",
    "CanUnbanUser",
    "CanDeleteOtherMessages",
    "CanDeleteOwnMessages",
    "CanUseBotCommands",
    "CanAddModerators",
    "CanRemoveModerators"
  ],
  "PlatformUser": {
    "Id": "907042478",
    "DisplayName": "itzkitb",
    "Platform": "sillyapps:twitch",
    "Permissions": [
      "Moderator",
      "CanBanUser",
      "CanUnbanUser",
      "CanDeleteOtherMessages",
      "CanDeleteOwnMessages",
      "CanUseBotCommands",
      "CanAddModerators",
      "CanRemoveModerators"
    ]
  },
  "Chat": {
    "Id": "1048282350",
    "Name": "butterbror",
    "Platform": "sillyapps:twitch"
  },
  "User": {
    "UnifiedId": "36669148-86c2-470e-96db-7d7cc25043f4",
    "PlatformIds": {
      "sillyapps:twitch": "907042478"
    },
    "DisplayName": "itzkitb",
    "CreatedAt": "2026-06-18T11:36:06.703Z",
    "LastActive": "2026-09-25T18:25:09.566Z",
    "Statistics": {
      "commands.ping": 163,
      "commands.total": 3617,
      "commands.successful": 3430,
      "sillyapps:bot:frogs": 181,
      "bb:builtin:userinfo": 8,
      "sillyapps:bot:js": 15,
      "sillyapps:bot:firstline": 4,
      "sillyapps:bot:periodically_rewards": 693,
      "sillyapps:bot:remind": 190,
      "sillyapps:bot:alias": 253,
      "sillyapps:bot:balance": 2,
      "bb:builtin:reloadmodule": 33,
      "sillyapps:bot:ping": 64,
      "sillyapps:bot:lastline": 14,
      "sillyapps:twitch:addchannel": 11,
      "sillyapps:twitch:deletechannel": 4,
      "bb:builtin:locale": 3,
      "sillyapps:twitch:auth": 3,
      "sillyapps:twitch:join": 7,
      "sillyapps:bot:help": 1,
      "sillyapps:twitch:part": 4,
      "sillyapps:bot:math": 6,
      "sillyapps:bot:bot_currency": 1,
      "sillyapps:bot:chatlines": 1,
      "bb:builtin:banphrases": 7,
      "bb:builtin:block": 4
    },
    "Permissions": [
      "su:*"
    ],
    "PreferredLocale": "EN_US"
  },
  "ChatInfo": {
    "UnifiedId": "e02565f8-4c75-43a4-a707-b8ce79a83f38",
    "PlatformId": "1048282350",
    "Platform": "sillyapps:twitch",
    "Title": "butterbror",
    "CreatedAt": "2026-08-25T09:12:37.080Z",
    "ExtraData": null
  },
  "OriginalMessage": {
    "ReceivedAt": "2026-09-25T18:25:09.565Z",
    "Text": "_js JSON.stringify(context)",
    "PlatformUserId": "907042478",
    "PlatformUserName": "itzkitb",
    "PlatformChatId": "1048282350",
    "PlatformChatName": "butterbror",
    "ExtraData": {
      "Username": "itzkitb",
      "UserId": "907042478",
      "MessageId": "248473f1-37e3-4dcf-8b28-419a37c90855",
      "Message": "_js JSON.stringify(context)",
      "Channel": "butterbror",
      "ChannelId": "1048282350",
      "IsModerator": true,
      "IsBroadcaster": false,
      "IsSubscriber": false,
      "IsVip": false,
      "IsBot": false,
      "Badges": [
        {
          "Key": "lead_moderator",
          "Value": "1"
        },
        {
          "Key": "streamer-awards-2024",
          "Value": "1"
        }
      ],
      "Color": "#FF7F50"
    }
  },
  "ExecutedAt": "2026-09-25T18:25:09.565Z",
  "CorrelationId": "d42a19b5-e8d9-444e-951a-bc50123affdb",
  "CancellationToken": {
    "IsCancellationRequested": false,
    "CanBeCanceled": false,
    "WaitHandle": {
      "Handle": {},
      "SafeWaitHandle": {
        "IsInvalid": false,
        "IsClosed": false
      }
    }
  }
}
```
