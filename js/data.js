/* DATA LAYER - sample data + Excel reading (SheetJS).
   Data priority: 1) Excel file loaded in the browser (saved), 2) data/echo-data.xlsx when the site is served over http(s) e.g. VS Code Live Server, 3) built-in sample data.
   Sheets expected in the workbook:
     Schools:    School | Landscape | Region | Community | LessonsDone | Target
     Curriculum: Landscape | Grade | Term | Subject | Type | Title | Description | Link
     Echo:       Landscape | Grade | Type | Title | Description | Link                        */
(function () {
  var KEY = 'kufunza_data_v2', FILE = 'data/echo-data.xlsx', D = null, label = 'Sample data', saved = false, i;
  var TEACHER = ['Lesson Plans', 'Presentations', 'Worksheets', 'Quizzes', 'Videos'];
  var ECHOT = ['Manuals', 'Presentations', 'Echo Content', 'Videos', 'Baseline Assessments', 'Environmental Days'];
  var LS = [], GR = ['R'];
  for (i = 1; i <= 10; i++) LS.push('Landscape ' + (i < 10 ? '0' : '') + i);   // EDIT: replace with your 10 landscape names (or just load your Excel file)
  for (i = 1; i <= 12; i++) GR.push(String(i));
  function pad(n, l) { var s = String(n); while (s.length < l) s = '0' + s; return s; }
  function band(g) { var n = g === 'R' ? 0 : +g; return n <= 3 ? 0 : n <= 6 ? 1 : n <= 9 ? 2 : 3; }
  var SCI = [['Natural World'], ['Natural Sciences & Technology'], ['Natural Sciences'], ['Life Sciences', 'Physical Sciences']];
  function sample() {
    var cur = [], echo = [], sch = [];
    LS.forEach(function (l) { GR.forEach(function (g) {
      SCI[band(g)].concat(['Home Language', 'First Additional Language']).forEach(function (s, si) {
        TEACHER.forEach(function (t, ti) { cur.push({ Landscape: l, Grade: g, Term: String((si + ti) % 4 + 1), Subject: s, Type: t, Title: '[Topic title]', Description: '[Short description of the content]', Link: '' }); }); });
      ECHOT.forEach(function (t) { echo.push({ Landscape: l, Grade: g, Type: t, Title: '[ECHO ' + t.toLowerCase() + ' title]', Description: '[Short description]', Link: '' }); });
    }); });
    for (i = 0; i < 520; i++) sch.push({ School: 'Sample School ' + pad(i + 1, 3), Landscape: LS[i % 10], Region: 'Region ' + pad(i % 52 + 1, 2), Community: 'Community ' + pad(i % 40 + 1, 2), Done: (i * 7 + (i % 13) * 3 + Math.floor(i / 5)) % 17, Target: 12 });
    return { schools: sch, curriculum: cur, echo: echo };
  }
  function g(r, k) { for (var key in r) { if (String(key).trim().toLowerCase() === k) return r[key]; } return ''; }
  function t(r, k) { return String(g(r, k)).trim(); }
  function ns(r) { return { School: t(r, 'school'), Landscape: t(r, 'landscape'), Region: t(r, 'region'), Community: t(r, 'community'), Done: +(g(r, 'lessonsdone') || g(r, 'done')) || 0, Target: +g(r, 'target') || 12 }; }
  function nc(r) { return { Landscape: t(r, 'landscape'), Grade: t(r, 'grade').replace(/^grade\s*/i, '').toUpperCase(), Term: t(r, 'term').replace(/^term\s*/i, ''), Subject: t(r, 'subject'), Type: t(r, 'type'), Title: t(r, 'title'), Description: t(r, 'description'), Link: t(r, 'link') }; }
  function fromBuffer(buf) {
    var wb = XLSX.read(buf, { type: 'array' });
    var sh = function (names) { for (var k = 0; k < wb.SheetNames.length; k++) { if (names.indexOf(wb.SheetNames[k].toLowerCase()) > -1) return XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[k]], { defval: '' }); } return []; };
    var s = sh(['schools']), c = sh(['curriculum']), e = sh(['echo', 'echo content']);
    if (!s.length && !c.length && !e.length) throw new Error('No Schools, Curriculum or Echo sheet found');
    var b = sample();
    return { schools: s.length ? s.map(ns) : b.schools, curriculum: c.length ? c.map(nc) : b.curriculum, echo: e.length ? e.map(nc) : b.echo };
  }
  function uniq(a) { var o = [], seen = {}; a.forEach(function (x) { if (x && !seen[x]) { seen[x] = 1; o.push(x); } }); return o; }
  var ready;
  (function boot() {
    try { var s = JSON.parse(localStorage.getItem(KEY)); if (s && s.d) { D = s.d; label = s.label; saved = true; } } catch (e) {}
    if (!D) D = sample();
    ready = new Promise(function (res) {
      if (saved || !/^https?:/.test(location.protocol) || !window.XLSX || !window.fetch) return res(D);
      fetch(FILE).then(function (r) { return r.ok ? r.arrayBuffer() : Promise.reject(); })
        .then(function (b) { D = fromBuffer(b); label = 'File: ' + FILE; res(D); }, function () { res(D); }).catch(function () { res(D); });
    });
  })();
  window.EchoData = {
    ready: ready,
    get: function () { return D; },
    grades: function () { return GR.slice(); },
    terms: function () { return ['1', '2', '3', '4']; },
    landscapes: function () { var l = uniq(D.schools.map(function (x) { return x.Landscape; }).concat(D.curriculum.map(function (x) { return x.Landscape; }), D.echo.map(function (x) { return x.Landscape; }))); return l.length ? l : LS.slice(); },
    uniq: uniq, note: function () { return label; },
    reset: function () { try { localStorage.removeItem(KEY); } catch (e) {} location.reload(); },
    excelHandler: function (c) {
      return function (e) {
        var f = e.target.files && e.target.files[0]; if (!f) return;
        var r = new FileReader();
        r.onload = function () { try { D = fromBuffer(r.result); label = 'Loaded: ' + f.name; saved = true; try { localStorage.setItem(KEY, JSON.stringify({ d: D, label: label })); } catch (x) {} } catch (x) { label = 'Error: ' + x.message; } c.forceUpdate(); };
        r.onerror = function () { label = 'Error: could not read file'; c.forceUpdate(); };
        r.readAsArrayBuffer(f);
      };
    }
  };
})();
