$totalLength = (ls -Recurse | Measure-Object -Sum Length).Sum - 145
$a = 1024 * 13
Write-Output "Total Length: $totalLength Bytes, Max is $a"
