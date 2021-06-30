#! /bin/sh
(cd $(dirname "${BASH_SOURCE[0]}")/data; wget -r -np -nd -A json https://orthohpi.jensenlab.org/data/networks/)





