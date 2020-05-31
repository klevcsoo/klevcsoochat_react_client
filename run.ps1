param (
  [Parameter(Mandatory = $true)][string]$task,
  [string]$deployType = "hosting"
)

try {
  switch ($task) {
    "dev" { Set-Location .\app; $Env:BROWSER = "none"; npm.cmd start; }
    "deploy" {
      switch ($deployType) {
        "hosting" {
          Set-Location .\app; npm.cmd run build;
          Write-Host "==================================================" -fore red;
          firebase.cmd deploy --only hosting; Set-Location .\..;
        }
        "functions" { firebase.cmd deploy --only hosting; }
      }
    }
  }
}
finally {
  if ($task -eq "dev") {
    Set-Location .\..;
  }
}
