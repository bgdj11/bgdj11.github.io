# Optional asset preparation on Windows with Microsoft PowerPoint installed.
# Not part of the website build. Exports static PDFs; never modifies source decks.
$ErrorActionPreference = 'Stop'
$assetDirectory = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..\public\media\projects\visual-reasoning'))
$powerPointExport = New-Object -ComObject PowerPoint.Application
try {
    foreach ($language in @('en', 'sr')) {
        $sourceDeck = Join-Path $assetDirectory ('presentation-' + $language + '.pptx')
        $destinationPdf = Join-Path $assetDirectory ('presentation-' + $language + '.pdf')
        $presentation = $powerPointExport.Presentations.Open($sourceDeck, $true, $false, $false)
        try {
            $presentation.SaveAs($destinationPdf, 32)
            Write-Output ($destinationPdf + ' — ' + $presentation.Slides.Count + ' slides')
        } finally { $presentation.Close() }
    }
} finally { $powerPointExport.Quit() }
