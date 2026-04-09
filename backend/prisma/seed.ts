import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/** Mesmas credenciais em `frontend/src/config/demoAccounts.ts` (apenas demonstração). */
const DEMO_PASSWORD = "DemoEstante!24";
const DEMO_FREE_EMAIL = "demo.free@estante.plus";
const DEMO_PLUS_EMAIL = "demo.plus@estante.plus";

/** Fotos de livros/biblioteca no Unsplash (licença Unsplash — uso editorial/portfólio). Não são capas oficiais das obras. */
const cover = (photoId: string) =>
  `https://images.unsplash.com/photo-${photoId}?w=500&auto=format&fit=crop&q=80`;

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
      "Um piloto cai no deserto e encontra um menino de outro planeta. Uma fábula sobre amizade, perda e o essencial invisível aos olhos.",
    isPremium: false,
    coverUrl: cover("1544947950-fa07a98d2378"),
  },
  {
    title: "1984",
    author: "George Orwell",
    synopsis:
      "Winston Smith vive sob um regime totalitário onde o Grande Irmão vigia tudo. Uma distopia que continua atual.",
    isPremium: true,
    coverUrl: cover("1512820790803-83ca734da794"),
  },
  {
    title: "Dom Casmurro",
    author: "Machado de Assis",
    synopsis:
      "Bentinho narra sua juventude e a dúvida que o consome: Capitu traiu ou não? Um clássico da literatura brasileira.",
    isPremium: false,
    coverUrl: cover("1507003211169-0a1dd7228f2d"),
  },
  {
    title: "Sapiens",
    author: "Yuval Noah Harari",
    synopsis:
      "Uma breve história da humanidade: da evolução cognitiva às revoluções agrícola e científica.",
    isPremium: true,
    coverUrl: cover("1589829085413-e567aef48d7b"),
  },
  {
    title: "A Metamorfose",
    author: "Franz Kafka",
    synopsis:
      "Gregor Samsa acorda transformado em um inseto. Uma narrativa absurda sobre alienação e família.",
    isPremium: false,
    coverUrl: cover("1519682337058-a94d519337bc"),
  },
  {
    title: "Cem Anos de Solidão",
    author: "Gabriel García Márquez",
    synopsis: "A saga da família Buendía em Macondo. Realismo mágico em estado puro.",
    isPremium: true,
    coverUrl: cover("1495446815901-a72907e66b33"),
  },
  {
    title: "O Alquimista",
    author: "Paulo Coelho",
    synopsis:
      "Santiago, pastor andaluz, segue sinais em busca de um tesouro. Uma jornada sobre ouvir o coração e os próprios sonhos.",
    isPremium: false,
    coverUrl: cover("1497633762265-9d179a990aa6"),
  },
  {
    title: "Capitães da Areia",
    author: "Jorge Amado",
    synopsis:
      "Meninos de rua em Salvador nos anos 1930: bando, lealdade e infância à margem. Um retrato vibrante da Bahia.",
    isPremium: false,
    coverUrl: cover("1524578271613-d550eacf6090"),
  },
  {
    title: "Orgulho e Preconceito",
    author: "Jane Austen",
    synopsis:
      "Elizabeth Bennet e Mr. Darcy atravessam equívocos de classe e caráter. Romance de costumes afiado e atemporal.",
    isPremium: false,
    coverUrl: cover("1526243741027-444d633d7365"),
  },
  {
    title: "O Alienista",
    author: "Machado de Assis",
    synopsis:
      "O médico Bacamarte e o experimento com o hospício de Itaguaí. Humor mordaz sobre ciência, loucura e poder.",
    isPremium: false,
    coverUrl: cover("1544716278-ca5e3f661abd"),
  },
  {
    title: "A Hora da Estrela",
    author: "Clarice Lispector",
    synopsis:
      "Macabéa, datilógrafa no Rio, entre melancolia e resistência. Prosa lírica sobre existência frágil e linguagem.",
    isPremium: false,
    coverUrl: cover("1516979187457-637abb4f9353"),
  },
  {
    title: "O Morro dos Ventos Uivantes",
    author: "Emily Brontë",
    synopsis:
      "Paixão destrutiva em charnecas inglesas: Cathy, Heathcliff e uma casa marcada por ódio e desejo.",
    isPremium: false,
    coverUrl: cover("1507842217343-583bb7270b66"),
  },
  {
    title: "Memórias Póstumas de Brás Cubas",
    author: "Machado de Assis",
    synopsis:
      "Um defunto autor conta sua vida com ironia. Marco do realismo brasileiro e da narrativa não linear.",
    isPremium: false,
    coverUrl: cover("1532012197267-da84d127e765"),
  },
  {
    title: "O Cortiço",
    author: "Aluísio Azevedo",
    synopsis:
      "Naturalismo no Rio do século XIX: cortiço, miséria e instintos. Retrato social de uma cidade em transformação.",
    isPremium: false,
    coverUrl: cover("1521587760476-6c12a4b04090"),
  },
  {
    title: "Grande Sertão: Veredas",
    author: "João Guimarães Rosa",
    synopsis:
      "Riobaldo e o banditismo no sertão, em prosa densa e inventiva. Obra-prima da língua e do território brasileiro.",
    isPremium: true,
    coverUrl: cover("1482192596544-9eb754e6659d"),
  },
  {
    title: "A Revolução dos Bichos",
    author: "George Orwell",
    synopsis:
      "Fazenda onde animais expulsam humanos e o poder corrói ideais. Fábula política em chave satírica.",
    isPremium: true,
    coverUrl: cover("1516976432424-e27bca5f97b3"),
  },
  {
    title: "O Senhor dos Anéis",
    author: "J.R.R. Tolkien",
    synopsis:
      "Frodo e a Comunidade enfrentam Sauron pela Terra-média. Épico fundacional da fantasia moderna.",
    isPremium: true,
    coverUrl: cover("1592496431122-2349e0fbc311"),
  },
  {
    title: "Duna",
    author: "Frank Herbert",
    synopsis:
      "Paul Atreides em Arrakis: especiaria, ecologia política e destino. Sci-fi de mundo aberto e denso.",
    isPremium: true,
    coverUrl: cover("1451187580459-43490279c0fa"),
  },
  {
    title: "O Poder do Hábito",
    author: "Charles Duhigg",
    synopsis:
      "Como rotinas se formam no cérebro e na empresa — e como mudá-las. Não ficção acessível sobre comportamento.",
    isPremium: true,
    coverUrl: cover("1555252333-9f8e92e65df9"),
  },
  {
    title: "Mindset",
    author: "Carol S. Dweck",
    synopsis:
      "Mentalidade fixa versus de crescimento: impacto em aprendizado, trabalho e relações. Base em pesquisa psicológica.",
    isPremium: true,
    coverUrl: cover("1524995997946-a1c2e315a42f"),
  },
  {
    title: "O Nome da Rosa",
    author: "Umberto Eco",
    synopsis:
      "Frei Guilherme investiga mortes em um mosteiro medieval. Romance histórico, teológico e de enigma.",
    isPremium: true,
    coverUrl: cover("1509021436665-8f07dbf5bf1e"),
  },
  {
    title: "A Arte da Guerra",
    author: "Sun Tzu",
    synopsis:
      "Estratégia, engano e liderança em trechos concisos. Clássico chinês relido em negócios e vida.",
    isPremium: true,
    coverUrl: cover("1526498460520-4c246339dccb"),
  },
  {
    title: "O Homem Mais Rico da Babilônia",
    author: "George S. Clason",
    synopsis:
      "Parábolas sobre poupar, investir e evitar dívidas. Educação financeira em linguagem de contos orientais.",
    isPremium: true,
    coverUrl: cover("1554224155-6726b3ff858f"),
  },
  {
    title: "O Caçador de Pipas",
    author: "Khaled Hosseini",
    synopsis:
      "Amir e Hassan no Cabul pré-guerra: culpa, redenção e exílio. Drama familiar contra o pano de fundo do Afeganistão.",
    isPremium: true,
    coverUrl: cover("1519681393784-d120267933ba"),
  },
  {
    title: "A Culpa é das Estrelas",
    author: "John Green",
    synopsis:
      "Hazel e Gus, adolescentes com câncer, entre ironia e ternura. Romance contemporâneo sobre tempo e vínculo.",
    isPremium: false,
    coverUrl: cover("1513001900724-44d1ea45115f"),
  },
  {
    title: "O Hobbit",
    author: "J.R.R. Tolkien",
    synopsis:
      "Bilbo Bolseiro, Gandalf e os anões rumo à Montanha Solitária. Aventura que antecede o grande épico.",
    isPremium: true,
    coverUrl: cover("1518709268805-4e9042af9f23"),
  },
  {
    title: "Fundação",
    author: "Isaac Asimov",
    synopsis:
      "Psicohistória e império galáctico em declínio. Ciclo que moldou a ficção científica clássica.",
    isPremium: true,
    coverUrl: cover("1446776653964-20c1d3a81b06"),
  },
  {
    title: "O Conto da Aia",
    author: "Margaret Atwood",
    synopsis:
      "Gilead: regime teocrático e corpos femininos como recurso de Estado. Distopia feminista e perturbadora.",
    isPremium: true,
    coverUrl: cover("1456513080510-7bf3a84b82f8"),
  },
  {
    title: "O Velho e o Mar",
    author: "Ernest Hemingway",
    synopsis:
      "Santiago, o pescador cubano, e o marlins. Prosa enxuta sobre resistência, dignidade e derrota honrosa.",
    isPremium: false,
    coverUrl: cover("1439405326854-014607f0d800"),
  },
  {
    title: "A Insustentável Leveza do Ser",
    author: "Milan Kundera",
    synopsis:
      "Tomas, Tereza e Sabina entre Praga e o exílio. Romance filosófico sobre peso, liberdade e coincidência.",
    isPremium: true,
    coverUrl: cover("1481627834876-b7833e8f5570"),
  },
  {
    title: "Iracema",
    author: "José de Alencar",
    synopsis:
      "Lenda de amor entre índia e português no Ceará colonial. Romance indianista e símbolo nacional.",
    isPremium: false,
    coverUrl: cover("1463320726281-d696936d3b38"),
  },
  {
    title: "O Diário de Anne Frank",
    author: "Anne Frank",
    synopsis:
      "A adolescente escondida em Amsterdã durante o nazismo. Testemunho íntimo e humano da Segunda Guerra.",
    isPremium: false,
    coverUrl: cover("1524997990755-06641f58dc7c"),
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

  for (const row of booksData) {
    await prisma.book.create({ data: row });
  }

  console.log("Seed OK: usuários demo (FREE + PLUS) e catálogo de livros.");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
