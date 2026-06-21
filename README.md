# SynergyMaker - System Doboru Zespołu Projektowego

SynergyMaker to system umożliwiający inteligentny dobór zespołu projektowego na podstawie synergii między członkami zespołu. Aplikacja analizuje historię współpracy między ludźmi, oblicza wskaźniki synergii i automatycznie optymalizuje skład zespołu.

## Główne Funkcjonalności

- **Zarządzanie Rolami** - Definiowanie dostępnych ról w organizacji
- **Zarządzanie Osobami** - Dodawanie pracowników i przypisywanie im ról
- **Zarządzanie Relacjami** - Śledzenie historii współpracy między ludźmi (sukcesy i porażki)
- **Optymalizacja Zespołu** - Automatyczne wybranie najlepszego zespołu na podstawie wymaganych ról i maksymalnej synergii
- **Wizualizacja Sieci** - Graficzna reprezentacja sieci relacji między pracownikami
- **Wyszukiwanie** - Szybkie wyszukiwanie pracowników

## Architektura

### Stack Techniczny

- **Backend**: Node.js + Express
- **Baza Danych**: Neo4j (baza grafowa)
- **Frontend**: HTML/CSS/JavaScript

### Struktura Projektu

```
src/
├── app.js                 # Główna aplikacja Express
├── db.js                 # Konfiguracja połączenia Neo4j
├── routes/
│   ├── api.js            # Endpoints API
│   └── testing.js        # Endpoints do testowania
└── public/
    ├── views/            # Szablony HTML
    ├── css/              # Arkusze stylów
    └── js/
        └── main.js       # Skrypty frontend
```

## API Endpoints

### Zarządzanie Rolami

- `GET /api/roles` - Pobierz wszystkie role
- `POST /api/roles` - Dodaj nową rolę

### Zarządzanie Osobami

- `GET /api/people` - Pobierz wszystkie osoby
- `POST /api/people` - Dodaj nową osobę

### Zarządzanie Relacjami

- `POST /api/relations` - Dodaj/zaktualizuj relację
- `GET /api/people/:id/relations` - Pobierz relacje osoby

### Optymalizacja Zespołu

- `POST /api/team/optimize` - Optymalizuj skład zespołu
- `GET /api/graph` - Pobierz graf sieci

## Instalacja i Uruchomienie

### Wymagania

- Node.js (v14+)
- Neo4j (lokalnie lub zdalnie)

### Uruchomienie poprzez docker

```bash
docker-compose up --build
```

### Uruchomienie ręczne

1. Zainstaluj zależności:

```bash
npm install
```

2. Ustaw zmienne środowiskowe:

```bash
export NEO4J_URI=bolt://localhost:7687
export NEO4J_USER=neo4j
export NEO4J_PASSWORD=password123
export PORT=3000
```

3. Uruchom aplikację:

```bash
npm start
```

### URL i Port

Aplikacja będzie dostępna pod adresem: http://localhost:3000

Dane przykładowe mozna wygenerować wchodząc do aplikacji i klikając przycisk "Załaduj 25 testowych osób" lub odwiedzając adres: http://localhost:3000/testing/add-sample-data

## Generowanie Dokumentacji

Dokumentacja API generowana jest automatycznie z komentarzy JSDoc:

```bash
npm run docs
```

Dokumentacja zostanie wygenerowana w katalogu `docs/` i będzie dostępna w pliku `index.html`.

## Algorytm Optymalizacji

System wykorzystuje algorytm backtrackingu do znalezienia optymalnego zestawu zespołu:

1. Filtruje kandydatów na podstawie wymaganych ról
2. Oblicza synergię jako różnicę między sukcesami a porażkami w relacjach
3. Znajduje kombinację osób maksymalizującą całkowitą synergię
4. Respektuje vinchistoria współpracy

## Metryka Synergii

Synergią między dwoma pracownikami jest obliczana jako:

```
synergy = successes - failures
```

