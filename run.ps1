param (
  [Parameter(Mandatory = $true)][string]$task,
  [string]$deployType = "hosting"
)

switch ($task) {
  "dev" { Set-Location .\app; $Env:BROWSER = "none"; npm.cmd start }
  "build" { Set-Location .\app; npm.cmd run build }
  "deploy" {
    switch ($deployType) {
      "hosting" { firebase.cmd deploy --only hosting }
      "functions" { firebase.cmd deploy --only hosting }
    }
  }
}
