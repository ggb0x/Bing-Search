import random

def generate_realistic_terms(num_terms):
    # Lista de palavras comuns em português
    word_list = [
        "amor", "amigo", "felicidade", "tristeza", "vida", "morte", "sol", "lua", "estrela",
        "ceu", "terra", "agua", "fogo", "ar", "tempo", "espaco", "universo", "natureza",
        "animal", "planta", "flor", "fruta", "cor", "som", "silencio", "paz", "guerra",
        "politica", "economia", "sociedade", "cultura", "arte", "ciencia", "tecnologia",
        "historia", "geografia", "matematica", "fisica", "quimica", "biologia", "filosofia",
        "psicologia", "sociologia", "antropologia", "linguagem", "comunicacao", "informacao",
        "computador", "internet", "celular", "carro", "casa", "trabalho", "escola", "familia",
        "viagem", "comida", "bebida", "musica", "filme", "livro", "jogo", "esporte", "saude",
        "doenca", "medicina", "corpo", "mente", "alma", "espirito", "religiao", "deus", "fe",
        "esperanca", "sonho", "realidade", "verdade", "mentira", "bem", "mal", "justica",
        "injustica", "liberdade", "escravidao", "poder", "dinheiro", "sucesso", "fracasso",
        "beleza", "feiura", "alegria", "dor", "medo", "coragem", "odio", "perdao", "gratidao",
        "orgulho", "humildade", "paciencia", "impaciencia", "calma", "raiva", "tranquilidade"
    ]
    
    generated_terms = set()
    while len(generated_terms) < num_terms:
        term_parts = random.sample(word_list, 2)
        generated_terms.add(f"{term_parts[0]} {term_parts[1]}")
        
    return list(generated_terms)

if __name__ == "__main__":
    search_terms = generate_realistic_terms(30)
    with open("search_terms.txt", "w", encoding="utf-8") as f:
        for term in search_terms:
            f.write(term + "\n")
    print(f"{len(search_terms)} termos de pesquisa foram gerados e salvos em search_terms.txt")