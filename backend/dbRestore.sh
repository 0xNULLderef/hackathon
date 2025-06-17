#!/usr/bin/env bash

rm -f hackathon.db
sqlite3 hackathon.db '.read sql/restore.sql'
