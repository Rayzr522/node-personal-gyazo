#!/bin/sh

FILE="$(date +%s).png"
screencapture -s $FILE
# post to server
URL=$(curl -X POST -F file=@$FILE http://localhost:3000/)
# XXX when POST failed
rm $FILE
open $URL
