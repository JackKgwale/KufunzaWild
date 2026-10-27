/* CURRICULUM and ECHO CONTENT pages: filter by landscape, grade (R-12), term, subject, type and search */
(function () {
  var L = Layout, D = EchoData, app = document.getElementById('app'), page = document.body.getAttribute('data-page'), isCur = page === 'curriculum', p = L.qs();
  var s = { land: p.l || 'all', gr: p.g || 'all', term: p.term || 'all', sub: p.s || 'all', type: p.t || 'all', q: p.q || '', lim: 24 };
  L.mount(page); L.onData(build); D.ready.then(build);
  function data() { return isCur ? D.get().curriculum : D.get().echo; }
  function sel(id, label, list, all, val) { return '<label class="lbl">' + label + '<select class="in" data-f="' + id + '">' + L.opts(list, all, val) + '</select></label>'; }
  function build() {
    var all = data();
    app.innerHTML = '<section class="pad"><div class="pagehead"><h1>' + (isCur ? 'School Curriculum' : 'ECHO Content') + '</h1><p>' + (isCur ? 'Sciences and languages for each landscape, Grade R to Grade 12.' : 'Wild Impact ECHO resources for each landscape, Grade R to Grade 12.') + '</p></div>' +
      '<div class="panel filters">' + sel('land', 'Landscape', D.landscapes(), 'All landscapes', s.land) + (isCur ? sel('term', 'Term', D.terms(), 'All terms', s.term) + sel('sub', 'Subject', D.uniq(all.map(function (x) { return x.Subject; })), 'All subjects', s.sub) : '') +
      sel('type', 'Resource type', D.uniq(all.map(function (x) { return x.Type; })), 'All types', s.type) + '<label class="lbl">Search<input class="in" type="search" id="f-q" placeholder="Search titles" value="' + L.esc(s.q) + '"></label></div><div id="res"></div></section>';
    update();
  }
  function update() {
    var q = s.q.toLowerCase();
    var f = data().filter(function (x) { return (s.land === 'all' || x.Landscape === s.land) && (s.gr === 'all' || x.Grade === s.gr) && (!isCur || ((s.term === 'all' || x.Term === s.term) && (s.sub === 'all' || x.Subject === s.sub))) && (s.type === 'all' || x.Type === s.type) && (x.Title + ' ' + x.Description + ' ' + x.Type + ' ' + (x.Subject || '')).toLowerCase().indexOf(q) > -1; });
    var pills = ['all'].concat(D.grades()).map(function (g) { return '<button class="gp' + (s.gr === g ? ' on' : '') + '" type="button" data-grade="' + g + '">' + (g === 'all' ? 'All grades' : L.gl(g)) + '</button>'; }).join('');
    var cards = f.slice(0, s.lim).map(function (x) {
      var key = isCur ? 'images/subjects/' + L.slug(x.Subject) : 'images/resources/' + L.slug(x.Type), link = L.safeLink(x.Link);
      return '<article class="rcard"><div class="rimg" style="' + L.photo(key + '.jpg') + '"><span class="badge">' + L.icon(L.typeIcon(x.Type), 22) + '</span></div><div class="rb"><div class="kind">' + L.esc(x.Type) + (isCur && x.Subject ? ' · ' + L.esc(x.Subject) : '') + '</div><h3>' + L.esc(x.Title) + '</h3><p>' + L.esc(x.Description) + '</p><div class="meta">' + L.gl(x.Grade) + (isCur && x.Term ? ' · Term ' + L.esc(x.Term) : '') + ' · ' + L.esc(x.Landscape) + '</div>' + (link ? '<a class="open" href="' + L.esc(link) + '" target="_blank" rel="noopener">Open resource</a>' : '') + '</div></article>';
    }).join('');
    document.getElementById('res').innerHTML = '<div class="pills">' + pills + '</div><div class="barhead"><span>Showing ' + Math.min(s.lim, f.length) + ' of ' + f.length + '</span></div><div class="rgrid">' + cards + '</div>' + (f.length ? '' : '<div class="panel center">Nothing found for these filters yet.</div>') + (f.length > s.lim ? '<div class="center mt"><button class="ghost" type="button" data-more>Show more</button></div>' : '');
  }
  app.addEventListener('change', function (e) { var k = e.target.getAttribute('data-f'); if (!k) return; s[{ land: 'land', term: 'term', sub: 'sub', type: 'type' }[k]] = e.target.value; s.lim = 24; update(); });
  app.addEventListener('input', function (e) { if (e.target.id !== 'f-q') return; s.q = e.target.value; s.lim = 24; update(); });
  app.addEventListener('click', function (e) { var b = e.target.closest('[data-grade],[data-more]'); if (!b) return; if (b.hasAttribute('data-more')) s.lim += 24; else { s.gr = b.getAttribute('data-grade'); s.lim = 24; } update(); });
})();
