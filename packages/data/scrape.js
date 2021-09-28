const fetch = require('node-fetch');
const { JSDOM } = require('jsdom');


async function run() {
  const res = await fetch('https://www.wicurio.com/grand_order/index.php?%E7%9C%9F%E5%90%8D%E4%B8%80%E8%A6%A7%28%E3%82%AF%E3%83%A9%E3%82%B9%E3%83%BB%E3%83%AC%E3%82%A2%E3%83%AA%E3%83%86%E3%82%A3%E5%88%A5%29');
  const html = await res.text();

  const dom = new JSDOM(html);
  const { document } = dom.window;
  const table = Array.from(document.querySelectorAll('h3'))
        .find(elem => elem.textContent.includes('レアリティ・クラス別一覧'))
        .nextElementSibling
        .firstChild;
  const eireis = Array.from(table.querySelectorAll('td'))
        .map(elem => elem.querySelector('a'))
        .filter(a => !!a)
        .map(a => {
          const name = /(.*) \([0-9]+[dh]\)/.exec(a.title)[1];
          const url = a.href;
          return { name, url };
        });

  process.stdout.write(JSON.stringify(eireis));
}

run();
