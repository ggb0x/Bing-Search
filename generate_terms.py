import random

def generate_realistic_terms(num_terms):
    # Listas de palavras categorizadas
    substantivos_concretos = [
        "gato", "cachorro", "computador", "celular", "carro", "casa", "livro", "filme", "musica", "jogo",
        "pizza", "hamburguer", "viagem", "praia", "montanha", "floresta", "cidade", "rio", "ponte",
        "oculos", "camisa", "calca", "sapato", "relogio", "futebol", "basquete", "volei", "escola"
    ]
    substantivos_abstratos = [
        "amor", "amizade", "felicidade", "tristeza", "paz", "guerra", "justica", "liberdade", "democracia",
        "capitalismo", "socialismo", "ciencia", "tecnologia", "arte", "cultura", "historia", "filosofia",
        "psicologia", "economia", "politica", "sustentabilidade", "globalizacao", "esperanca", "medo"
    ]
    verbos = [
        "fazer", "criar", "aprender", "jogar", "assistir", "ler", "ouvir", "viajar", "cozinhar", "programar",
        "desenhar", "pintar", "cantar", "dancar", "estudar", "trabalhar", "investir", "economizar",
        "meditar", "exercitar", "consertar", "construir", "organizar", "limpar", "decorar", "plantar"
    ]
    adjetivos = [
        "bom", "mau", "bonito", "feio", "grande", "pequeno", "rapido", "lento", "facil", "dificil",
        "barato", "caro", "novo", "velho", "moderno", "antigo", "simples", "complexo", "engracado",
        "serio", "interessante", "chato", "util", "inutil", "saudavel", "saboroso", "sustentavel"
    ]
    locais = [
        "Brasil", "Sao Paulo", "Rio de Janeiro", "internet", "Youtube", "Netflix", "Amazon", "Google",
        "cinema", "restaurante", "parque", "museu", "biblioteca", "loja", "online", "em casa"
    ]
    produtos_servicos = [
        "smartphone", "notebook", "curso online", "passagem aerea", "hotel", "seguro de carro", "plano de saude",
        "cartao de credito", "investimento", "software", "jogo de videogame", "servico de streaming"
    ]

    # Modelos de pesquisa
    templates = [
        "o que e {substantivo_abstrato}",
        "como {verbo} {substantivo_concreto}",
        "melhores {substantivo_concreto}s para {verbo}",
        "qual a diferenca entre {substantivo_abstrato} e {substantivo_abstrato}",
        "noticias sobre {substantivo_abstrato}",
        "receita de {substantivo_concreto}",
        "onde encontrar {substantivo_concreto} {adjetivo}",
        "curso de {substantivo_concreto}",
        "preco de {produto_servico}",
        "como funciona {produto_servico}",
        "vale a pena {produto_servico}?",
        "critica do filme {substantivo_concreto}",
        "resumo do livro {substantivo_concreto}",
        "{substantivo_concreto} vs {substantivo_concreto}",
        "dicas para {verbo} melhor",
        "os {substantivo_concreto}s mais {adjetivo}s de {locais}",
        "viagem para {locais}",
        "o que fazer em {locais}",
    ]

    word_map = {
        "{substantivo_concreto}": substantivos_concretos,
        "{substantivo_abstrato}": substantivos_abstratos,
        "{verbo}": verbos,
        "{adjetivo}": adjetivos,
        "{locais}": locais,
        "{produto_servico}": produtos_servicos,
    }

    generated_terms = set()
    while len(generated_terms) < num_terms:
        template = random.choice(templates)
        term = template
        
        # Preenche o template com palavras aleatorias das listas correspondentes
        for placeholder, word_list in word_map.items():
            if placeholder in term:
                # Garante que a mesma palavra nao seja usada duas vezes no mesmo termo
                words_to_sample = random.sample(word_list, k=term.count(placeholder))
                for word in words_to_sample:
                    term = term.replace(placeholder, word, 1)

        generated_terms.add(term)

    return list(generated_terms)

if __name__ == "__main__":
    search_terms = generate_realistic_terms(33)
    with open("search_terms.txt", "w", encoding="utf-8") as f:
        for term in search_terms:
            f.write(term + "\n")
    print(f"{len(search_terms)} termos de pesquisa unicos foram gerados e salvos em search_terms.txt")