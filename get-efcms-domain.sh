#!/bin/bash

# Returns the environment associated with each branch

# Usage
#   ./get-env.sh develop

# Arguments
#   - $1 - the branch to check

[ -z "$1" ] && echo "The branch name to check must be provided as the \$1 argument." && exit 1

BRANCH=$1

if  [[ $BRANCH == 'develop' ]] ; then
  echo "${EFCMS_DOMAIN_DEV}"
elif [[ $BRANCH == 'experimental1' ]] ; then
  echo "${EFCMS_DOMAIN_EXP1}"
elif [[ $BRANCH == 'experimental2' ]] ; then
  echo "${EFCMS_DOMAIN_EXP2}"
elif [[ $BRANCH == 'irs' ]] ; then
  echo "${EFCMS_DOMAIN_IRS}"
elif [[ $BRANCH == 'test' ]] ; then
  echo "${EFCMS_DOMAIN_TEST}"
elif [[ $BRANCH == 'migration' ]] ; then
  echo "${EFCMS_DOMAIN_MIG}"
elif [[ $BRANCH == 'staging' ]] ; then
  echo "${EFCMS_DOMAIN_STG}"
elif [[ $BRANCH == 'master' ]] ; then
  echo "${EFCMS_DOMAIN_PROD}"
elif [[ $BRANCH == 'dawson' ]] ; then
  echo "${EFCMS_DOMAIN_DAWSON}"
else
  exit 1;
fi