Całkowita synergią zespołu to suma synergii wszystkich par członków.

## Zapytania Cypher w Aplikacji

System wykorzystuje Neo4j jako bazę danych grafową. Poniżej znajduje się kompletny spis wszystkich zapytań Cypher używanych w aplikacji:

### Zarządzanie Rolami

```cypher
// Pobierz wszystkie role
MATCH (r:Role) RETURN r ORDER BY r.name ASC

// Dodaj lub zaktualizuj rolę
MERGE (r:Role {name: $name})
```

### Zarządzanie Osobami

```cypher
// Pobierz wszystkie osoby z ich rolami
MATCH (p:Person)
OPTIONAL MATCH (p)-[:HAS_ROLE]->(r:Role)
RETURN p.id AS id, p.name AS name, r.name AS role
ORDER BY p.name ASC

// Dodaj nową osobę z rolą
CREATE (p:Person {id: $id, name: $name})
WITH p
MATCH (r:Role {name: $role})
CREATE (p)-[:HAS_ROLE]->(r)
```

### Zarządzanie Relacjami Współpracy

```cypher
// Dodaj lub zaktualizuj relację współpracy
MATCH (p1:Person {id: $person1Id})
MATCH (p2:Person {id: $person2Id})
MERGE (p1)-[r:COOPERATED]-(p2)
SET r.successes = $s, r.failures = $f

// Pobierz relacje danej osoby
MATCH (p:Person {id: $id})-[r:COOPERATED]-(o:Person)
OPTIONAL MATCH (o)-[:HAS_ROLE]->(role:Role)
RETURN o.id AS id, o.name AS name, role.name AS role,
       r.successes AS successes, r.failures AS failures
```

### Wizualizacja Sieci Grafu

```cypher
// Pobierz wszystkie węzły (osoby) z ich rolami
MATCH (p:Person)-[:HAS_ROLE]->(r:Role)
RETURN p.id AS id, p.name AS name, r.name AS role

// Pobierz wszystkie krawędzie (relacje współpracy)
MATCH (p1:Person)-[r:COOPERATED]->(p2:Person)
RETURN p1.id AS s, p2.id AS t, r.successes AS succ, r.failures AS fail
```

### Optymalizacja Zespołu

```cypher
// Pobierz kandydatów na członków zespołu dla wymaganych ról
MATCH (p:Person)-[:HAS_ROLE]->(r:Role)
WHERE NOT p.id IN $excludeIds AND r.name IN $roles
RETURN p.id AS id, p.name AS name, r.name AS role

// Pobierz krawędzie współpracy między kandydatami
MATCH (p1:Person)-[r:COOPERATED]-(p2:Person)
WHERE p1.id IN $ids AND p2.id IN $ids
RETURN p1.id AS p1, p2.id AS p2, r.successes AS s, r.failures AS f
```

### Inicjalizacja Danych Testowych

```cypher
// Usuń wszystkie dane
MATCH (n) DETACH DELETE n

// Utwórz rolę
CREATE (:Role {name: $r})

// Utwórz osobę z rolą
CREATE (person:Person {id: $id, name: $name})
WITH person
MATCH (r:Role {name: $role})
CREATE (person)-[:HAS_ROLE]->(r)

// Utwórz relację współpracy
MATCH (a:Person {id: $p1}), (b:Person {id: $p2})
CREATE (a)-[:COOPERATED {successes: $s, failures: $f}]->(b)
```

## Architektura Systemu

### Diagram Klas (Class Diagram)

```
┌─────────────────────────────────────────────────────────────┐
│                     SynergyMaker System                       │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────┐         ┌──────────────────────┐
│      Role Node       │         │    Person Node       │
├──────────────────────┤         ├──────────────────────┤
│ - name: String       │         │ - id: String         │
│                      │         │ - name: String       │
└──────────────────────┘         └──────────────────────┘
           △                               △
           │                               │
           └───────────┬───────────────────┘
                       │
                  HAS_ROLE (edge)

┌──────────────────────────────────────────┐
│   COOPERATED (edge/relationship)         │
├──────────────────────────────────────────┤
│ - successes: Integer (default: 0)        │
│ - failures: Integer (default: 0)         │
│ - synergy: successes - failures          │
└──────────────────────────────────────────┘
            (connects Person to Person)
```

