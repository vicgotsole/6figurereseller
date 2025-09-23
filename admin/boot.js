(function () {
  // Identity redirect: after login, keep user on /admin
  if (window.netlifyIdentity) {
    window.netlifyIdentity.on("init", function (user) {
      if (!user) {
        window.netlifyIdentity.on("login", function () {
          location.replace("/admin/");
        });
      }
    });
  }

  // Hide fallback once CMS attaches to #nc-root
  var root = document.getElementById("nc-root");
  var fb = document.getElementById("fallback");
  var hint = document.getElementById("hint");

  function showHint(msg) {
    if (!hint) return;
    hint.innerHTML = msg;
    hint.hidden = false;
  }

  var obs = new MutationObserver(function () {
    if (root && root.querySelector("*")) {
      if (fb) fb.style.display = "none";
      obs.disconnect();
    }
  });
  if (root) obs.observe(root, { childList: true, subtree: true });

  // Early check that config.yml is reachable (clearer errors)
  fetch("/admin/config.yml", { cache: "no-store" }).then(function (res) {
    if (!res.ok) {
      showHint(
        "Could not load <code>/admin/config.yml</code> (HTTP " +
          res.status +
          "). Make sure it exists and is published."
      );
    }
  }).catch(function () {
    showHint(
      "Network error fetching <code>/admin/config.yml</code>. If you're on a restricted network, try a different connection."
    );
  });
})();
