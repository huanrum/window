#!/bin/bash
# and make it executable


NOCOLOR='\033[0m'
REDCOLOR='\033[37;41m'
GREENCOLOR='\033[34;42m'

DIR=`pwd`
PROJECT_NAME=`basename $DIR`



function exec_bower() {
	echo -e "$REDCOLOR bower.json had changes. Installing js dependency.$NOCOLOR"
	#cd "$DIR"
	bower install
}

function exec_npm() {
	echo -e "$REDCOLOR package.json had changes. Installing npm.$NOCOLOR"
	#cd "$DIR"
	npm install
}

function exec_hooks() {
	echo -e "$REDCOLOR Installing hooks.$NOCOLOR"
	rm -rf .git/hooks/*
	grunt githooks
}

function exec_config() {
	cp "$DIR/config/config.js" "$DIR/config/config-local.js"
	echo -e "$REDCOLOR Generated config-local.js. Please check it.$NOCOLOR"

	if [[ $1 == "1" ]]; then
		env="dev"
	elif [[ $1 == "2" ]]; then
		env="prod"
	fi
	if [[ $# == 2 ]]; then 
		sed -i "s/ENV:\s.*/ENV: '$env',/" config/config-local.js
		sed -i "s#BASE_URL:\s.*#BASE_URL: '$2',#" config/config-local.js
	fi
}

function exec_template() {
	cp "$DIR/index.template" "$DIR/index.html"
	echo -e "$REDCOLOR Generated index.html.$NOCOLOR"
}

function exec_grunt() {
	echo -e "$REDCOLOR Running grunt to build the project.$NOCOLOR"
	grunt
}

function func_update() {
	if [[ $1 == "" || $1 == "all" ]]; then
		exec_template
		exec_npm
		exec_bower
		exec_hooks
	else
		exec_$1
	fi
}

function func_watch() {
	grunt watch
}

function func_live() {
	grunt live
}

function func_run() {
	echo -e "$GREENCOLOR Auto build process$NOCOLOR"
	rm -rf "$DIR/index.html"

	DIFF=`git diff-tree -r --name-only --no-commit-id ORIG_HEAD HEAD | grep package.json`
	if [[ $DIFF != "" || ! -d "$DIR/vendor" ]]; then
		exec_npm
	fi

	DIFF=`git diff-tree -r --name-only --no-commit-id ORIG_HEAD HEAD | grep bower.json`
	if [[ $DIFF != "" || ! -d "$DIR/vendor" ]]; then
		exec_bower
	fi

	DIFF=`git diff-tree -r --name-only --no-commit-id ORIG_HEAD HEAD | grep .githooks`
	if [[ $DIFF != "" || ! -f "$DIR/.git/hooks/pre-commit" ]]; then
		exec_hooks
	fi

#	if [[ ! -f "$DIR/config/config-local.js" ]]; then
#		exec_config
#	fi

	DIFF=`cat index.html 2>/dev/null | grep '@@dynamic'`

	CHANGES=`git diff-tree -r --name-only --no-commit-id ORIG_HEAD HEAD | grep index.template`

	if [[ ! -f "$DIR/index.html" || $DIFF != "" || $CHANGES != "" ]]; then
		exec_template
	fi

	exec_grunt

	echo -e "$GREENCOLOR Finished.$NOCOLOR"

}

function func_package() {
	tar -cvzf "../$PROJECT_NAME.tar.gz" --exclude=.git --exclude=.sass-cache --exclude=node_modules *
}

function func_server() {
	http-server $*
}

function func_jshint() {
	grunt jshint
}

function func_init() {
	echo -e " "
	echo -e "Please select enviorment type:"
	echo -e "\t1) DEV (dev do not compress js files.)"
	echo -e "\t2) PROD (used for cloud server.)"
	echo -n "Enviorment Type(1/2):"
	while read env
	do
		if [[ $env != "1" && $env != "2" ]]; then
			echo -n "Enviorment Type(1/2):"
		else
			break
		fi
	done
	echo -e " "
	echo -n "Api URL link(e.g. '//10.22.16.111:8080/hkgtaCoreservices/rest/'):"
	read url

	exec_config $env $url
	exec_npm
	exec_bower
	exec_hooks
	exec_template
	exec_grunt
}
function func_welcome() {
	cat <<EOT
                          _oo0oo_
                         088888880
                         88" . "88
                         (| -_- |)
                          0\ = /0
                       ___/'---'\___
                     .' \\\\|     |// '.
                    / \\\\|||  :  |||// \\
                   /_ ||||| -:- |||||- \\
                  |   | \\\\\\  -  /// |   |
                  | \_|  ''\---/''  |_/ |
                  \  .-\__  '-'  __/-.  /
                ___'. .'  /--.--\  '. .'___
             ."" '<  '.___\_<|>_/___.' >'  "".
            | | : '-  \'.;'\ _ /';.'/ - ' : | |
            \  \ '_.   \_ __\ /__ _/   .-' /  /
        ====='-.____'.___ \_____/___.-'____.-'=====
                              '=---='

      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
         GOD BLESS, NO BUGS FOREVER ----EPAM System
 
EOT
}

function func_help() {
	cat <<HELP
usage: ./fe [<command>] [<args>]

The most commonly used fe commands are:
   init       Generate the project with newest config
   package    Export project as an tar file
   watch      Doing grunt watch
   live       Start a web server and doing grunt watch to automatical refresh your browers
   update     Usable options 'npm/bower/template/hooks'
   server     Using http-server to start a web server
   jshint     Use jshint to check your code
   compile    Build project

Tell me if you have an idea to improve it.

HELP
}

func_welcome

case $1 in
	"init")
		func_init
	;;
	"package")
		func_package
	;;
	"update")
		func_update $2
	;;
	"watch")
		func_watch
	;;
	"live")
		func_live
	;;
	"server")
		func_server $*
	;;
	"jshint")
		func_jshint
	;;
	"-h"|"--help"|"help")
		func_help $2
	;;
	"compile")
		func_run
	;;
	*)
		func_run
esac 
