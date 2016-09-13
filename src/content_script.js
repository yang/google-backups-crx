function getLeafs(txt, requireVisible) {
  // Find the leaf nodes that are direct parents of the matching text,
  // optionally requiring them to be visible (tested with positive offsetTop).
  return Array.from(document.getElementsByTagName('div'))
    .filter(
      x => (!requireVisible || x.offsetTop > 0) &&
        Array.from(x.childNodes)
          .filter(child => child.nodeType == x.TEXT_NODE && x.innerText === txt)
          .length > 0
    )
}

function getDownload(i) {
  if (getLeafs('Download', true).length == 0)
    getLeafs('Show exports', false)[0].click();
  // Doesn't instantaneously show.
  setTimeout(function() {
    if (i >= getLeafs('Download', true).length)
      alert('Done with all the Google Downloads!');
    else
      getLeafs('Download', true)[i].click();
  }, 1000);
}

function login() {
  let passwd = document.getElementById('Passwd');
  passwd.value = 'XXX FILL ME IN';
  passwd.form.submit();
}
