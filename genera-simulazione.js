// genera-simulazione.js
const fs = require('fs');

// Carica i dati del quiz
const quizData = JSON.parse(fs.readFileSync('quiz.json', 'utf8'));

// Configurazione simulazione
const config = {
  categorieRichieste: [
    "Geografia",
    "Normativa Statale e Regionale",
    "Regolamento e Comportamento",
    {
      nome: "Lingua",
      scelta: ["Inglese", "Francese", "Spagnolo", "Tedesco"]
    }
  ],
  numeroDomandePerCategoria: 4,
  maxErroriTotali: 4,
  maxErroriPerCategoria: 2
};

// Funzione per selezionare domande casuali per una categoria
function selezionaDomandeCategoria(categoria, numeroDomande) {
  // Filtra le domande per la categoria specificata
  const domandeFiltrate = quizData.domande.filter(domanda => domanda.categoria === categoria);
  
  // Mescola le domande
  const domandeMessolate = [...domandeFiltrate].sort(() => Math.random() - 0.5);
  
  // Prendi solo il numero richiesto di domande
  return domandeMessolate.slice(0, numeroDomande);
}

// Verifica quante domande ci sono per ciascuna categoria
function contaDomandePerCategoria() {
  const conteggio = {};
  
  quizData.domande.forEach(domanda => {
    if (!conteggio[domanda.categoria]) {
      conteggio[domanda.categoria] = 0;
    }
    conteggio[domanda.categoria]++;
  });
  
  return conteggio;
}

// Stampa statistiche delle domande
function stampaStatistiche() {
  const conteggio = contaDomandePerCategoria();
  console.log("\nStatistiche domande per categoria:");
  
  Object.entries(conteggio)
    .sort((a, b) => b[1] - a[1])
    .forEach(([categoria, numero]) => {
      console.log(`- ${categoria}: ${numero} domande`);
    });
  
  console.log("\nCategorie principali richieste per l'esame:");
  config.categorieRichieste.forEach(cat => {
    if (typeof cat === 'string') {
      console.log(`- ${cat}`);
    } else if (cat.nome === 'Lingua') {
      console.log(`- ${cat.nome} (opzioni: ${cat.scelta.join(', ')})`);
    }
  });
}

// Genera un esempio di simulazione d'esame con inglese come lingua
function generaEsempioSimulazione(lingua = "Inglese") {
  console.log(`\nGenerazione esempio simulazione con lingua: ${lingua}`);
  
  const domandeSelezionate = [];
  
  // Per ogni categoria richiesta
  config.categorieRichieste.forEach(categoria => {
    let nomeCategoria = typeof categoria === 'string' ? categoria : null;
    
    // Gestisci la categoria lingua
    if (typeof categoria === 'object' && categoria.nome === 'Lingua') {
      nomeCategoria = lingua;
    }
    
    if (nomeCategoria) {
      // Seleziona le domande per questa categoria
      const domande = selezionaDomandeCategoria(nomeCategoria, config.numeroDomandePerCategoria);
      domandeSelezionate.push(...domande);
      
      console.log(`- Selezionate ${domande.length} domande per ${nomeCategoria}`);
    }
  });
  
  // Mescola le domande selezionate
  const domandeMessolate = [...domandeSelezionate].sort(() => Math.random() - 0.5);
  
  console.log(`Totale: ${domandeMessolate.length} domande per la simulazione`);
  
  // Opzionale: salva la simulazione in un file JSON
  // fs.writeFileSync('simulazione-esempio.json', JSON.stringify(domandeMessolate, null, 2));
  
  return domandeMessolate;
}

// Esegui il programma
stampaStatistiche();
const simulazioneEsempio = generaEsempioSimulazione();

// Mostra alcune domande di esempio
console.log("\nPrime 3 domande di esempio nella simulazione:");
simulazioneEsempio.slice(0, 3).forEach((domanda, index) => {
  console.log(`\nDomanda ${index + 1} (${domanda.categoria}):`);
  console.log(`- ${domanda.testo}`);
  console.log("  Opzioni:");
  domanda.opzioni.forEach((opzione, i) => {
    console.log(`  ${i + 1}. ${opzione}${i === domanda.risposta_corretta ? ' (corretta)' : ''}`);
  });
});
