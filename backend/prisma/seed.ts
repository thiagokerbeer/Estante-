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
      "Um piloto cai no deserto e encontra um menino de outro planeta. Uma fábula sobre amizade, perda e o essencial invisível aos olhos.",
    isPremium: false,
    coverUrl: olCover("9780156012195"),
  },
  {
    title: "1984",
    author: "George Orwell",
    synopsis:
      "Winston Smith vive sob um regime totalitário onde o Grande Irmão vigia tudo. Uma distopia que continua atual.",
    isPremium: true,
    coverUrl: olCover("9780451524935"),
  },
  {
    title: "Dom Casmurro",
    author: "Machado de Assis",
    synopsis:
      "Bentinho narra sua juventude e a dúvida que o consome: Capitu traiu ou não? Um clássico da literatura brasileira.",
    isPremium: false,
    coverUrl: olCover("9780195102680"),
  },
  {
    title: "Sapiens",
    author: "Yuval Noah Harari",
    synopsis:
      "Uma breve história da humanidade: da evolução cognitiva às revoluções agrícola e científica.",
    isPremium: true,
    coverUrl: olCover("9780062316097"),
  },
  {
    title: "A Metamorfose",
    author: "Franz Kafka",
    synopsis:
      "Gregor Samsa acorda transformado em um inseto. Uma narrativa absurda sobre alienação e família.",
    isPremium: false,
    coverUrl: olCover("9780486290300"),
  },
  {
    title: "Cem Anos de Solidão",
    author: "Gabriel García Márquez",
    synopsis: "A saga da família Buendía em Macondo. Realismo mágico em estado puro.",
    isPremium: true,
    coverUrl: olCover("9780060883287"),
  },
  {
    title: "O Alquimista",
    author: "Paulo Coelho",
    synopsis:
      "Santiago, pastor andaluz, segue sinais em busca de um tesouro. Uma jornada sobre ouvir o coração e os próprios sonhos.",
    isPremium: false,
    coverUrl: olCover("9780062315007"),
  },
  {
    title: "Capitães da Areia",
    author: "Jorge Amado",
    synopsis:
      "Meninos de rua em Salvador nos anos 1930: bando, lealdade e infância à margem. Um retrato vibrante da Bahia.",
    isPremium: false,
    coverUrl: olCover("9788535919783"),
  },
  {
    title: "Orgulho e Preconceito",
    author: "Jane Austen",
    synopsis:
      "Elizabeth Bennet e Mr. Darcy atravessam equívocos de classe e caráter. Romance de costumes afiado e atemporal.",
    isPremium: false,
    coverUrl: olCover("9780141439518"),
  },
  {
    title: "O Alienista",
    author: "Machado de Assis",
    synopsis:
      "O médico Bacamarte e o experimento com o hospício de Itaguaí. Humor mordaz sobre ciência, loucura e poder.",
    isPremium: false,
    coverUrl: olCover("9780195102680"),
  },
  {
    title: "A Hora da Estrela",
    author: "Clarice Lispector",
    synopsis:
      "Macabéa, datilógrafa no Rio, entre melancolia e resistência. Prosa lírica sobre existência frágil e linguagem.",
    isPremium: false,
    coverUrl: olCover("9780811214483"),
  },
  {
    title: "O Morro dos Ventos Uivantes",
    author: "Emily Brontë",
    synopsis:
      "Paixão destrutiva em charnecas inglesas: Cathy, Heathcliff e uma casa marcada por ódio e desejo.",
    isPremium: false,
    coverUrl: olCover("9780141439556"),
  },
  {
    title: "Memórias Póstumas de Brás Cubas",
    author: "Machado de Assis",
    synopsis:
      "Um defunto autor conta sua vida com ironia. Marco do realismo brasileiro e da narrativa não linear.",
    isPremium: false,
    coverUrl: olCover("9780195097146"),
  },
  {
    title: "O Cortiço",
    author: "Aluísio Azevedo",
    synopsis:
      "Naturalismo no Rio do século XIX: cortiço, miséria e instintos. Retrato social de uma cidade em transformação.",
    isPremium: false,
    coverUrl: olCover("9780195102673"),
  },
  {
    title: "Grande Sertão: Veredas",
    author: "João Guimarães Rosa",
    synopsis:
      "Riobaldo e o banditismo no sertão, em prosa densa e inventiva. Obra-prima da língua e do território brasileiro.",
    isPremium: true,
    coverUrl: olCover("9780394441481"),
  },
  {
    title: "A Revolução dos Bichos",
    author: "George Orwell",
    synopsis:
      "Fazenda onde animais expulsam humanos e o poder corrói ideais. Fábula política em chave satírica.",
    isPremium: true,
    coverUrl: olCover("9780452284241"),
  },
  {
    title: "O Senhor dos Anéis",
    author: "J.R.R. Tolkien",
    synopsis:
      "Frodo e a Comunidade enfrentam Sauron pela Terra-média. Épico fundacional da fantasia moderna.",
    isPremium: true,
    coverUrl: olCover("9780618640157"),
  },
  {
    title: "Duna",
    author: "Frank Herbert",
    synopsis:
      "Paul Atreides em Arrakis: especiaria, ecologia política e destino. Sci-fi de mundo aberto e denso.",
    isPremium: true,
    coverUrl: olCover("9780441013593"),
  },
  {
    title: "O Poder do Hábito",
    author: "Charles Duhigg",
    synopsis:
      "Como rotinas se formam no cérebro e na empresa — e como mudá-las. Não ficção acessível sobre comportamento.",
    isPremium: true,
    coverUrl: olCover("9780812981605"),
  },
  {
    title: "Mindset",
    author: "Carol S. Dweck",
    synopsis:
      "Mentalidade fixa versus de crescimento: impacto em aprendizado, trabalho e relações. Base em pesquisa psicológica.",
    isPremium: true,
    coverUrl: olCover("9780345472328"),
  },
  {
    title: "O Nome da Rosa",
    author: "Umberto Eco",
    synopsis:
      "Frei Guilherme investiga mortes em um mosteiro medieval. Romance histórico, teológico e de enigma.",
    isPremium: true,
    coverUrl: olCover("9780156001311"),
  },
  {
    title: "A Arte da Guerra",
    author: "Sun Tzu",
    synopsis:
      "Estratégia, engano e liderança em trechos concisos. Clássico chinês relido em negócios e vida.",
    isPremium: true,
    coverUrl: olCover("9780140439199"),
  },
  {
    title: "O Homem Mais Rico da Babilônia",
    author: "George S. Clason",
    synopsis:
      "Parábolas sobre poupar, investir e evitar dívidas. Educação financeira em linguagem de contos orientais.",
    isPremium: true,
    coverUrl: olCover("9780451205360"),
  },
  {
    title: "O Caçador de Pipas",
    author: "Khaled Hosseini",
    synopsis:
      "Amir e Hassan no Cabul pré-guerra: culpa, redenção e exílio. Drama familiar contra o pano de fundo do Afeganistão.",
    isPremium: true,
    coverUrl: olCover("9781594631931"),
  },
  {
    title: "A Culpa é das Estrelas",
    author: "John Green",
    synopsis:
      "Hazel e Gus, adolescentes com câncer, entre ironia e ternura. Romance contemporâneo sobre tempo e vínculo.",
    isPremium: false,
    coverUrl: olCover("9780525478812"),
  },
  {
    title: "O Hobbit",
    author: "J.R.R. Tolkien",
    synopsis:
      "Bilbo Bolseiro, Gandalf e os anões rumo à Montanha Solitária. Aventura que antecede o grande épico.",
    isPremium: true,
    coverUrl: olCover("9780547928227"),
  },
  {
    title: "Fundação",
    author: "Isaac Asimov",
    synopsis:
      "Psicohistória e império galáctico em declínio. Ciclo que moldou a ficção científica clássica.",
    isPremium: true,
    coverUrl: olCover("9780553293357"),
  },
  {
    title: "O Conto da Aia",
    author: "Margaret Atwood",
    synopsis:
      "Gilead: regime teocrático e corpos femininos como recurso de Estado. Distopia feminista e perturbadora.",
    isPremium: true,
    coverUrl: olCover("9780385490818"),
  },
  {
    title: "O Velho e o Mar",
    author: "Ernest Hemingway",
    synopsis:
      "Santiago, o pescador cubano, e o marlins. Prosa enxuta sobre resistência, dignidade e derrota honrosa.",
    isPremium: false,
    coverUrl: olCover("9780684801223"),
  },
  {
    title: "A Insustentável Leveza do Ser",
    author: "Milan Kundera",
    synopsis:
      "Tomas, Tereza e Sabina entre Praga e o exílio. Romance filosófico sobre peso, liberdade e coincidência.",
    isPremium: true,
    coverUrl: olCover("9780060932138"),
  },
  {
    title: "Iracema",
    author: "José de Alencar",
    synopsis:
      "Lenda de amor entre índia e português no Ceará colonial. Romance indianista e símbolo nacional.",
    isPremium: false,
    coverUrl: olCover("9780195072211"),
  },
  {
    title: "O Diário de Anne Frank",
    author: "Anne Frank",
    synopsis:
      "A adolescente escondida em Amsterdã durante o nazismo. Testemunho íntimo e humano da Segunda Guerra.",
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
