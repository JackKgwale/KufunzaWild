# KufunzaWild - ECHO Teachers' Platform (Wild Impact)

A plain HTML / CSS / JavaScript website. No build step, no frameworks.

## Open it in VS Code
1. File > Open Folder... and choose this folder.
2. Install the **Live Server** extension, right-click `index.html` > **Open with Live Server**.
   (Opening `index.html` by double-click also works, but Live Server is needed for the automatic Excel file below.)

## Files
| File | What it is |
|---|---|
| `index.html` | Home: welcome banner, overall ECHO targets, landscape cards, ECHO resources, school subjects |
| `landscape.html` | One landscape: grades R-12, terms, subjects, teacher resources, ECHO resources, its target |
| `curriculum.html` | School curriculum filtered by landscape, grade, term, subject, type, search |
| `echo.html` | ECHO content filtered by landscape, grade, type, search |
| `schools.html` | Every school, landscape, region and community with progress bars toward the ECHO target |
| `upload.html` | Request an upload with a file attachment |
| `css/styles.css` | All styling and brand colours (see `:root` at the top) |
| `js/data.js` | Data layer: sample data and Excel reading |
| `js/layout.js` | Top bar, sidebar, icons, shared helpers |
| `js/home.js`, `landscape.js`, `library.js`, `schools.js`, `upload.js` | One script per page |
| `data/echo-data.xlsx` | The data the site reads (sample data until you replace it) |
| `images/` | Your photos (see `images/README.txt`) |
| `lib/xlsx.mini.min.js` | SheetJS, the Excel reader |

## Using your own data (Excel)
Edit `data/echo-data.xlsx`. Keep the sheet names and column headings exactly:
- **Schools:** School, Landscape, Region, Community, LessonsDone, Target
- **Curriculum:** Landscape, Grade, Term, Subject, Type, Title, Description, Link
- **Echo:** Landscape, Grade, Type, Title, Description, Link

Grade is `R`, `1` ... `12`. Term is `1` to `4`. Link is a web address or a file path to the resource (optional). Landscape names in the sheets become the landscape cards automatically.
- With Live Server the site loads `data/echo-data.xlsx` on every refresh.
- Without a server, use **Load Excel data** in the top bar to pick the file. It is remembered in that browser only.

## Connecting the upload form
Open `js/upload.js` and set `ENDPOINT` (a form service URL such as Formspree, which receives the file too) or `EMAIL`. Until then the Send request button only shows a "not connected" message.

## Notes
- Fonts (Poppins, Nunito Sans) load from Google Fonts; the site falls back to system fonts offline.
- Brand colours are taken from your reference screenshot (`--green`, `--orange` in `css/styles.css`); change them there if you have exact hex codes.
- The landscape, region and school names, and all titles, are placeholders until you load your data.
