// ==UserScript==
// @name        Repost MD5 picker
// @namespace   https://github.com/ccd0
// @description Generates an MD5 filter list from images selected from the archives' commonly reposted images pages.
// @license     WTFPL; https://github.com/ccd0/md5-picker/blob/master/LICENSE
// @match       *://archive.moe/*/statistics/image-reposts/
// @match       *://archive.4plebs.org/*/statistics/image-reposts/
// @match       *://archive.nyafuu.org/*/statistics/image-reposts/
// @match       *://archive.loveisover.me/*/statistics/image-reposts/
// @match       *://archive.rebeccablacktech.com/*/reports/image-reposts
// @match       *://rbt.asia/*/reports/image-reposts
// @match       *://warosu.org/*/reports/image-reposts
// @match       *://totally.not4plebs.org/*/statistics/image-reposts/
// @match       *://archive.desustorage.org/*/statistics/image-reposts/
// @version     0.0.1
// @grant       none
// @updateURL 	 https://ccd0.github.io/md5-picker/md5-picker.meta.js
// @downloadURL  https://ccd0.github.io/md5-picker/md5-picker.user.js
// ==/UserScript==

var style = document.createElement('style');
style.textContent =
  '#md5-picker button   {display: block; margin: auto;}' +
  '#md5-picker div      {width: 960px; margin: auto;}' +
  '#md5-picker label    {display: flex; align-items: center; width: 100%; margin: 0px;}' +
  '#md5-picker input    {flex: auto; margin: 5px 0px;}' +
  '#md5-picker textarea {width: 100%; height: 360px; box-sizing: border-box;}' +
  '.md5-picked img      {box-shadow: 0px 0px 0px 3px red;}';
document.head.appendChild(style);

var controls = document.createElement('div');
controls.id = 'md5-picker';
controls.innerHTML = '<button>Pick MD5s</button><div hidden><label>Filter options:&nbsp;<input type="text"></label><textarea></textarea></div>';

var button  = controls.querySelector('button');
var div     = controls.querySelector('div');
var options = controls.querySelector('input');
var filters = controls.querySelector('textarea');

var reposts = document.querySelectorAll('.image_reposts_image > a, .report-thumbs td > a');

function toggle() {
  var enabled = div.hidden;
  div.hidden = !enabled;
  for (var i = 0; i < reposts.length; i++) {
    reposts[i][(enabled ? 'add' : 'remove') + 'EventListener']('click', pick, false);
  }
}

function getMD5(link) {
  return '/' + link.href.match(/\/image\/([^\/]*)\/?$/)[1].replace(/-/g, '+').replace(/_/g, '/') + '==/';
}

function isPicked(md5) {
  return ('\n' + filters.value).indexOf('\n' + md5) !== -1;
}

function pick(e) {
  if (e.shiftKey || e.ctrlKey || e.altKey || e.metaKey || e.button !== 0) {
    return;
  }
  e.stopPropagation();
  e.preventDefault();
  var md5 = getMD5(this);
  var filtersVal = filters.value;
  if (isPicked(md5)) {
    filters.value = ('\n' + filters.value).split('\n' + md5).map(function(x) {return x.replace(/^.*/, '')}).join('').substr(1);
    this.classList.remove('md5-picked');
  } else {
    filters.value += (/.$/.test(filters.value) ? '\n' : '') + md5 + options.value + '\n';
    this.classList.add('md5-picked');
  }
}

function update() {
  for (var i = 0; i < reposts.length; i++) {
    reposts[i].classList.toggle('md5-picked', isPicked(getMD5(reposts[i])));
  }
}

button.addEventListener('click', toggle, false);
filters.addEventListener('change', update, false);

var place = document.querySelector('.report-thumbs') || reposts[0].parentNode.parentNode;
place.parentNode.insertBefore(controls, place);
