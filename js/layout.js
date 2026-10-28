/* SHARED LAYOUT + HELPERS - top bar, sidebar, icons, small utilities used by every page */
(function () {
  var ICONS = {
    home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/>', book: '<path d="M2 4h7a3 3 0 013 3v13a2 2 0 00-2-2H2z"/><path d="M22 4h-7a3 3 0 00-3 3v13a2 2 0 012-2h8z"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>', chart: '<path d="M5 20V10M12 20V4M19 20v-7"/>',
    upload: '<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v4h16v-4"/>', search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>', chevron: '<path d="M9 6l6 6-6 6"/>',
    down: '<path d="M6 9l6 6 6-6"/>', folder: '<path d="M3 6h7l2 2h9v11H3z"/>', doc: '<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4M9 12h7M9 16h7"/>',
    monitor: '<rect x="3" y="4" width="18" height="12" rx="1"/><path d="M8 20h8M12 16v4"/>', check: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M9 13l2 2 4-4"/>',
    play: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M10 8l6 4-6 4z"/>', calendar: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M8 3v4M16 3v4"/>',
    leaf: '<path d="M5 19c0-9 5-14 15-14 0 10-5 15-14 14zM5 19l8-8"/>', user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
    pin: '<path d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>', back: '<path d="M15 6l-6 6 6 6"/>'
  };
  var TYPE_ICON = { 'Lesson Plans': 'doc', Presentations: 'monitor', Worksheets: 'doc', Quizzes: 'check', Videos: 'play', Manuals: 'book', 'Echo Content': 'doc', 'Baseline Assessments': 'check', 'Environmental Days': 'calendar' };
  var NAV = [['home', 'index.html', 'Home', 'home'], ['curriculum', 'curriculum.html', 'Curriculum', 'book'], ['echo', 'echo.html', 'ECHO Content', 'leaf'], ['landscape', 'index.html#landscapes', 'Browse Landscapes', 'globe'], ['schools', 'schools.html', 'Schools & Targets', 'chart'], ['upload', 'upload.html', 'Request Upload', 'upload']];
  var cb = null;
  var L = {
    icon: function (n, s) { s = s || 22; return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[n] || '') + '</svg>'; },
    typeIcon: function (t) { return TYPE_ICON[t] || 'doc'; },
    esc: function (v) { return String(v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); },
    enc: function (v) { return encodeURIComponent(v); },
    slug: function (s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); },
    qs: function () { var o = {}; new URLSearchParams(location.search).forEach(function (v, k) { o[k] = v; }); return o; },
    col: function (p) { return p >= 100 ? '#2f7d4f' : p >= 50 ? '#c9500f' : '#c0432b'; },
    pc: function (x) { return Math.min(100, Math.round(x.Done / (x.Target || 1) * 100)); },
    gl: function (g) { return g === 'R' ? 'Grade R' : 'Grade ' + L.esc(g); },
    safeLink: function (u) { var c = String(u).replace(/[\u0000-\u0020\u007f]+/g, ''); return /^[a-z][a-z0-9+.-]*:/i.test(c) && !/^(https?|mailto):/i.test(c) ? '' : String(u).trim(); },
    /* photo(): shows the image if the file exists in /images, otherwise the green-to-orange gradient */
    photo: function (path) { return "background-image:url('" + path + "'),linear-gradient(135deg,#12503b,#c9500f);background-size:cover;background-position:center"; },
    opts: function (list, all, val) { return (all ? '<option value="all">' + all + '</option>' : '') + list.map(function (o) { return '<option value="' + L.esc(o) + '"' + (o === val ? ' selected' : '') + '>' + L.esc(o) + '</option>'; }).join(''); },
    logo: function (sz) {
      var r = '', i, a;
      for (i = 0; i < 16; i++) { a = i * Math.PI / 8; r += '<line x1="' + (32 + 17 * Math.cos(a)).toFixed(1) + '" y1="' + (32 + 17 * Math.sin(a)).toFixed(1) + '" x2="' + (32 + 29 * Math.cos(a)).toFixed(1) + '" y2="' + (32 + 29 * Math.sin(a)).toFixed(1) + '"/>'; }
      return '<svg width="' + sz + '" height="' + sz + '" viewBox="0 0 64 64" stroke="#f26522" stroke-width="3.5" stroke-linecap="round" fill="none" aria-hidden="true">' + r + '<circle cx="32" cy="32" r="10" fill="#f26522" stroke="none"/><circle cx="32" cy="32" r="4" fill="#fff" stroke="none"/></svg>';
    },
    onData: function (f) { cb = f; },
    mount: function (page) {
      document.getElementById('topbar').innerHTML = '<header class="topbar"><a class="brand" href="index.html">' + L.logo(52) + '<span class="wi"><b>WILD</b><b>IMPACT</b></span><i class="sep"></i><span class="kw"><b>Kufunza<em>Wild</em></b><small>LEARN | TEACH | PROTECT</small></span></a>' +
        '<form class="search" action="curriculum.html" role="search">' + L.icon('search', 20) + '<input name="q" type="search" placeholder="Search courses, topics, resources..." aria-label="Search courses, topics and resources"></form>' +
        '<nav class="topnav"><a href="index.html"' + (page === 'home' ? ' class="on"' : '') + '>' + L.icon('home', 22) + 'Home</a><a href="curriculum.html"' + (page === 'curriculum' ? ' class="on"' : '') + '>' + L.icon('book', 22) + 'Curriculum</a><a href="schools.html"' + (page === 'schools' ? ' class="on"' : '') + '>' + L.icon('user', 22) + 'Schools</a>' +
        '<label class="xl"><span>Load Excel data</span><input type="file" id="xl" accept=".xlsx,.xls"><small id="note">' + L.esc(EchoData.note()) + '</small></label></nav></header>';
      document.getElementById('side').innerHTML = NAV.map(function (n) { return '<a class="nav' + (n[0] === page ? ' on' : '') + '" href="' + n[1] + '">' + L.icon(n[3], 22) + '<span>' + n[2].replace('&', '&amp;') + '</span></a>'; }).join('') +
        '<div class="sidefoot">' + L.logo(54) + '<span><b>WILD</b><b>IMPACT</b></span></div><div class="rule"></div>';
      document.getElementById('xl').addEventListener('change', EchoData.excelHandler({ forceUpdate: function () { document.getElementById('note').textContent = EchoData.note(); if (cb) cb(); } }));
      EchoData.ready.then(function () { document.getElementById('note').textContent = EchoData.note(); });

    }
  };
  window.Layout = L;
})();
