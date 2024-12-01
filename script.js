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
const mensagemEvento = document.querySelector('#avaliacao h2'); 
const logoOriginal = "imagens/ufms.png";



let avaliacoes = [];
let senhaPadrao = "";
let nomeEvento = "";
let responsavelEvento = "";
let instituicaoEnsino = "";
let urlImagemCarregada = ""; // Variável para armazenar a URL da imagem

// Carregar a imagem do localStorage ao iniciar a aplicação
const logoSalvo = localStorage.getItem('logoEvento');
if (logoSalvo) {
  logoImg.src = logoSalvo;
}

// Armazenar a referência do logo na div#avaliacao
const logoAvaliacao = document.querySelector('#avaliacao #logo');


iniciarBtn.addEventListener('click', () => {
  nomeEvento = nomeEventoInput.value.trim();
  while (nomeEvento === null || nomeEvento === "") {
    nomeEvento = prompt("O nome do evento não pode ser vazio. Digite o nome do evento:");
  }

  responsavelEvento = responsavelEventoInput.value.trim();
  while (responsavelEvento === null || responsavelEvento === "") {
    responsavelEvento = prompt("O nome do responsável não pode ser vazio. Digite o nome do responsável:");
  }

  instituicaoEnsino = instituicaoEnsinoInput.value.trim();
  while (instituicaoEnsino === null || instituicaoEnsino === "") {
    instituicaoEnsino = prompt("A instituição de ensino não pode ser vazia. Digite a instituição de ensino:");
  }

  senhaPadrao = prompt("Defina a senha para encerrar o evento:");
  while (senhaPadrao === null || senhaPadrao.trim() === "") {
    senhaPadrao = prompt("A senha não pode ser vazia. Defina a senha para encerrar o evento:");
  }

  // Usar a referência armazenada
  logoAvaliacao.src = urlImagemCarregada;
  mensagemEvento.textContent = `Deixe a sua avaliação para o evento ${nomeEvento}`; 


  avaliacaoDiv.style.display = '';
  container.style.display = 'none';
});

opcoesBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const avaliacao = btn.dataset.avaliacao;
    const data = new Date();
    avaliacoes.push({
      responsavelEvento: responsavelEvento,
      instituicaoEnsino: instituicaoEnsino,
      dataEvento: data.toLocaleDateString(),
      horaResposta: data.toLocaleTimeString(),
      avaliacao: avaliacao
    });

    mensagemDiv.style.display = 'block';
    setTimeout(() => {
      mensagemDiv.style.display = 'none';
      avaliacaoDiv.style.display = 'flex';
    }, 2000);
  });
});

fullscreenBtn.addEventListener('click', () => {
  try {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  } catch (error) {
    console.error("Erro ao ativar o modo de tela cheia:", error);
    alert("O modo de tela cheia não é suportado neste dispositivo.");
  }
});

encerrarBtn.addEventListener('click', () => {
  const senhaDigitada = prompt("Digite a senha para encerrar o evento:");

  if (senhaDigitada === senhaPadrao) {
    if (confirm("Deseja realmente encerrar a avaliação do evento?")) {
      downloadCSV(avaliacoes);
      container.style.display = 'flex';
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
    }
    avaliacaoDiv.style.display = 'none';
    logoImg.src = logoOriginal;
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
  //Utilizar o nome do evento para o nome do arquivo
  const nomeArquivo = `${nomeEvento}.csv`; 
  link.setAttribute("download", nomeArquivo); 
  
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

