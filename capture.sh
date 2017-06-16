#!/bin/bash

SCREEN_NAME="gyazo"
SERVER_FOLDER="$HOME/.scripts/lib/node/node-personal-gyazo"

if [ "$1" = "start" ]; then
    SESSION="$(screen -ls | grep -i $SCREEN_NAME)"
    if [ ! -z "$SESSION" ]; then
        echo "Your web server is already running!"
        exit 1
    else
        echo "Starting web server..."
        cd "$SERVER_FOLDER" && screen -dmS "$SCREEN_NAME" node .
        echo "Done"
        exit 0
    fi
elif [ "$1" = "stop" ]; then
    SESSION="$(screen -ls | grep -i $SCREEN_NAME)"
    if [ -z "$SESSION" ]; then
        echo "Your web server is not running!"
        exit 1
    else
        echo "Stopping web server..."
        kill "$(echo "$SESSION" | cut -d. -f1)"
        echo "Done"
        exit 0
    fi
fi

FILE="$(date +%s).png"
screencapture -s "$FILE"
# post to server
URL=$(curl -X POST -F file=@"$FILE" http://localhost:3000/)
# XXX when POST failed
rm "$FILE"
echo -n "$URL" | pbcopy
