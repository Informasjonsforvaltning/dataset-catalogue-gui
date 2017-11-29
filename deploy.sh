#!/usr/bin/env bash
set -e

# Deployment pipeline (environment order)
# UT1 -> ST2 -> TT1 (mocked authorisation )
# UT1 -> ST1 -> PPE (idporten authorisation)


# some input validation
if [ -z "$1" ]
then
    echo "component must be specified: search, registration, search-api etc..."
    echo "correct usage: ./deploy.sh <component> <environment>"
    echo "example: ./deploy.sh search st2"
    echo "use all to deploy all components. Example: ./deploy.sh all st2"
    exit 1
fi

if [ -z "$2" ]
then
    echo "environment must be specified: ut1, st1, st2, tt1 ppe or prd"
    echo "correct usage: ./deploy.sh <component> <environment>"
    echo "example: ./deploy.sh harvester-api tt1"
    exit 1
fi
component=$1
environment=$2

git fetch

GIT_STATUS=`git status | grep "Your branch is"`
if [ "${GIT_STATUS}" != "Your branch is up-to-date with 'origin/develop'." ] ; then
  echo "You need to be on origin/develop and be up to date with origin";
  exit;
fi

components="fuseki harvester harvester-api nginx nginx-search reference-data registration registration-api registration-auth registration-validator search search-old search-api"


# remove all local tags
git tag -d $(git tag -l)
# fetch all tags from github
git fetch --tags

DATETIME=`date "+%Y-%m-%dT%H_%M_%S"`

# doesnt work in git bash on Windows. Log in with docker login -u user -p passwd before running script
#docker login --username ${dockerUsername} --password ${dockerPassword}

function dockerTag {
  component=$1
  fromEnvironment=$2
  toEnvironment=$3

  # pull image from docker hub (overwrites local image if it exists)
  docker pull dcatno/${component}:${fromEnvironment}_latest

  # tag and push latest eg. registration_latest
  docker tag dcatno/${component}:${fromEnvironment}_latest dcatno/${component}:${toEnvironment}_latest
  docker push dcatno/${component}:${toEnvironment}_latest

  # tag and push with date eg. registration_2017-01-01T23_59_01
  docker tag dcatno/${component}:${fromEnvironment}_latest dcatno/${component}:${toEnvironment}_${DATETIME}
  docker push dcatno/${component}:${toEnvironment}_${DATETIME}
}

function gitTag {
  component=$1
  fromEnvironment=$2
  toEnvironment=$3

  # checkout commit for tag that we are using as the base to tag on top of
  git checkout tags/${fromEnvironment}_latest

  # remove ***_latest tag from github and locally
  git push --delete origin ${toEnvironment}_latest || true
  git tag --delete ${toEnvironment}_latest || true

  # tag checked-out commit with ***_latest tag
  # if all components are deployed, omit component name
  if [ "$component" == "all"] ; then
    git tag ${toEnvironment}_latest
    git tag ${toEnvironment}_${DATETIME}
  else
    git tag ${toEnvironment}_latest_${component}
    git tag ${toEnvironment}_${DATETIME}_${component}
  fi

  # don't forget to checkout develop again, don't want any surprises later
  git checkout develop

  # push all tags to github
  git push origin --tags

}

#function openshiftDeploy {
#    osEnvironment=$1
#    dateTag=$2
#
#    #Deply new images on openshift - assuming all services are correctly set up
#    # sh runCreateAllServicesInOpenshift.sh $osEnvironment $datetag $dateTag onlyDeployImages
#}



if [ "$environment" == "st1" ] ; then

  if [ "$component" == "all" ] ; then
    for i in $components
    do
        dockerTag ${i} ut1 st1
    done
  else
    dockerTag ${component} ut1 st1
  fi

  gitTag ${component} ut1 st1


elif [ "$environment" == "st2" ] ; then

  if [ "$component" == "all" ] ; then
    for i in $components
    do
      dockerTag ${i} ut1 st2
    done
  else
    dockerTag ${component} ut1 st2
  fi

  gitTag ${component} ut1 st2


elif [ "$environment" == "tt1" ] ; then

  if [ "$component" == "all" ] ; then
    for i in $components
    do
      dockerTag ${i} st2 tt1
    done
  else
    dockerTag ${component} st2 tt1
  fi

  gitTag ${component} st2 tt1


elif [ "$environment" == "ppe" ] ; then
  if [ "$component" == "all" ] ; then
    for i in $components
    do
      dockerTag ${i} st1 ppe
    done
  else
    dockerTag ${component} st1 ppe
  fi

  gitTag ${component} st1 ppe


elif [ "$environment" == "prod" ] ; then
  if [ "$component" == "all" ] ; then
    for i in $components
    do
      dockerTag ${i} ppe prod
    done
  else
    dockerTag ${component} ppe prod
  fi

  gitTag ${component} ppe prod


else

  echo "####################################"
  echo "####################################"
  echo ""
  echo "Non-valid environment specified"
  echo ""
  echo "####################################"
  echo "####################################"
fi


echo "Done";
