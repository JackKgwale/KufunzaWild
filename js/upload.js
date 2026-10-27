/* REQUEST UPLOAD: teachers ask for content to be added and can attach a file.
   TO CONNECT THE FORM: set ENDPOINT to a form service URL (e.g. Formspree, Getform, your own API) - it receives the fields and the attached file.
   Or set EMAIL to open the teacher's mail app instead (files cannot be attached automatically that way). */
(function () {
  var CONFIG = { ENDPOINT: '', EMAIL: '' };
  var L = Layout, D = EchoData, app = document.getElementById('app');
  L.mount('upload'); L.onData(build); D.ready.then(build);
  function build() {
    app.innerHTML = '<section class="pad narrow"><div class="pagehead"><h1>Request an upload</h1><p>Tell us what to add to the platform and attach a file if you have one.</p></div>' +
      '<form class="panel formgrid" id="req"><label class="lbl">Your name<input class="in" name="name" required></label><label class="lbl">School<input class="in" name="school" required></label>' +
      '<label class="lbl">Landscape<select class="in" name="landscape">' + L.opts(D.landscapes()) + '</select></label><label class="lbl">Grade<select class="in" name="grade">' + D.grades().map(function (g) { return '<option>' + L.gl(g) + '</option>'; }).join('') + '</select></label>' +
      '<label class="lbl">Request type<select class="in" name="type"><option>School curriculum</option><option>ECHO content</option></select></label><label class="lbl">Attach a file<input class="in file" type="file" name="file" id="file"></label>' +
      '<label class="lbl full">What should we upload?<textarea class="in" name="message" rows="5" required></textarea></label><div class="full actions"><button class="btn" type="submit">Send request</button><b id="status" role="status"></b></div></form></section>';
    document.getElementById('file').addEventListener('change', function (e) { var f = e.target.files[0]; document.getElementById('status').textContent = f ? 'Attached: ' + f.name + ' (' + Math.max(1, Math.round(f.size / 1024)) + ' KB)' : ''; });
    document.getElementById('req').addEventListener('submit', function (e) {
      e.preventDefault(); var form = e.target, st = document.getElementById('status');
      if (CONFIG.ENDPOINT) {
        st.textContent = 'Sending...';
        fetch(CONFIG.ENDPOINT, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } }).then(function (r) { st.textContent = r.ok ? 'Request sent. Thank you!' : 'Could not send. Please try again.'; if (r.ok) form.reset(); }).catch(function () { st.textContent = 'Could not send. Check your connection.'; });
      } else if (CONFIG.EMAIL) {
        var v = function (n) { return form.elements[n].value; };
        location.href = 'mailto:' + CONFIG.EMAIL + '?subject=' + L.enc('ECHO upload request: ' + v('type')) + '&body=' + L.enc('Name: ' + v('name') + '\nSchool: ' + v('school') + '\nLandscape: ' + v('landscape') + '\nGrade: ' + v('grade') + '\n\n' + v('message') + '\n\n(Please attach your file to this email.)');
      } else { st.textContent = 'Not connected yet: set ENDPOINT or EMAIL in js/upload.js.'; }
    });
  }
})();
