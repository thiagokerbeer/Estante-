import { Router } from "express";

export const legalRouter = Router();

/** Resumo para portfólio/demo — transparência (LGPD art. 9) sem substituir política jurídica completa. */
legalRouter.get("/privacy-notice", (_req, res) => {
  res.json({
    version: "1.2",
    project: "Estante+ (demonstração / portfólio)",
    controller: "Responsável pelo projeto (desenvolvedor do portfólio — não é empresa).",
    lgpdLaw: "Lei nº 13.709/2018 (LGPD)",
    lgpdInPractice: [
      {
        article: "Art. 6º",
        summary: "Princípios como finalidade, adequação, necessidade, segurança e transparência no tratamento.",
      },
      {
        article: "Art. 8º",
        summary: "Bases legais incluem consentimento quando o titular concorda de forma explícita (ex.: cadastro).",
      },
      {
        article: "Art. 9º",
        summary: "O controlador deve informar de forma clara sobre o tratamento — este endpoint e a página /privacidade cumprem papel didático.",
      },
      {
        article: "Art. 18º",
        summary:
          "Direitos do titular: confirmação, acesso, correção, anonimização, eliminação, portabilidade e informação sobre compartilhamentos (neste app: export e exclusão de conta).",
      },
    ],
    purpose:
      "Autenticação, conta gratuita ou simulada (plano PLUS de demonstração) e controle de acesso a conteúdo de exemplo (livros).",
    dataCategories: [
      {
        category: "Identificação e autenticação",
        items: ["E-mail", "Senha (armazenada apenas como hash)"],
      },
      {
        category: "Uso do serviço",
        items: ["Plano (FREE/PLUS)", "Data de término simulada do PLUS", "Registro de aceite do aviso de privacidade"],
      },
    ],
    legalBases: [
      "Execução de cadastro e login (tratamento necessário para o serviço oferecido).",
      "Consentimento explícito no cadastro (aceite do aviso de privacidade).",
    ],
    retention:
      "Dados mantidos enquanto a conta existir. Ambiente de demonstração: pode ser apagado a qualquer momento; não use dados reais sensíveis.",
    rights: [
      "Confirmação e acesso aos dados (GET /auth/me e GET /auth/data-export).",
      "Eliminação da conta e dos dados (DELETE /auth/me).",
      "Revogação de consentimento ao não criar conta ou ao excluir a conta.",
    ],
    security:
      "Senha com hash (bcrypt), JWT assinado em HS256, checagem de que o usuário ainda existe após o login (evita sessão após exclusão), Helmet, rate limit em auth/leitura/assinatura e HTTPS recomendado em produção.",
    contact:
      "Para este projeto de portfólio, use o contato indicado no repositório ou perfil do autor (não há encarregado formal em ambiente pessoal de demo).",
    disclaimer:
      "Texto educativo para portfólio. Não substitui política de privacidade, registro de operações de tratamento (ROPA) nem contratos em produção.",
    lastUpdated: "2026-04-09",
  });
});
