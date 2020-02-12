
#!/bin/bash -ex
ROOT="$(git rev-parse --show-toplevel)"

PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

REPLACE_TO="NSString \*const RNPAYPluginVersion = @\"$PACKAGE_VERSION\";"
FILE="$ROOT/ios/Classes/RNPAYCore.m"
sed -i '' -e "s/NSString \*const RNPAYPluginVersion = .*/$REPLACE_TO/g" $FILE

git add $FILE

