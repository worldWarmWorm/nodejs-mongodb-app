const toCurrancy = price => {
  return new Intl.NumberFormat('ru-RU', {
    currency: 'rub',
    style: 'currency',
  }).format(price)
}

document.querySelectorAll('.price').forEach((node) => {
  node.textContent = toCurrancy(node.textContent)
})

const $cart = document.querySelector('#cart')

if ($cart) {
  $cart.addEventListener('click', (event) => {
    if (event.target.classList.contains('js-delete')) {
      const id = event.target.dataset.id;

      fetch('/cart/delete/' + id, {
        method: 'DELETE'
      }).then(res => res.json())
        .then(cart => {
          if (cart.courses.length) {
            const html = cart.courses.map(c => {
              return `
                <tr>
                  <td>${c.title}</td>
                  <td>${c.count}</td>
                  <td>
                    <button
                      class="btn btn-small js-delete"
                      data-id="${c.id}"
                    >Удалить</button>
                  </td>
                </tr>
              `
            }).join('')
            $cart.querySelector('tbody').innerHTML = html
            $cart.querySelector('.price').innerHTML = toCurrancy(cart.price)
          } else {
            $cart.innerHTML = '<p>Корзина пуста</p>'
          }
        })
    }
  })
}
