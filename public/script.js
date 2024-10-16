function formatarResultado(dados) {
  console.log('Dados recebidos da API:', dados); 
  if (Array.isArray(dados.stockData)) {
    return dados.stockData.map(stock => `
      <div class="resultado">
        <h3>${stock.stock}</h3>
        <p>Preço Atual: $${stock.price.toFixed(2)}</p>
        <p>Curtidas Relativas: ${stock.rel_likes}</p>
      </div>
    `).join('');
  } else if (dados.stockData) {
    const { stock, price, likes } = dados.stockData;
    return `
      <div class="resultado">
        <h3>${stock}</h3>
        <p>Preço Atual: $${price.toFixed(2)}</p>
        <p>Total de Curtidas: ${likes}</p>
      </div>
    `;
  } else {
    return `<p>Não foi possível obter os dados da ação. Verifique o símbolo e tente novamente.</p>`;
  }
}

function exibirResultado(dados, elementoResultado) {
  if (elementoResultado) {
    elementoResultado.innerHTML = formatarResultado(dados);
  } else {
    console.error('Elemento para exibição do resultado não encontrado.');
  }
}

function alternarAba(aba) {
  const abas = document.querySelectorAll('.tab-content');
  abas.forEach(tab => tab.classList.remove('active'));
  document.getElementById(aba).classList.add('active');
  document.querySelector('.resultado').innerHTML = '';
}

document.querySelectorAll('.tabs .tab a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const aba = e.target.getAttribute('data-tab');
    document.querySelectorAll('.tabs .tab a').forEach(el => el.classList.remove('active'));
    e.target.classList.add('active');
    alternarAba(aba);
  });
});

document.getElementById('formUnico').addEventListener('submit', e => {
  e.preventDefault();
  const stock = e.target.querySelector('input[name="stock"]').value;
  const checkbox = e.target.querySelector('input[name="like"]').checked;
  fetch(`/api/stock-prices/?stock=${stock}&like=${checkbox}`)
    .then(res => res.json())
    .then(data => {
      exibirResultado(data, document.getElementById('resultadoUnico'));
    })
    .catch(error => {
      console.error('Erro ao consultar a API:', error);
      document.getElementById('resultadoUnico').innerHTML = `<p>Erro ao consultar a API. Tente novamente.</p>`;
    });
});

document.getElementById('formComparacao').addEventListener('submit', e => {
  e.preventDefault();
  const stock1 = e.target.querySelector('input[name="stock1"]').value;
  const stock2 = e.target.querySelector('input[name="stock2"]').value;
  const checkbox = e.target.querySelector('input[name="like"]').checked;
  fetch(`/api/stock-prices?stock=${stock1}&stock=${stock2}&like=${checkbox}`)
    .then(res => res.json())
    .then(data => {
      exibirResultado(data, document.getElementById('resultadoComparacao'));
    })
    .catch(error => {
      console.error('Erro ao consultar a API:', error);
      document.getElementById('resultadoComparacao').innerHTML = `<p>Erro ao consultar a API. Tente novamente.</p>`;
    });
});
function exibirResultado(data) {
  const resultadoDiv = document.getElementById('resultadoJson');
  resultadoDiv.innerHTML = ''; 

  if (Array.isArray(data.stockData)) {
      data.stockData.forEach(stock => {
          const li = document.createElement('li');
          li.innerHTML = `
              <h3>${stock.stock}</h3>
              <p>Preço Atual: $${stock.price.toFixed(2)}</p>
              <p>Curtidas Relativas: ${stock.rel_likes}</p>
          `;
          resultadoDiv.appendChild(li);
      });
  } else if (data.stockData) {
      const li = document.createElement('li');
      li.innerHTML = `
          <h3>${data.stockData.stock}</h3>
          <p>Preço Atual: $${data.stockData.price.toFixed(2)}</p>
          <p>Total de Curtidas: ${data.stockData.likes}</p>
      `;
      resultadoDiv.appendChild(li);
  }
}
