let decks_skip = 0;
const decks_take = 100;
const listData = [];
const _token = $('meta[name="csrf-token"]').attr('content');

const downloadFile = () => {
  const file = new Blob([JSON.stringify(listData)], { type: 'application/json' });

  const a = document.createElement('a');
  const url = URL.createObjectURL(file);
  a.href = url;
  a.download = 'p52_collection.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const fetchPage = () => {
  console.log('Initializing')
  console.log(_token)
  const $p = $('<p>Exporting...</p>');
  $p.appendTo(document.body);
  $p.css({ position: 'fixed', top: 15, left: 15, zIndex: 10000, padding: '8px 12px', margin: 0, background: '#f0f066' })
  const formData = new FormData();
  const collectionId = window.location.href.replace(/^.+portfolio52\.com/, '').replace(/[^0-9]/g, '');
  const search_string = window.location.href.split('/').pop();

  formData.append('search_string', search_string);
  formData.append('decks_skip', decks_skip);
  formData.append('decks_take', decks_take);
  formData.append('_token', _token);
  formData.append('sort', '');
  formData.append('view', 'middleGrid');
  decks_skip += decks_take;

  fetch(`https://www.portfolio52.com/profile/${collectionId}/collection/search`, {
    method: 'POST',
    body: formData,
  }).then((res) => res.text()).then((data) => {
    const $dom = $(`<div>${data}</div>`);
    const $decks = $dom.find('.lightbox-items');
    if ($decks.length) {
      $decks.each(() => {
        const $el = $(this);
        const [collection, wishlist, tradelist] = $el.find('div.deck-view-collections').map((_, el) => +el.innerText.replace(/[^0-9]/g, '')).get();
        listData.push({
          id: $el.find('[name=id]').val(),
          collection,
          wishlist,
          tradelist,
          note: $el.find('textarea').val(),
        });
      });
    }
    if ($decks.length === decks_take) {
      return fetchPage();
    }
    $p.css({ background: '#33cc33' }).text('Deck info copied to clipboard')
    downloadFile();
  })
}

fetchPage();