### Diagram Modelu Danych (Entity-Relationship)

```
                      HAS_ROLE
            ┌──────────────────────────┐
            │                          │
        ┌───────────┐           ┌─────────────┐
        │  Person   │           │    Role     │
        ├───────────┤           ├─────────────┤
        │ id (PK)   │           │ name (PK)   │
        │ name      │           └─────────────┘
        └───────────┘
            │
            │ COOPERATED (bidirectional)
            │ {successes, failures}
            │
        ┌───────────┐
        │  Person   │
        │ (różny)   │
        └───────────┘
```

### Przepływ Danych w Aplikacji

```
Frontend (HTML/CSS/JS)
        │
        ├─ Formularz dla ról
        ├─ Formularz dla osób
        ├─ Formularz dla relacji
        ├─ Wizualizacja sieci (D3.js)
        └─ Panel optymalizacji zespołu

        │ (HTTP Requests)
        ▼
Backend (Express.js)
        │
        ├─ GET/POST /api/roles
        ├─ GET/POST /api/people
        ├─ POST /api/relations
        ├─ GET /api/people/:id/relations
        ├─ GET /api/graph
        └─ POST /api/team/optimize

        │ (Cypher Queries)
        ▼
Database (Neo4j)
        │
        ├─ Role Nodes
        ├─ Person Nodes
        ├─ HAS_ROLE Edges
        └─ COOPERATED Edges
```

### Komponenty Systemu

- **Frontend (Public)**
  - views/ - Szablony HTML dla interfejsu użytkownika
  - css/ - Style CSS dla aplikacji
  - js/main.js - Logika frontendowa i komunikacja z API

- **Backend (Express.js)**
  - app.js - Główna konfiguracja aplikacji Express
  - routes/api.js - Implementacja API endpoints
  - routes/testing.js - Endpoints dla testowania (dodawanie przykładowych danych)

- **Baza Danych (Neo4j)**
  - db.js - Zarządzanie połączeniem z Neo4j
  - Węzły: Role, Person
  - Relacje: HAS_ROLE, COOPERATED

### Algorytm Optymalizacji Zespołu

System wykorzystuje **algorytm backtrackingu** do znalezienia optymalnego zestawu zespołu:

1. Pobiera kandydatów o wymaganych rolach z bazy danych (Cypher)
2. Buduje mapę synergii między kandydatami na podstawie COOPERATED edges
3. Dla każdej roli generuje wszystkie możliwe kombinacje kandydatów
4. Dla każdej kombinacji oblicza sumę synergii między wszystkimi parami
5. Weryfikuje, czy zespół zawiera wszystkie osoby z listy includeIds
6. Zwraca zespół z najwyższą synergią

**Złożoność:** O(n!) w najgorszym przypadku, gdzie n to liczba kandydatów

### Bezpieczeństwo i Best Practices

- Wszystkie zapytania Cypher używają parametryzowanych zmiennych ($param) aby zapobiec wstrzykiwaniu
- Połączenie z Neo4j jest zabezpieczone authentication (user/password)
- Sesje Neo4j są prawidłowo zamykane w blokach finally
- Brak bezpośredniego dostępu do bazy danych - wszystko przez API

### Technologie i Zależności

- **Node.js** - Runtime JavaScript dla backendu
- **Express.js** - Framework webowy
- **neo4j-driver** - Oficjalny driver Neo4j dla Node.js
- **D3.js** (frontend) - Wizualizacja sieci grafowej
- **Docker** - Konteneryzacja aplikacji
- **JSDoc** - Generowanie dokumentacji API
