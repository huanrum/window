@echo off
%~d0
cd %~dp0

set binpool=%~dp0..\2.0.1\software
set myself=%~dp0

call :createSymLink images shared\resources


if not defined NOPAUSE pause
goto :eof


:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:removeSymLink
@echo off
set from=%1
set to=%2
set link="%binpool%\%to%\%from%"

:: set target="%myself%\%from%"
::echo mklink /j %link% %target%
@echo off
if exist %link% (
	::echo delete %link%
	rmdir %link%
	if exist %link% (
		echo It's not a link, delete folder delete %link%
		rmdir /s /q %link%
	)	
)
@echo off
goto :eof

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:createSymLink
@echo off
set from=%1
set to=%2
set link="%binpool%\%to%\%from%"
set target="%myself%\%from%"

call :removeSymLink %1 %2

::echo mklink /j %link% %target%
mklink /j %link% %target%
echo.


goto :eof