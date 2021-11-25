option_pane = document.getElementById("options");

// Functions for constructing the option pane
let settings = {
  toggle: (name, label, value) => {
    let checkbox_label = document.createElement('label');
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = name;
    checkbox.checked = value;
    checkbox_label.appendChild(checkbox);
    checkbox_label.appendChild(document.createTextNode(' ' + label));
    option_pane.appendChild(checkbox_label);
    option_pane.appendChild(document.createElement('br'));
  },
  select: (name, label, options) => {
    let select_label = document.createElement('label');
    select_label.innerText = label + ' ';
    let select = document.createElement('select');
    select.name = name;
    for (let option of options) {
      let option_element = document.createElement('option');
      option_element.value = option;
      option_element.innerText = option;
      select.appendChild(option_element);
    }
    select.value = options[0];
    select_label.appendChild(select);
    option_pane.appendChild(select_label);
    option_pane.appendChild(document.createElement('br'));
  },
  text_input: (name, label, value) => {
    let text_label = document.createElement('label');
    let text_input = document.createElement('input');
    text_input.type = 'text';
    text_input.name = name;
    text_input.value = value;
    text_label.appendChild(text_input);
    text_label.appendChild(document.createTextNode(' ' + label));
    option_pane.appendChild(text_label);
    option_pane.appendChild(document.createElement('br'));
  },
  section_header: text => {
    let header = document.createElement('h3');
    header.innerText = text;
    option_pane.appendChild(header);
  },
  text: text => {
    let p = document.createElement('p');
    p.innerText = text;
    option_pane.appendChild(p);
  },
}

// Settings
settings.select('sidebar_mode', 'Sidebar mode', ['Right', 'Left', 'Float']);
settings.toggle('wrapper_full_width', 'Full width wrapper', false);
settings.text_input("wrapper_bg", "Wrapper background", '');
settings.section_header('Fixes');
settings.text('These add code fixing certain quirks and bugs with the default CSS, and should generally be left on.');
settings.toggle('fixes_code', 'Fix code text visibility', true);
settings.toggle('fixes_feed_admin', 'Fix admin/mod colors in feed', true);
settings.toggle('fixes_shout_double_scrollbar', 'Fix double scrollbar in shouts', true);

// CSS for fix_* options
let fix_codes = [
  ['fixes_code', `\
/* Code color */
code[class*="language-"] {
  color: #333;
}
`],
  ['fixes_feed_admin', `\
/* Feed moderation colors */
.cmty-post .cmty-user-admin a,.cmty-post .cmty-user-admin:before{color: #009fad !important;}
.cmty-forum-admin a{color: #900 !important;}
.cmty-forum-mod a{color: #090 !important;}
`],
  ['fixes_shout_double_scrollbar', `\
/* Shout scrollbar fix */
.blog-shout-wrapper > .aops-scroll-outer > .aops-scroll-inner{
scrollbar-width: none;
}
/* Nonstandard but necessary until Chromium supports scrollbar-width */
.blog-shout-wrapper > .aops-scroll-outer > .aops-scroll-inner::-webkit-scrollbar {
width: 0px;
}
`],
];

// Big ugly code to generate the CSS
let generate = conf => {
  let segments = []
  let wrapper_bg = conf.wrapper_bg
    ? conf.wrapper_bg
    : {
      'Left': 'linear-gradient(90deg, #f3f3f3 0, #f3f3f3 260px, #fff 260px)',
      'Right': null,
      'Float': '#fff',
    }[conf.sidebar_mode]
    ;
  let fixes = '';
  for (const [fix, code] of fix_codes) {
    if (conf[fix]) {
      fixes += code;
    }
  }
  segments.push({
    'Right': '',
    'Left': `\
#main{
  float: right;
}
#side{
  float: left;
}
`,
    'Float': `\
#side {
  position: fixed;
  z-index: 1000000;
  left: -270px;
  top: 0;
  height: 100%;
  overflow-y: scroll;
  background: #f3f3f3;
}
#side:hover{
  left: 0;
}
#side::before{
  position: fixed;
  left: 0;
  top: 100px;
  content: '>';
  background: #ccc;
  padding: 10px;
  border-radius: 0 50% 50% 0;
}
#side:hover::before{
  display: none;
}
`,
  }[conf.sidebar_mode]);
  if (wrapper_bg) segments.push(`#wrapper{
  background: ${wrapper_bg};
}
`);

  if (conf.sidebar_mode === 'Float') {
    segments.push(`\
#main {
  width: 100%;
}
`);
  } else if (conf.wrapper_full_width === true) segments.push(`\
#main {
  width: calc(100% - 270px);
}
`)
  if (conf.wrapper_full_width === true) segments.push(`\
#wrapper {
  width: 100%;
};
`);

  if (fixes) segments.push(`/* Fixes */
${fixes}`);
  return segments.join('');
}

let current_css;
let copy_button = document.getElementById('copy_button');
const COPY_BUTTON_TEXT = 'Copy generated CSS';
let copy_timeout;
copy_button.addEventListener('click', () => {
  if (!current_css) return;
  navigator.clipboard.writeText(current_css).then(() => {
    copy_button.innerText = 'CSS Copied';
    if (copy_timeout) clearTimeout(copy_timeout);
    copy_timeout = setTimeout(() => copy_button.innerText = COPY_BUTTON_TEXT, 1000);
  }).catch(() => {
    copy_button.innerText = 'CSS could not be copied';
    if (copy_timeout) clearTimeout(copy_timeout);
    copy_timeout = setTimeout(() => copy_button.innerText = COPY_BUTTON_TEXT, 3000);
  });
});


// Messages generated CSS to the child frame
function send_css() {
  let conf = {};
  for (let el of option_pane.elements) conf[el.name] = el.type == "checkbox" ? el.checked : el.value;
  current_css = generate(conf);
  window.frames[0].postMessage({
    type: 'blog css',
    css: current_css,
  }, '*');
}

// Send CSS if the child requests it
window.addEventListener('message', e => {
  if (e.data == 'css request') send_css();
});
// Send CSS when the options are changed
option_pane.addEventListener('input', send_css);

