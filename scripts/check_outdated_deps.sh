#!/bin/bash -ex
# Check podspec dependencies outdated.
# See payjp-react-native.podspec
SCRIPT_DIR=$(cd $(dirname $0); pwd)
# NOTE: Exclude PAYJP. It'll be updated by "Check latest PAYJP.SDK".
# NOTE: Exclude React. It's managed by node modules.
DEPS=(
    "CardIO"
    "GoogleUtilities"
)
outdated=""
pod outdated --no-ansi --project-directory=$SCRIPT_DIR/../example/ios/ | (while read line
    do
        for dep in "${DEPS[@]}" ; do
            if [[ "$line" =~ "$dep" ]] ; then
                if [ -z "$outdated" ]; then
                    outdated="$line"
                else
                    outdated=`printf "%s\n%s" "$outdated" "$line"`
                fi
            fi
        done
done
    if [ ! -z "$outdated" ]; then
        echo "need to update"
        echo "$outdated";
        exit 1;
    fi
)
