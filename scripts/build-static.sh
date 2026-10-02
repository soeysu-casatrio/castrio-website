#!/bin/sh
set -eu
# Run from the repository root. Include every intended public asset explicitly.
mkdir -p public
cp ./*.html public/
cp robots.txt sitemap.xml _redirects public/
cp -R images downloads public/
