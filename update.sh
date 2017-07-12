#!/bin/bash
curl -s 'https://harpers.org' | \
  awk '/harpers-index/,/<div/' | \
  sed -n 3,4p | \
  sed -E 's/^[[:space:]]*|<[^>]*>//g' | \
  tr -s '\r\n' ' ' | \
  cat - <(echo) | \
  fold -s

curl -s 'https://harpers.org' | \
  awk '/findings.*img/,/<p/' | \
  tail -1 | \
  sed -E 's/^[[:space:]]*|<[^>]*>//g' | \
  fold -s
