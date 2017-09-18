#!/usr/bin/env bash

# Script for deleting services in openshift
# oc login
#
# runDeleteServicesInOpenshift environment
# example:
# runDeleteServicesInOpenshift st1

environment=$1
profile=fellesdatakatalog-$environment
tag=latest

#midlertidig kommentert ut reference-data
services="registration registration-auth registration-api registration-validator nginx gdoc harvester harvester-api search search-api"

oc project $profile

for i in $services
do
    oc delete all -l app=$i
done
