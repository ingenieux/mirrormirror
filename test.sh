#!/bin/bash +e 
curl -v -H "Content-Type: application/x-www-form-urlencoded" -d @content.txt http://localhost:8000/hooks/bitbucket
