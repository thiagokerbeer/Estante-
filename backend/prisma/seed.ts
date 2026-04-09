import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/** Mesmas credenciais em `frontend/src/config/demoAccounts.ts` (apenas demonstração). */
const DEMO_PASSWORD = "DemoEstante!24";
const DEMO_FREE_EMAIL = "demo.free@estante.plus";
const DEMO_PLUS_EMAIL = "demo.plus@estante.plus";

/** Capa real via Open Library Covers API (gratuita, sem chave). */
const olCover = (isbn: string) =>
  `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;

type SeedBook = {
  title: string;
  author: string;
  synopsis: string;
  isPremium: boolean;
  coverUrl: string;
};

const booksData: SeedBook[] = [
  {
    title: "O Pequeno Príncipe",
    author: "Antoine de Saint-Exupéry",
    synopsis:
      "Um aviador que cai no deserto do Saara encontra um menino misterioso vindo de um asteroide distante. Através dos olhares desse pequeno príncipe — que já visitou outros planetas e seus habitantes absurdos —, Saint-Exupéry tece uma fábula poética sobre amizade, amor, perda e os valores que os adultos esquecem ao crescer. Publicado em 1943, tornou-se um dos livros mais vendidos e traduzidos da história, com a célebre frase: \"O essencial é invisível aos olhos.\"",
    isPremium: false,
    coverUrl: olCover("9780156012195"),
  },
  {
    title: "1984",
    author: "George Orwell",
    synopsis:
      "Na Oceania de 1984, o Partido controla tudo: a história, a língua e até o pensamento. Winston Smith, funcionário do Ministério da Verdade, reescreve registros do passado por ordem do Grande Irmão — mas guarda em segredo um diário proibido e um desejo de rebelião. Ao se apaixonar por Julia e entrar em contato com a suposta resistência, ele mergulha em uma conspiração que desafia os limites do que a mente humana pode suportar. Uma das distopias mais influentes já escritas, profética e perturbadoramente atual.",
    isPremium: true,
    coverUrl: olCover("9780451524935"),
  },
  {
    title: "Dom Casmurro",
    author: "Machado de Assis",
    synopsis:
      "Bentinho, apelidado Dom Casmurro pelos vizinhos, narra em retrospecto a história de seu grande amor por Capitu — a menina dos \"olhos de ressaca\" — desde a adolescência até o casamento e a ruptura que o marcou para sempre. Será que Capitu o traiu com seu melhor amigo, Escobar? Machado de Assis construiu o romance mais debatido da literatura brasileira: um narrador não confiável, uma acusação sem prova definitiva e uma ambiguidade que instiga leitores há mais de um século.",
    isPremium: false,
    coverUrl: olCover("9780195102680"),
  },
  {
    title: "Sapiens",
    author: "Yuval Noah Harari",
    synopsis:
      "Como o Homo sapiens passou de animal insignificante nas savanas africanas a senhor absoluto do planeta? Yuval Noah Harari percorre 70 mil anos de história humana — da Revolução Cognitiva à Revolução Científica — para mostrar como mitos compartilhados, dinheiro, impérios e religiões permitiram a cooperação em massa que nos tornou tão poderosos. Uma obra elogiada por Barack Obama, Bill Gates e Bill Clinton que desafia tudo o que achamos saber sobre nós mesmos e sobre o futuro da espécie.",
    isPremium: true,
    coverUrl: olCover("9780062316097"),
  },
  {
    title: "A Metamorfose",
    author: "Franz Kafka",
    synopsis:
      "Gregor Samsa acorda uma manhã transformado em um monstruoso inseto. Caixeiro-viajante que sustentava a família, ele passa a ser tratado com repulsa e vergonha pelos próprios pais e pela irmã que tanto amava. A novela mais célebre de Kafka é uma meditação sobre alienação, identidade e a fragilidade dos laços afetivos quando a utilidade de alguém desaparece. Escrita em 1915, continua sendo uma das obras mais analisadas e adaptadas da literatura universal.",
    isPremium: false,
    coverUrl: olCover("9780486290300"),
  },
  {
    title: "Cem Anos de Solidão",
    author: "Gabriel García Márquez",
    synopsis:
      "A saga de sete gerações da família Buendía na cidade imaginária de Macondo, fundada no meio da selva por José Arcadio Buendía. Entre guerras civis, amores impossíveis, pragas de insônia e chuvas de flores amarelas, García Márquez ergueu o maior monumento do realismo mágico latino-americano. Vencedor do Nobel de Literatura, o romance foi descrito pelo The New York Times como \"obra-prima que deveria ser leitura obrigatória para toda a raça humana\".",
    isPremium: true,
    coverUrl: olCover("9780060883287"),
  },
  {
    title: "O Alquimista",
    author: "Paulo Coelho",
    synopsis:
      "Santiago, jovem pastor andaluz, sonha repetidamente com um tesouro escondido perto das Pirâmides do Egito. Ao buscar a realização de sua Lenda Pessoal, ele atravessa o deserto do Saara, aprende a linguagem do mundo e encontra professores que transformam sua visão da vida. Publicado em 1988 e traduzido para mais de 80 idiomas, O Alquimista é um dos livros mais vendidos de todos os tempos — uma parábola espiritual sobre coragem, amor e a arte de ouvir o coração.",
    isPremium: false,
    coverUrl: olCover("9780062315007"),
  },
  {
    title: "Capitães da Areia",
    author: "Jorge Amado",
    synopsis:
      "Salvador, anos 1930. Um bando de meninos abandonados — os Capitães da Areia — vive nos trapicheiros à beira do mar, sobrevivendo de furtos e traquinagens sob a liderança de Pedro Bala. Jorge Amado retrata com calor e indignação a infância roubada, a cumplicidade nascida da miséria e a Bahia vibrante de candomblé, capoeira e luta por dignidade. Um romance que mistura denúncia social e ternura, considerado um dos mais importantes da literatura brasileira do século XX.",
    isPremium: false,
    coverUrl: olCover("9788535919783"),
  },
  {
    title: "Orgulho e Preconceito",
    author: "Jane Austen",
    synopsis:
      "Elizabeth Bennet é a segunda das cinco filhas de uma família da gentry inglesa — inteligente, perspicaz e determinada a não se casar por conveniência. Quando o rico e altivo Mr. Darcy entra em sua vida, o choque entre o orgulho dele e o preconceito dela dá início a um dos romances mais encantadores da literatura. Publicado em 1813, o livro de Jane Austen é uma comédia de costumes finamente afiada que continua conquistando leitores ao redor do mundo mais de dois séculos depois.",
    isPremium: false,
    coverUrl: olCover("9780141439518"),
  },
  {
    title: "O Alienista",
    author: "Machado de Assis",
    synopsis:
      "O doutor Simão Bacamarte chega a Itaguaí decidido a fundar a Casa Verde, o maior hospício do Brasil, para estudar e curar a loucura com método científico rigoroso. À medida que os critérios de internação se ampliam, metade da cidade acaba confinada — até que Bacamarte volta seu diagnóstico para si mesmo. Um dos mais brilhantes contos de Machado de Assis, mistura humor corrosivo, sátira política e uma perturbadora reflexão sobre os limites entre razão e loucura.",
    isPremium: false,
    coverUrl: olCover("9780195102680"),
  },
  {
    title: "A Hora da Estrela",
    author: "Clarice Lispector",
    synopsis:
      "Macabéa é uma jovem nordestina, datilógrafa no Rio de Janeiro, que mal come, mal se veste e quase não existe para o mundo. O narrador Rodrigo S.M. — alter ego de Lispector — debate-se com a responsabilidade de contar uma vida tão frágil. Último romance publicado em vida pela autora, em 1977, A Hora da Estrela é ao mesmo tempo uma obra sobre invisibilidade social, sobre a dificuldade de narrar o outro e sobre a linguagem como único território de salvação.",
    isPremium: false,
    coverUrl: olCover("9780811214483"),
  },
  {
    title: "O Morro dos Ventos Uivantes",
    author: "Emily Brontë",
    synopsis:
      "Nas charnecas do Yorkshire, Heathcliff — um órfão misterioso trazido pelo Sr. Earnshaw — cresce ao lado de Catherine, por quem nutre uma paixão absoluta e destrutiva. Separados pelas circunstâncias e pela ambição social, os dois deixam uma trilha de ódio, vingança e amor que atravessa gerações. Único romance de Emily Brontë, publicado em 1847, é uma das histórias de paixão mais intensas e perturbadoras da literatura, com uma paisagem selvagem que espelha cada emoção dos personagens.",
    isPremium: false,
    coverUrl: olCover("9780141439556"),
  },
  {
    title: "Memórias Póstumas de Brás Cubas",
    author: "Machado de Assis",
    synopsis:
      "\"Ao verme que primeiro roeu as frias carnes do meu cadáver dedico com saudosa lembrança estas Memórias Póstumas.\" Brás Cubas escreve suas memórias do além-túmulo, narrando com ironia e descaso uma vida de mediocridades, amores adulterinos e vaidades não realizadas. Publicado em 1881, o romance inaugura o Realismo brasileiro e revoluciona a narrativa com capítulos curtos, digressões filosóficas e um narrador que desafia o leitor a cada página — uma das obras mais ousadas da literatura em língua portuguesa.",
    isPremium: false,
    coverUrl: olCover("9780195097146"),
  },
  {
    title: "O Cortiço",
    author: "Aluísio Azevedo",
    synopsis:
      "No Rio de Janeiro do século XIX, João Romão constrói seu império de exploração a partir de um cortiço onde vivem amontoadas dezenas de famílias de imigrantes, lavadeiras e operários. Aluísio Azevedo aplica o determinismo naturalista para retratar como o meio transforma os indivíduos, as relações de poder entre colonizadores e colonizados, e a desumanização imposta pela miséria. Publicado em 1890, é o principal romance naturalista brasileiro e uma leitura indispensável sobre a formação social do país.",
    isPremium: false,
    coverUrl: olCover("9780195102673"),
  },
  {
    title: "Grande Sertão: Veredas",
    author: "João Guimarães Rosa",
    synopsis:
      "Riobaldo, ex-jagunço do sertão mineiro, narra sua vida de violência, lealdade e amor proibido ao longo de um monólogo ininterrupto dirigido a um interlocutor silencioso. No centro de tudo, a dúvida que o consome: teria feito um pacto com o diabo? E o que sente por Diadorim, o companheiro de armas que guarda um segredo? Publicado em 1956, Grande Sertão: Veredas é considerado o maior romance brasileiro do século XX — uma reinvenção radical da língua portuguesa e um labirinto filosófico sem igual.",
    isPremium: true,
    coverUrl: olCover("9780394441481"),
  },
  {
    title: "A Revolução dos Bichos",
    author: "George Orwell",
    synopsis:
      "Na Granja Manor, os animais se rebelam contra o fazendeiro Mr. Jones e estabelecem uma república igualitária guiada pelo lema \"Todos os animais são iguais\". Mas à medida que os porcos assumem o controle, os princípios da revolução vão sendo distorcidos até o amargo: \"Todos os animais são iguais, mas alguns animais são mais iguais do que outros.\" Publicada em 1945, a fábula de Orwell é uma sátira implacável ao totalitarismo e à corrupção do poder — atualíssima décadas depois.",
    isPremium: true,
    coverUrl: olCover("9780452284241"),
  },
  {
    title: "O Senhor dos Anéis",
    author: "J.R.R. Tolkien",
    synopsis:
      "O hobbit Frodo Bolseiro herda do tio Bilbo um anel que se revela o Um Anel forjado pelo Senhor das Trevas Sauron para dominar todos os povos da Terra-média. Acompanhado por uma improvável Sociedade do Anel — hobbits, elfos, anões, humanos e um mago —, Frodo parte em uma jornada épica até as Fauces do Destino para destruir o anel para sempre. Publicada entre 1954 e 1955, a trilogia de Tolkien definiu o gênero fantasia e criou um mundo mítico de riqueza sem precedentes.",
    isPremium: true,
    coverUrl: olCover("9780618640157"),
  },
  {
    title: "Duna",
    author: "Frank Herbert",
    synopsis:
      "O jovem Paul Atreides chega ao planeta deserto Arrakis — único lugar no universo onde se produz a Especiaria, a substância mais valiosa da galáxia. Quando sua família é traída e destruída, Paul foge para o deserto e se une aos Fremen, povo indígena que o reconhece como profeta. Frank Herbert construiu em Duna (1965) um universo de ecologia, política, religião e poder que influenciou toda a ficção científica posterior. Eleito o best-seller de ficção científica de todos os tempos.",
    isPremium: true,
    coverUrl: olCover("9780441013593"),
  },
  {
    title: "O Poder do Hábito",
    author: "Charles Duhigg",
    synopsis:
      "Por que fazemos o que fazemos na vida e nos negócios? O jornalista Charles Duhigg explora a neurociência por trás dos hábitos — o ciclo de gatilho, rotina e recompensa que governa nosso comportamento sem que percebamos. Com histórias que vão de atletas olímpicos a empresas como a Starbucks, e da batalha contra o alcoolismo à campanha de Barack Obama, o livro mostra como identificar e transformar padrões que parecem automáticos — e como isso muda vidas, empresas e sociedades.",
    isPremium: true,
    coverUrl: olCover("9780812981605"),
  },
  {
    title: "Mindset",
    author: "Carol S. Dweck",
    synopsis:
      "A psicóloga de Stanford Carol S. Dweck apresenta décadas de pesquisa sobre uma descoberta simples e transformadora: o poder da nossa mentalidade. Pessoas com mentalidade fixa acreditam que talentos são inatos e evitam desafios que possam revelar limitações. Pessoas com mentalidade de crescimento entendem que habilidades se desenvolvem com esforço — e por isso prosperam diante dos obstáculos. Um livro fundamental sobre aprendizado, resiliência e o verdadeiro potencial humano.",
    isPremium: true,
    coverUrl: olCover("9780345472328"),
  },
  {
    title: "O Nome da Rosa",
    author: "Umberto Eco",
    synopsis:
      "O frade franciscano Guilherme de Baskerville e seu novato Adso chegam a uma abadia beneditina no norte da Itália em 1327 para participar de um conclave teológico. Mas uma série de mortes misteriosas transforma a visita em uma investigação que leva aos labirintos proibidos da biblioteca monástica. Umberto Eco — semiólogo, medievalista e escritor de gênio — criou em seu romance de estreia (1980) um thriller intelectual que é ao mesmo tempo homenagem ao romance policial, à Idade Média e ao poder perigoso do conhecimento.",
    isPremium: true,
    coverUrl: olCover("9780156001311"),
  },
  {
    title: "A Arte da Guerra",
    author: "Sun Tzu",
    synopsis:
      "Escrito há mais de 2.500 anos pelo general chinês Sun Tzu, este tratado em treze capítulos continua sendo o manual de estratégia mais estudado do mundo. Em aforismos concisos sobre planejamento, adaptação, engano e liderança, Sun Tzu ensina que a vitória definitiva se conquista antes da batalha — conhecendo-se a si mesmo e ao adversário. Relido por generais, CEOs, diplomatas e esportistas, A Arte da Guerra permanece um guia universal sobre como vencer sem desperdiçar recursos.",
    isPremium: true,
    coverUrl: olCover("9780140439199"),
  },
  {
    title: "O Homem Mais Rico da Babilônia",
    author: "George S. Clason",
    synopsis:
      "Na Babilônia antiga, o rico Arkad revela os segredos de sua fortuna a amigos e discípulos através de parábolas simples e duradouras: pague-se primeiro, faça seu dinheiro trabalhar, proteja-se de perdas. Publicado originalmente como panfletos bancários nos anos 1920, o livro de George S. Clason tornou-se um clássico atemporal da educação financeira — leitura obrigatória para quem deseja construir riqueza com disciplina e sabedoria.",
    isPremium: true,
    coverUrl: olCover("9780451205360"),
  },
  {
    title: "O Caçador de Pipas",
    author: "Khaled Hosseini",
    synopsis:
      "Cabul, anos 1970. Amir, filho de um ricaço pachtum, e Hassan, seu servo hazara e melhor amigo, passam os dias soltando pipas pelas ruas da cidade. Um ato de covardia de Amir durante um inverno muda suas vidas para sempre. Décadas depois, já nos Estados Unidos, Amir recebe uma ligação do Afeganistão que lhe dá uma última chance de redimir o passado. O romance de estreia de Khaled Hosseini (2003) vendeu mais de 38 milhões de cópias e revelou ao mundo a humanidade por trás de um país devastado pela guerra.",
    isPremium: true,
    coverUrl: olCover("9781594631931"),
  },
  {
    title: "A Culpa é das Estrelas",
    author: "John Green",
    synopsis:
      "Hazel Grace Lancaster tem 16 anos, câncer no pulmão e um oxigênio que carrega a tiracolo. Em um grupo de apoio, ela conhece Augustus Waters — charmoso, irônico e sobrevivente de um osteossarcoma. Os dois se apaixonam, debatem livros filosóficos sobre a vida e a morte, e partem em uma viagem memorável a Amsterdã. John Green criou em 2012 um romance que faz rir e chorar com igual intensidade, e que questiona com delicadeza o que significa viver uma vida que importa.",
    isPremium: false,
    coverUrl: olCover("9780525478812"),
  },
  {
    title: "O Hobbit",
    author: "J.R.R. Tolkien",
    synopsis:
      "Bilbo Bolseiro é um hobbit confortável que nunca quis aventuras — até o dia em que o mago Gandalf e treze anões aparecem em sua porta e o recrutam para uma expedição rumo à Montanha Solitária, onde o temível dragão Smaug guarda um tesouro. Publicado em 1937, O Hobbit foi escrito por Tolkien para seus filhos e tornou-se a porta de entrada para a Terra-média. Uma aventura de crescimento, coragem e descoberta que encanta leitores de todas as idades há quase um século.",
    isPremium: true,
    coverUrl: olCover("9780547928227"),
  },
  {
    title: "Fundação",
    author: "Isaac Asimov",
    synopsis:
      "O matemático Hari Seldon desenvolve a psicohistória — ciência capaz de prever o futuro de civilizações inteiras com base em probabilidades estatísticas. Seu diagnóstico é devastador: o Império Galáctico vai colapsar em trinta mil anos de barbárie. Para reduzir esse período a mil anos, Seldon funda a Fundação, encarregada de preservar o conhecimento humano. Publicado em 1951, o primeiro volume da série que redefiniu a ficção científica é um tratado sobre ciência, poder e a possibilidade de guiar o destino da humanidade.",
    isPremium: true,
    coverUrl: olCover("9780553293357"),
  },
  {
    title: "O Conto da Aia",
    author: "Margaret Atwood",
    synopsis:
      "Na República de Gilead — um regime teocrático que tomou o lugar dos Estados Unidos —, as mulheres férteis são reduzidas à condição de Aias: propriedade do Estado, obrigadas a gerar filhos para os Comandantes. Offred, narradora, recorda a vida que tinha antes e descreve com detalhes perturbadores a nova realidade de subjugação total. Publicado em 1985, O Conto da Aia de Margaret Atwood tornou-se símbolo do feminismo contemporâneo e ganhou nova urgência a cada década que passa.",
    isPremium: true,
    coverUrl: olCover("9780385490818"),
  },
  {
    title: "O Velho e o Mar",
    author: "Ernest Hemingway",
    synopsis:
      "Santiago é um pescador cubano velho e solitário que não pesca nada há 84 dias. Em sua próxima saída ao mar aberto, ferra um imenso marlim — o maior que já viu — e entra em uma batalha épica de três dias com o animal. Premiado com o Pulitzer em 1953 e considerado pela Academia Sueca a obra que justificou o Nobel de Hemingway, o romance é uma meditação sobre derrota honrosa, dignidade humana e a beleza da luta travada com tudo o que se tem.",
    isPremium: false,
    coverUrl: olCover("9780684801223"),
  },
  {
    title: "A Insustentável Leveza do Ser",
    author: "Milan Kundera",
    synopsis:
      "Tomas é um cirurgião praguense que separa sexo de amor com matemática emocional. Tereza é a mulher que chega como acidente e o transforma. Sabina é a amante que prefere a traição à responsabilidade. Sobre todos eles paira Praga — antes e depois da invasão soviética de 1968 — e a questão filosófica central: é melhor a leveza de não se comprometer ou o peso de amar de verdade? Publicado em 1984, o romance de Kundera é uma das obras mais intelectualmente sedutoras do século XX.",
    isPremium: true,
    coverUrl: olCover("9780060932138"),
  },
  {
    title: "Iracema",
    author: "José de Alencar",
    synopsis:
      "Iracema — cujo nome é anagrama de América — é a \"virgem dos lábios de mel\", filha do pajé Araquém e guardiã do segredo do jurema. Ao encontrar o guerreiro branco Martim, ela viola o tabu sagrado por amor, desencadeando uma história de ruptura, exílio e sacrifício que resulta no nascimento de Moacir, \"o primeiro filho do sofrimento\". Publicado em 1865, o romance indianista de José de Alencar é considerado o poema fundador da identidade nacional brasileira.",
    isPremium: false,
    coverUrl: olCover("9780195072211"),
  },
  {
    title: "O Diário de Anne Frank",
    author: "Anne Frank",
    synopsis:
      "Entre julho de 1942 e agosto de 1944, Anne Frank e sua família se esconderam em um anexo secreto em Amsterdã para escapar da perseguição nazista. Nesse período, a jovem judia de 13 a 15 anos preencheu seu diário com reflexões sobre adolescência, sonhos, medos e a absurdidade da guerra. Descoberto e publicado pelo pai de Anne após o fim da guerra, O Diário de Anne Frank tornou-se um dos documentos humanos mais importantes do século XX — traduzido para mais de 70 idiomas.",
    isPremium: false,
    coverUrl: olCover("9780553296983"),
  },
];

async function main() {
  const hash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const privacyAccepted = new Date();
  const plusEnds = new Date();
  plusEnds.setFullYear(plusEnds.getFullYear() + 1);

  await prisma.user.upsert({
    where: { email: DEMO_FREE_EMAIL },
    create: {
      email: DEMO_FREE_EMAIL,
      password: hash,
      plan: "FREE",
      planEndsAt: null,
      privacyNoticeAcceptedAt: privacyAccepted,
    },
    update: {
      password: hash,
      plan: "FREE",
      planEndsAt: null,
      privacyNoticeAcceptedAt: privacyAccepted,
    },
  });

  await prisma.user.upsert({
    where: { email: DEMO_PLUS_EMAIL },
    create: {
      email: DEMO_PLUS_EMAIL,
      password: hash,
      plan: "PLUS",
      planEndsAt: plusEnds,
      privacyNoticeAcceptedAt: privacyAccepted,
    },
    update: {
      password: hash,
      plan: "PLUS",
      planEndsAt: plusEnds,
      privacyNoticeAcceptedAt: privacyAccepted,
    },
  });

  await prisma.book.deleteMany();
  const { count } = await prisma.book.createMany({ data: booksData });

  console.log(`Seed OK: usuários demo (FREE + PLUS) e ${count} livros no catálogo.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
