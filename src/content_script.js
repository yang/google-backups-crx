function getLeafs(txt, visible) {
  return Array.from(document.getElementsByTagName('div'))
    .filter(
      x => (!visible || x.offsetTop > 0) &&
        Array.from(x.childNodes)
          .filter(child => child.nodeType == x.TEXT_NODE && x.innerText === txt)
          .length > 0
    )
}

function getDownload(i) {
  if (getLeafs('Download', true).length == 0)
    getLeafs('Show exports', false)[0].click();
  setTimeout((() => {
    if (i >= getLeafs('Download', true).length)
      alert('Done!');
    else
      getLeafs('Download', true)[i].click();
  }), 1000);
}

function tryLogin() {
  let passwd = document.getElementById('Passwd');
  passwd.value = 'XXX FILL ME IN';
  passwd.form.submit();
  return;
  // This autofill is not visible for security.
  if (passwd.value.length > 0) {
    passwd.form.submit();
  } else {
    console.log('waiting for passwd', passwd);
  }
}
