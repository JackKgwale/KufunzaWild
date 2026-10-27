/* HOME: welcome banner, overall ECHO targets, landscape cards, ECHO resources, school subjects */
(function () {
  var L = Layout, D = EchoData, app = document.getElementById('app');
  L.mount('home'); L.onData(render); D.ready.then(render);
  function render() {
    var d = D.get(), S = d.schools, n = S.length || 1, met = S.filter(function (x) { return x.Done >= x.Target; }).length;
    var avg = Math.round(S.reduce(function (a, x) { return a + L.pc(x); }, 0) / n), lands = D.landscapes();
    var u = function (k) { return D.uniq(S.map(function (x) { return x[k]; })).length; };
    var cards = lands.map(function (l) {
      var g = S.filter(function (x) { return x.Landscape === l; }), p = Math.round(g.reduce(function (a, x) { return a + L.pc(x); }, 0) / (g.length || 1));
      return '<a class="lcard" href="landscape.html?l=' + L.enc(l) + '"><div class="ph" style="' + L.photo('images/landscapes/' + L.slug(l) + '.jpg') + '"></div><div class="lb">' + L.icon('pin', 24) + '<span>' + L.esc(l) + '</span></div><div class="lm"><div class="track"><div class="fill" style="width:' + p + '%;background:' + L.col(p) + '"></div></div><small>' + g.length + ' schools · ' + p + '% of target</small></div></a>';
    }).join('');
    var echoTypes = D.uniq(d.echo.map(function (x) { return x.Type; })).map(function (t) { return '<a class="it" href="echo.html?t=' + L.enc(t) + '">' + L.icon(L.typeIcon(t), 26) + '<span>' + L.esc(t) + '</span><em>' + d.echo.filter(function (x) { return x.Type === t; }).length + '</em>' + L.icon('chevron', 16) + '</a>'; }).join('');
    var subjects = D.uniq(d.curriculum.map(function (x) { return x.Subject; })).map(function (s) { return '<a class="it" href="curriculum.html?s=' + L.enc(s) + '">' + L.icon('book', 26) + '<span>' + L.esc(s) + '</span><em>' + d.curriculum.filter(function (x) { return x.Subject === s; }).length + '</em>' + L.icon('chevron', 16) + '</a>'; }).join('');
    app.innerHTML = '<section class="hero"><h1>Welcome to KufunzaWild!</h1><p>Explore curated educational resources, lesson plans and more, designed by teachers, for teachers.</p></section>' +
      '<section class="pad"><div class="panel targets"><div class="eyebrow">ECHO lesson targets</div><h2>' + Math.round(met / n * 100) + '% of schools have met their ECHO lesson target</h2>' +
      '<div class="kpis"><div><b>' + S.length + '</b><small>Schools</small></div><div><b>' + lands.length + '</b><small>Landscapes</small></div><div><b>' + u('Region') + '</b><small>Regions</small></div><div><b>' + u('Community') + '</b><small>Communities</small></div></div>' +
      '<div class="barhead"><span>Average progress to target</span><b>' + avg + '%</b></div><div class="track big"><div class="fill" style="width:' + avg + '%;background:#f26522"></div></div><a class="btn" href="schools.html">View school targets</a></div></section>' +
      '<section class="pad" id="landscapes"><h2 class="sh">Explore Our Landscapes</h2><div class="lgrid">' + cards + '</div></section>' +
      '<section class="pad"><div class="cols two"><div class="rp"><div class="rp-h"><span class="ic">' + L.icon('leaf', 26) + '</span><div><h3>ECHO Resources</h3><p>Environmental education resources and programme materials.</p></div></div>' + echoTypes + '</div>' +
      '<div class="rp"><div class="rp-h"><span class="ic">' + L.icon('book', 26) + '</span><div><h3>School Subjects</h3><p>Sciences and languages, Grade R to Grade 12.</p></div></div>' + subjects + '</div></div></section>';
  }
})();
