$files = Get-ChildItem -Path "*.html" -Name

foreach ($file in $files) {
    $content = Get-Content $file -Raw
    
    # Remove mailto email link blocks with SVG
    $content = $content -replace '[\s]*<a href="mailto:info@cbrmodelschool\.edu\.in">[\s]*<svg[^>]*>.*?</svg>[\s]*info@cbrmodelschool\.edu\.in[\s]*</a>[\s]*', "`n"
    
    # Remove remaining simple mailto email links (without SVG)
    $content = $content -replace '<a\s+href="mailto:info@cbrmodelschool\.edu\.in">\s*info@cbrmodelschool\.edu\.in\s*</a>', ''
    
    # Write back to file
    [IO.File]::WriteAllText((Resolve-Path $file).Path, $content, [System.Text.Encoding]::UTF8)
    Write-Host "Processed: $file"
}

Write-Host "Email removal completed successfully"
