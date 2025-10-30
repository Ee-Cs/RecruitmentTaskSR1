@echo off
set SPEC_DIR=cypress/e2e
set SPEC_1=%SPEC_DIR%/11_finish_match.cy.ts
set SPEC_2=%SPEC_DIR%/12_delete_match.cy.ts
set SPEC_3=%SPEC_DIR%/21_tournament.cy.ts
set SPEC_4=%SPEC_DIR%/31_open_report.cy.ts
set SPEC_5=%SPEC_DIR%/41_select_dataset.cy.ts
set SPECS=%SPEC_1%,%SPEC_2%,%SPEC_3%,%SPEC_4%,%SPEC_5%

cd ..
set KEY=N
set /P KEY="Start HTTP server? Y [N]"
if /i "%KEY:~0,1%"=="Y" (
  cd dist\RecruitmentTaskSR1\browser
  start "Recruitment Task SR1" /MAX http-server . -p 8080
  cd ..\..\..
  pause
)
call npx cypress run --browser chrome --spec "%SPECS%"
pause

:: call npx cypress open --browser chrome