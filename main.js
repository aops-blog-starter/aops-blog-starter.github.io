option_pane = document.getElementById("options");

let settings = {
  toggle: (label, value) => name => {
    let checkbox_label = document.createElement('label');
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = name;
    checkbox.checked = value;
    checkbox_label.appendChild(checkbox);
    checkbox_label.appendChild(document.createTextNode(' ' + label));
    return checkbox_label;
  },
  select: (label, options) => name => {
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
    return select_label;
  },
  text: (label, value) => name => {
    let text_label = document.createElement('label');
    let text_input = document.createElement('input');
    text_input.type = 'text';
    text_input.name = name;
    text_input.value = value;
    text_label.appendChild(text_input);
    text_label.appendChild(document.createTextNode(' ' + label));
    return text_label;
  },
}

let config_options = {
  sidebar_mode: settings.select("Sidebar mode", ["Right", "Left", "Float"]),
  wrapper_bg: settings.text("Wrapper background", ''),
}
for (const option in config_options) {
  option_pane.appendChild(config_options[option](option));
  option_pane.appendChild(document.createElement('br'));
}

let generate = conf => {
  wrapper_bg = conf.wrapper_bg
    ? conf.wrapper_bg
    : conf.sidebar_mode === 'Left'
      ? 'linear-gradient(90deg, #f3f3f3 0, #f3f3f3 260px, #fff 260px)'
      : ''
    ;
  return `\
${{
      'Right': '',
      'Left': `\
#main{
  float: right;
}
#side{
  float: left;
}
`,
      'Float': '',
    }[conf.sidebar_mode]}\
${wrapper_bg ? `#wrapper{
  background: ${wrapper_bg};
}
` : ''}\
`};

option_pane.addEventListener("input", () => {
  let conf = {};
  for (let el of option_pane.elements) conf[el.name] = el.type == "checkbox" ? el.checked : el.value;
  console.log(generate(conf)); // FIXME
});
