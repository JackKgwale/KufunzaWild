/* SCHOOLS & TARGETS: progress bars for every school, landscape, region and community, with filters and search */
(function () {
  var L = Layout, D = EchoData, app = document.getElementById('app'), p = L.qs();
  var s = { land: p.l || 'all', region: p.region || 'all', comm: p.comm || 'all', status: 'all', q: '', view: 'schools', lim: 20 };
  L.mount('schools'); L.onData(build); D.ready.then(build);
  function sel(id, label, list, all, val) { return '<label class="lbl">' + label + '<select class="in" data-f="' + id + '">' + L.opts(list, all, val) + '</select></label>'; }
  function row(r) { return '<div class="row"' + (r.k ? ' data-k="' + r.k + '" data-v="' + L.esc(r.name) + '"' : '') + '><div class="nm"><div class="rn">' + L.esc(r.name) + '</div><div class="small">' + L.esc(r.sub) + '</div></div><div class="pg"><div class="track"><div class="fill" style="width:' + r.pct + '%;background:' + L.col(r.pct) + '"></div></div><div class="small mt4">' + L.esc(r.detail) + '</div></div><div class="st"><div class="pv" style="color:' + L.col(r.pct) + '">' + r.pct + '%</div><div class="small">' + r.status + '</div></div></div>'; }
  function build() {
    var S = D.get().schools;
    app.innerHTML = '<section class="pad"><div class="pagehead"><h1>Schools and targets</h1><p>See how far every school, landscape, region and community is from its ECHO lesson target.</p></div><div class="panel filters">' +
      sel('land', 'Landscape', D.landscapes(), 'All landscapes', s.land) + sel('region', 'Region', D.uniq(S.map(function (x) { return x.Region; })), 'All regions', s.region) + sel('comm', 'Community', D.uniq(S.map(function (x) { return x.Community; })), 'All communities', s.comm) +
      '<label class="lbl">Status<select class="in" data-f="status"><option value="all">All schools</option><option value="met">Target met</option><option value="behind">Below target</option></select></label><label class="lbl">Search name<input class="in" type="search" id="f-q" placeholder="Type a school, region or community" value="' + L.esc(s.q) + '"></label></div><div id="res"></div></section>';
    update();
  }
  function update() {
    var S = D.get().schools, q = s.q.toLowerCase(), keys = { landscapes: 'Landscape', regions: 'Region', communities: 'Community' }, rows, noun = s.view;
    if (keys[s.view]) {
      var k = keys[s.view];
      rows = D.uniq(S.map(function (x) { return x[k]; })).filter(function (n) { return n.toLowerCase().indexOf(q) > -1; }).map(function (n) { var g = S.filter(function (x) { return x[k] === n; }), m = g.filter(function (x) { return x.Done >= x.Target; }).length; return { k: k, name: n, sub: g.length + ' schools', pct: Math.round(g.reduce(function (a, x) { return a + L.pc(x); }, 0) / g.length), detail: m + ' of ' + g.length + ' schools met target', status: 'Avg progress' }; });
    } else {
      noun = 'schools';
      rows = S.filter(function (x) { return (s.land === 'all' || x.Landscape === s.land) && (s.region === 'all' || x.Region === s.region) && (s.comm === 'all' || x.Community === s.comm) && (s.status === 'all' || (s.status === 'met') === (x.Done >= x.Target)) && x.School.toLowerCase().indexOf(q) > -1; })
        .map(function (x) { var pp = L.pc(x); return { name: x.School, sub: x.Landscape + ' · ' + x.Region + ' · ' + x.Community, pct: pp, detail: x.Done >= x.Target ? x.Done + ' of ' + x.Target + ' lessons completed' : x.Done + ' of ' + x.Target + ' lessons · ' + (x.Target - x.Done) + ' to go', status: pp >= 100 ? 'Target met' : 'Below target' }; });
    }
    var seg = [['schools', 'Schools'], ['landscapes', 'Landscapes'], ['regions', 'Regions'], ['communities', 'Communities']].map(function (v) { return '<button class="seg' + (s.view === v[0] ? ' on' : '') + '" type="button" data-view="' + v[0] + '">' + v[1] + '</button>'; }).join('');
    document.getElementById('res').innerHTML = '<div class="barhead"><div class="segs">' + seg + '</div><span>Showing ' + Math.min(s.lim, rows.length) + ' of ' + rows.length + ' ' + noun + '</span></div><div class="list">' + rows.slice(0, s.lim).map(row).join('') + (rows.length ? '' : '<div class="small center pad2">No matches. Adjust the filters or search.</div>') + '</div>' + (rows.length > s.lim ? '<div class="center mt"><button class="ghost" type="button" data-more>Show more</button></div>' : '');
  }
  app.addEventListener('change', function (e) { var k = e.target.getAttribute('data-f'); if (!k) return; s[k] = e.target.value; s.lim = 20; if (k !== 'status') s.view = 'schools'; update(); });
  app.addEventListener('input', function (e) { if (e.target.id !== 'f-q') return; s.q = e.target.value; s.lim = 20; update(); });
  app.addEventListener('click', function (e) {
    var b = e.target.closest('[data-view],[data-more],[data-k]'); if (!b) return;
    if (b.hasAttribute('data-more')) s.lim += 40;
    else if (b.hasAttribute('data-view')) { s.view = b.getAttribute('data-view'); s.lim = 20; }
    else { s.land = s.region = s.comm = 'all'; s[{ Landscape: 'land', Region: 'region', Community: 'comm' }[b.getAttribute('data-k')]] = b.getAttribute('data-v'); s.view = 'schools'; s.lim = 20; build(); return; }
    update();
  });
})();
