function getLeafs(txt, requireVisible) {
  // Find the leaf nodes that are direct parents of the matching text,
  // optionally requiring them to be visible (tested with positive offsetTop).
  return Array.from(document.querySelectorAll("*")).filter(
    x =>
      (!requireVisible || x.offsetTop > 0) &&
      (x.innerText || "").toLowerCase() == txt.toLowerCase() &&
      [...x.childNodes].filter(child => child.nodeType == x.TEXT_NODE).length >
        0
  );
}

function getDownload2(i) {
  // Doesn't instantaneously show.
  if (getLeafs("Download", true).length < 3)
    setTimeout(() => getDownload2(i), 1000);
  else if (i >= getLeafs("Download", true).length)
    alert("Done with all the Google Downloads!");
  else getLeafs("Download", true)[i].click();
}

function getDownload(i) {
  if (getLeafs("Download", true).length == 0)
    getLeafs("Show exports", false)[0].click();
  getDownload2(i);
}

function login() {
  let passwd = document.querySelector('input[type="password"]');
  if (!passwd) {
    setTimeout(login, 1000);
  } else {
    passwd.value = "XXX FILL ME IN";
    console.log("filled in");
    //passwd.form.submit();
    var submit =
      document.getElementById("passwordNext") ||
      document.querySelector('input[type="submit"]');
    submit.click();
  }
}
