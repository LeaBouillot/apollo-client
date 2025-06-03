# Projet Apollo Server

Ce projet met en place un backend GraphQL avec **Apollo Server**, en organisant le schéma et les résolveurs de manière modulaire par fonctionnalité.

- https://www.apollographql.com/docs/apollo-server/getting-started

## Structure du projet

- Le schéma GraphQL (`typeDefs`) et les résolveurs sont répartis dans plusieurs fichiers situés dans le dossier `typedefs-resolvers`.
- Les fonctionnalités/modules incluent :
  - Requêtes (Queries) et Mutations
  - Énumérations (Enums)
  - Équipes (Teams), Personnes (People), Rôles (Roles)
  - Équipements (Equipments), Logiciels (Softwares), Fournitures (Supplies), Outils (Tools)
  - Givens (éléments spécifiques du projet)

## Installation

- npm i graphql apollo-server
- Server ready at http://localhost:4000/
