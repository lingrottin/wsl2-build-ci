#!/usr/bin/env bash
# buildHandler.sh - a part of wsl2-build-ci
# accept arguments:
# buildHandler.sh [kernel tarball link] [configuration name]
EXTRAVERSION=enita
LOCALVERSION=-WSL
KERNEL_VERSION=$(basename $1 | sed 's/linux-\(.*\)\.tar\..z$/\1/')
cd $(dirname $0)

# Get Archive
if [[ ! -d linux-$KERNEL_VESION ]] ; then
# if the directory not exist, execute this
  if [[ $(echo $1 | awk -F . '{print $NF}') == 'gz' ]] ; then
    wget -O- $1 | tar -zxf-
  elif [[ $(echo $1 | awk -F . '{print $NF}') == 'xz' ]] ; then
    wget -O- $1 | tar -Jxf-
  fi
fi

# Enter archive dir
cd linux-$KERNEL_VERSION

# Set-up configuration
mkdir Microsoft
cp ../configurations/$2.conf Microsoft/config-wsl

# Modify configuration
sed -i "/^EXTRAVERSION =/c\\EXTRAVERSION = $EXTRAVERSION" Makefile
sed -i "/^CONFIG_LOCALVERSION=/c\\CONFIG_LOCALVERSION=\"$LOCALVERSION\"" Microsoft/config-wsl
sed -i "/^CONFIG_CC_VERSION_TEXT=/c\\CONFIG_CC_VERSION_TEXT=\"$(gcc --version | sed -n '1p')\"" Microsoft/config-wsl

# Start build
yes "
" | make -j$(expr `nproc` \* 2) KCONFIG_CONFIG=Microsoft/config-wsl 2>&1 >> ../logs/$KERNEL_VERSION.log

# Copy file
mkdir -p ../kernels/kernels/$KERNEL_VERSION
cp ./arch/x86/boot/bzImage ../logs/$KERNEL_VERSION.log ../kernels/kernels/$KERNEL_VERSION/
cat << EOF > ../kernels/kernels/$KERNEL_VERSION/README.md
# Linux $KERNEL_VERSION
This image is compiled by [wsl2-build-ci](https://github.com/lingrottin/wsl2/build-ci) (https://enita.cn/wbc/) for WSL with Microsoft config for $2

## Version Text
\`\`\`
${KERNEL_VERSION}${EXTRAVERSION}${LOCALVERSION}
\`\`\`
EOF

cd ..
rm -rf linux-$KERNEL_VERSION
bash kernels/update.sh

exit 0