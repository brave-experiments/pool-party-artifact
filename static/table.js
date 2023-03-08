const table = document.getElementById("table");

const isBrave = location.href.includes("brave");

const [domain1, domain2] = isBrave
      ? ["brave.com", "bravesoftware.com"]
      : ["privacytests.org", "arthuredelstein.net"];

const link = (domain, mode) =>
  `<a href="https://poolparty.${domain}/test.html?mode=${mode}&cycles=100"
      target="_blank"
      rel="nooopener,popup,width=300">poolparty.${domain}</a>`;

const modes = [{name: "WebSockets", mode: "websocket"},
               {name: "Server Sent Events", mode: "sse"},
               {name: "Web Workers", mode: "worker"}];

const rows = modes.map(({name, mode}) => (`
  <tr>
    <td>${name}</td>
    <td>${link(domain1, mode)}</td>
    <td>${link(domain2, mode)}</td>
  </tr>
`));

table.innerHTML = rows.join('\n');

console.log(rows.join('\n'));

