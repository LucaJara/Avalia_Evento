const iniciarBtn = document.getElementById('iniciarBtn');
const avaliacaoDiv = document.getElementById('avaliacao');
const mensagemDiv = document.getElementById('mensagem');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const encerrarBtn = document.getElementById('encerrarBtn');
const opcoesBtns = document.querySelectorAll('.opcao');
const nomeEventoInput = document.getElementById('nomeEvento'); 
const responsavelEventoInput = document.getElementById('responsavelEvento'); 
const instituicaoEnsinoInput = document.getElementById('instituicaoEnsino'); 
const uploadImagemInput = document.getElementById('uploadImagem');
const logoImg = document.getElementById('logo');
const container = document.getElementById('container');


let avaliacoes = [];
let senhaPadrao = "";
let nomeEvento = "";
let responsavelEvento = "";
let instituicaoEnsino = "";
let urlImagemCarregada = ""; // Variável para armazenar a URL da imagem

const logoSalvo = localStorage.getItem('logoEvento');
if (logoSalvo) {
  const logoImg = document.getElementById('logo'); // Obter a referência da imagem
  logoImg.src = logoSalvo;
}


iniciarBtn.addEventListener('click', () => {
  nomeEvento = nomeEventoInput.value; 
  while (nomeEvento === null || nomeEvento.trim() === "") {
    nomeEvento = prompt("O nome do evento não pode ser vazio. Digite o nome do evento:");
  }

  responsavelEvento = responsavelEventoInput.value;
  while (responsavelEvento === null || responsavelEvento.trim() === "") {
    responsavelEvento = prompt("O nome do responsável não pode ser vazio. Digite o nome do responsável:");
  }

  instituicaoEnsino = instituicaoEnsinoInput.value;
  while (instituicaoEnsino === null || instituicaoEnsino.trim() === "") {
    instituicaoEnsino = prompt("A instituição de ensino não pode ser vazia. Digite a instituição de ensino:");
  }

  senhaPadrao = prompt("Defina a senha para encerrar o evento:");
  while (senhaPadrao === null || senhaPadrao.trim() === "") {
    senhaPadrao = prompt("A senha não pode ser vazia. Defina a senha para encerrar o evento:");
  }

  const logoAvaliacao = document.querySelector('#avaliacao #logo');
  logoAvaliacao.src = urlImagemCarregada;
  

  avaliacaoDiv.style.display = 'block';
  container.style.display = 'none';
});

opcoesBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const avaliacao = btn.dataset.avaliacao;
    const data = new Date();
    avaliacoes.push({
      nomeEvento: nomeEvento,
      responsavelEvento: responsavelEvento, 
      instituicaoEnsino: instituicaoEnsino,
      dataEvento: data.toLocaleDateString(),
      horaResposta: data.toLocaleTimeString(),
      avaliacao: avaliacao
    });

    mensagemDiv.style.display = 'block';
    setTimeout(() => {
      mensagemDiv.style.display = 'none';
      avaliacaoDiv.style.display = 'block';
    }, 2000);
  });
});

fullscreenBtn.addEventListener('click', () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    document.documentElement.requestFullscreen();
  }
});

encerrarBtn.addEventListener('click', () => {
  const senhaDigitada = prompt("Digite a senha para encerrar o evento:");

  if (senhaDigitada === senhaPadrao) {
    if (confirm("Deseja realmente encerrar a avaliação do evento?")) {
      downloadCSV(avaliacoes);
      avaliacaoDiv.style.display = 'none';
      container.style.display = 'block';
      avaliacoes = [];
      senhaPadrao = "";
      nomeEvento = ""; 
      nomeEventoInput.value = ""; 
      responsavelEvento = "";
      responsavelEventoInput.value = "";
      instituicaoEnsino = "";
      instituicaoEnsinoInput.value = "";

      // Limpar a imagem do localStorage
      localStorage.removeItem('logoEvento'); 
      console.log("Imagem removida do localStorage:", !localStorage.getItem('logoEvento')); // Verificar se a chave foi removida
        }
        // Redefinir o src da imagem para o padrão
      const logoImg = document.getElementById('logo');
      logoImg.src = "logo-ufms.png"; // Substitua pelo caminho da sua imagem inicial




  } else {
    alert("Senha incorreta. O evento não foi encerrado.");
  }
});

function downloadCSV(avaliacoes) {
  const csvContent = "data:text/csv;charset=utf-8," 
    + "Nome do Evento,Responsável pelo Evento,Instituição de Ensino,Data do evento,Hora da resposta,Avaliação realizada\n" 
    + avaliacoes.map(item => 
      `${item.nomeEvento},${item.responsavelEvento},${item.instituicaoEnsino},${item.dataEvento},${item.horaResposta},${item.avaliacao}`).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "avaliacoes_evento.csv");
  document.body.appendChild(link);
  link.click();
}

uploadImagemInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    const logoImg = document.getElementById('logo'); // Obter a referência da imagem
    logoImg.src = e.target.result;
    urlImagemCarregada = e.target.result; // Armazenar a URL da imagem

    // Salvar a imagem no localStorage
    localStorage.setItem('logoEvento', e.target.result);
  }

  if (file) {
    reader.readAsDataURL(file);
  }
});