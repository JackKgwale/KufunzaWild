/* LANDSCAPE DETAIL: School Subjects (grades, terms), Teacher Resources, ECHO Resources for one landscape */
(function () {
  var L = Layout, D = EchoData, app = document.getElementById('app'), p = L.qs();
  L.mount('landscape'); L.onData(render); D.ready.then(render);
  function head(ic, t, sub) { return '<div class="rp-h"><span class="ic">' + L.icon(ic, 26) + '</span><div><h3>' + t + '</h3><p>' + sub + '</p></div></div>'; }
  function item(href, ic, label, n) { return '<a class="it" href="' + href + '">' + L.icon(ic, 24) + '<span>' + L.esc(label) + '</span>' + (n === undefined ? '' : '<em>' + n + '</em>') + L.icon('chevron', 16) + '</a>'; }
  function render() {
    var d = D.get(), lands = D.landscapes(), l = lands.indexOf(p.l) > -1 ? p.l : lands[0], q = 'l=' + L.enc(l);
    var S = d.schools.filter(function (x) { return x.Landscape === l; }), met = S.filter(function (x) { return x.Done >= x.Target; }).length;
    var avg = Math.round(S.reduce(function (a, x) { return a + L.pc(x); }, 0) / (S.length || 1));
    var cur = d.curriculum.filter(function (x) { return x.Landscape === l; }), ech = d.echo.filter(function (x) { return x.Landscape === l; });
    var n = function (a, k, v) { return a.filter(function (x) { return x[k] === v; }).length; };
    var grades = D.grades().map(function (g) { return item('curriculum.html?' + q + '&g=' + g, 'folder', L.gl(g), n(cur, 'Grade', g)); }).join('');
    var terms = D.terms().map(function (t) { return item('curriculum.html?' + q + '&term=' + t, 'folder', 'Term ' + t, n(cur, 'Term', t)); }).join('');
    var subs = D.uniq(cur.map(function (x) { return x.Subject; })).map(function (s) { return item('curriculum.html?' + q + '&s=' + L.enc(s), 'book', s, n(cur, 'Subject', s)); }).join('');
    var teach = D.uniq(cur.map(function (x) { return x.Type; })).map(function (t) { return item('curriculum.html?' + q + '&t=' + L.enc(t), L.typeIcon(t), t, n(cur, 'Type', t)); }).join('');
    var echo = D.uniq(ech.map(function (x) { return x.Type; })).map(function (t) { return item('echo.html?' + q + '&t=' + L.enc(t), L.typeIcon(t), t, n(ech, 'Type', t)); }).join('');
    app.innerHTML = '<section class="pad"><div class="banner" style="' + L.photo('images/landscapes/' + L.slug(l) + '.jpg') + '"><a class="backlink" href="index.html#landscapes">' + L.icon('back', 14) + ' Back to Landscapes</a><div class="bt">' + L.icon('pin', 44) + '<div><h1>' + L.esc(l) + '</h1><p>Explore resources, build knowledge, create change.</p></div></div></div>' +
      '<div class="panel mt"><div class="barhead"><span><b>ECHO lesson target:</b> ' + met + ' of ' + S.length + ' schools have met their target</span><b>' + avg + '%</b></div><div class="track big"><div class="fill" style="width:' + avg + '%;background:' + L.col(avg) + '"></div></div><a class="btn mt" href="schools.html?' + q + '">See schools in this landscape</a></div></section>' +
      '<section class="pad"><div class="cols">' +
      '<div class="rp">' + head('book', 'School Subjects', 'Grade-specific content for sciences and languages.') + '<details class="acc" open><summary>' + L.icon('folder', 20) + 'Grades' + L.icon('down', 16) + '</summary>' + grades + '</details><details class="acc"><summary>' + L.icon('folder', 20) + 'Terms' + L.icon('down', 16) + '</summary>' + terms + '</details><details class="acc"><summary>' + L.icon('folder', 20) + 'Subjects' + L.icon('down', 16) + '</summary>' + subs + '</details></div>' +
      '<div class="rp">' + head('user', 'Teacher Resources', 'Tools and materials to support your teaching.') + teach + '</div>' +
      '<div class="rp">' + head('leaf', 'Echo Resources', 'Environmental education resources and programme materials.') + echo + '</div></div></section>';
  }
})();
