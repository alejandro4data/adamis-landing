// data/frases.js
// Frases por idioma para la actividad de snake.
window.FRASES_BY_LANG = {
  es: [
    'Gasta menos de lo que ganas',
    'Ahorra primero gasta despues',
    'Tu fondo de emergencia es tu escudo',
    'Evita las deudas caras',
    'Cada moneda cuenta',
    'Invertir es un maraton no un sprint'
  ],
  en: [
    'Spend less than you earn',
    'Save first spend later',
    'Your emergency fund is your shield',
    'Avoid expensive debt',
    'Every coin counts',
    'Investing is a marathon not a sprint'
  ],
  fr: [
    'Depense moins que tu ne gagnes',
    'Epargne d abord depense ensuite',
    'Ton fonds d urgence est ton bouclier',
    'Evite les dettes couteuses',
    'Chaque piece compte',
    'Investir est un marathon pas un sprint'
  ],
  de: [
    'Gib weniger aus als du verdienst',
    'Spare zuerst gib danach aus',
    'Dein Notfallfonds ist dein Schutz',
    'Vermeide teure Schulden',
    'Jede Muenze zaehlt',
    'Investieren ist ein Marathon kein Sprint'
  ],
  it: [
    'Spendi meno di quanto guadagni',
    'Risparmia prima spendi dopo',
    'Il tuo fondo di emergenza e il tuo scudo',
    'Evita i debiti costosi',
    'Ogni moneta conta',
    'Investire e una maratona non uno sprint'
  ],
  pt: [
    'Gasta menos do que ganhas',
    'Poupa primeiro gasta depois',
    'O teu fundo de emergencia e o teu escudo',
    'Evita dividas caras',
    'Cada moeda conta',
    'Investir e uma maratona nao um sprint'
  ],
  ca: [
    'Gasta menys del que guanyes',
    'Estalvia primer gasta despres',
    'El teu fons d emergencia es el teu escut',
    'Evita els deutes cars',
    'Cada moneda compta',
    'Invertir es una marato no un esprint'
  ],
  va: [
    'Gasta menys del que guanyes',
    'Estalvia primer gasta despres',
    'El teu fons d emergencia es el teu escut',
    'Evita els deutes cars',
    'Cada moneda compta',
    'Invertir es una marato no un esprint'
  ],
  gl: [
    'Gasta menos do que gañas',
    'Aforra primeiro gasta despois',
    'O teu fondo de emerxencia e o teu escudo',
    'Evita as debedas caras',
    'Cada moeda conta',
    'Investir e unha maraton non un sprint'
  ],
  eu: [
    'Gastatu irabazten duzuna baino gutxiago',
    'Lehenik aurreztu gero gastatu',
    'Zure larrialdi funtsa zure babesa da',
    'Saihestu zor garestiak',
    'Txanpon bakoitzak balio du',
    'Inbertitzea maratoia da ez esprinta'
  ]
};

// Backward compatibility
window.FRASES = window.FRASES_BY_LANG.es.slice();
